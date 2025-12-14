import axios from 'axios';

// Hugging Face API configuration
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';
const API_KEY = process.env.HUGGINGFACE_API_KEY;

// Cache for summarization results
const summaryCache = new Map();
const CACHE_DURATION = 3600000; // 1 hour

/**
 * Simple extractive summarization (fallback when API fails)
 * Extracts the most important sentences from the text
 */
function simpleExtractiveSummary(text, maxSentences = 3) {
  // Split into sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  // Simple scoring: longer sentences with important words
  const importantWords = ['the', 'is', 'are', 'was', 'were', 'this', 'that', 'these', 'those'];
  const scored = sentences.map(sentence => {
    const words = sentence.toLowerCase().split(/\s+/);
    const wordCount = words.length;
    const importantCount = words.filter(w => importantWords.includes(w)).length;
    const score = wordCount * 0.5 + importantCount * 2;
    return { sentence: sentence.trim(), score };
  });
  
  // Sort by score and take top sentences
  scored.sort((a, b) => b.score - a.score);
  const summary = scored.slice(0, maxSentences)
    .sort((a, b) => sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence))
    .map(s => s.sentence)
    .join(' ');
  
  return summary || text.substring(0, Math.min(200, text.length));
}

export const summarizationService = {
  /**
   * Summarize text using Hugging Face API with fallback
   */
  async summarizeText(text, options = {}) {
    try {
      // Validate input
      if (!text || text.trim().length === 0) {
        return {
          success: false,
          error: 'No text provided for summarization'
        };
      }

      const originalText = text.trim();
      const wordCount = originalText.split(/\s+/).length;
      
      // Text should have at least 20 words (reduced from 50 for better UX)
      if (wordCount < 20) {
        return {
          success: false,
          error: 'Text is too short. Please provide at least 20 words for summarization.'
        };
      }

      // Truncate if too long
      let textToSummarize = originalText;
      if (wordCount > 1000) {
        textToSummarize = originalText.split(/\s+/).slice(0, 1000).join(' ');
        console.log('[Summarization] Text truncated to 1000 words');
      }

      // Check cache
      const cacheKey = textToSummarize.substring(0, 100);
      const cached = summaryCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('[Summarization] Cache hit');
        return cached.data;
      }

      // Try Hugging Face API first (if API key exists)
      if (API_KEY) {
        try {
          console.log('[Summarization] Attempting Hugging Face API...');
          
          const response = await axios.post(
            HUGGINGFACE_API_URL,
            {
              inputs: textToSummarize,
              parameters: {
                max_length: options.maxLength || 150,
                min_length: options.minLength || 30,
                do_sample: false
              }
            },
            {
              headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
              },
              timeout: 45000 // 45 seconds
            }
          );

          // Handle model loading
          if (response.status === 503 || response.data?.error) {
            const errorMsg = response.data?.error || '';
            if (errorMsg.includes('loading')) {
              console.log('[Summarization] Model loading, using fallback');
              // Fall through to fallback
            } else {
              throw new Error(errorMsg || 'Model unavailable');
            }
          } else {
            // Parse successful response
            let summaryText = '';
            
            if (response.data?.summary_text) {
              summaryText = response.data.summary_text;
            } else if (Array.isArray(response.data) && response.data[0]?.summary_text) {
              summaryText = response.data[0].summary_text;
            } else if (response.data?.generated_text) {
              summaryText = response.data.generated_text;
            } else if (Array.isArray(response.data) && response.data[0]?.generated_text) {
              summaryText = response.data[0].generated_text;
            }
            
            if (summaryText && summaryText.trim().length > 0) {
              const result = {
                success: true,
                summary: summaryText.trim(),
                originalWordCount: wordCount,
                summaryWordCount: summaryText.trim().split(/\s+/).length,
                compressionRatio: ((summaryText.trim().split(/\s+/).length / wordCount) * 100).toFixed(1),
                model: 'facebook/bart-large-cnn'
              };
              
              // Cache result
              summaryCache.set(cacheKey, {
                data: result,
                timestamp: Date.now()
              });
              
              console.log('[Summarization] Success with Hugging Face');
              return result;
            }
          }
        } catch (apiError) {
          console.log('[Summarization] API error, using fallback:', apiError.message);
          // Fall through to extractive summarization
        }
      } else {
        console.log('[Summarization] No API key, using extractive summarization');
      }

      // Fallback: Use simple extractive summarization
      console.log('[Summarization] Using extractive summarization fallback');
      const maxSentences = Math.max(2, Math.min(5, Math.floor(wordCount / 50)));
      const summaryText = simpleExtractiveSummary(textToSummarize, maxSentences);
      
      const result = {
        success: true,
        summary: summaryText,
        originalWordCount: wordCount,
        summaryWordCount: summaryText.split(/\s+/).length,
        compressionRatio: ((summaryText.split(/\s+/).length / wordCount) * 100).toFixed(1),
        model: 'extractive (fallback)'
      };
      
      // Cache result
      summaryCache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
      
      // Limit cache size
      if (summaryCache.size > 100) {
        const firstKey = summaryCache.keys().next().value;
        summaryCache.delete(firstKey);
      }
      
      console.log('[Summarization] Success with extractive method');
      return result;

    } catch (error) {
      console.error('[Summarization] Error:', error.message);
      
      // Last resort: return a simple extractive summary
      try {
        const summaryText = simpleExtractiveSummary(text, 3);
        return {
          success: true,
          summary: summaryText,
          originalWordCount: text.split(/\s+/).length,
          summaryWordCount: summaryText.split(/\s+/).length,
          compressionRatio: '50.0',
          model: 'extractive (fallback)'
        };
      } catch (fallbackError) {
        return {
          success: false,
          error: 'Failed to generate summary. Please try again.'
        };
      }
    }
  },

  /**
   * Get summarization statistics
   */
  getSummaryStats(originalText, summaryText) {
    const originalWords = originalText.split(/\s+/).length;
    const summaryWords = summaryText.split(/\s+/).length;
    const originalChars = originalText.length;
    const summaryChars = summaryText.length;

    return {
      originalWordCount: originalWords,
      summaryWordCount: summaryWords,
      originalCharCount: originalChars,
      summaryCharCount: summaryChars,
      wordReduction: originalWords - summaryWords,
      charReduction: originalChars - summaryChars,
      compressionRatio: ((summaryWords / originalWords) * 100).toFixed(1),
      timeSaved: Math.ceil((originalWords - summaryWords) / 200)
    };
  },

  /**
   * Clear cache
   */
  clearCache() {
    summaryCache.clear();
    console.log('[Summarization] Cache cleared');
  }
};