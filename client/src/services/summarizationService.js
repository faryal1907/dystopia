import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000/api/summarization';

export const summarizationService = {
  async summarizeText(text, options = {}) {
    if (!text || text.trim().length === 0) {
      return { success: false, error: 'No text provided.' };
    }

    try {
      const response = await axios.post(BACKEND_URL, {
        text,
        maxLength: options.maxLength || 130,
      });

      return { success: true, summary: response.data.summary };
    } catch (err) {
      console.error('Summarization error:', err.response?.data || err.message);
      return { success: false, error: 'Failed to summarize text. Try again.' };
    }
  },
};
