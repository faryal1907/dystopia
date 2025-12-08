import express from 'express';
import axios from 'axios';
const router = express.Router();

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY; // keep your key secret
const HUGGINGFACE_API = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';

router.post('/', async (req, res) => {
  const { text, maxLength } = req.body;
  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: 'No text provided.' });
  }

  try {
    const response = await axios.post(
      HUGGINGFACE_API,
      { inputs: text, parameters: { max_new_tokens: maxLength || 130 } },
      { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
    );

    const summary =
      Array.isArray(response.data) && response.data[0]?.summary_text
        ? response.data[0].summary_text
        : response.data.summary_text;

    if (!summary) throw new Error('Unexpected response from Hugging Face API');

    res.json({ summary });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to summarize text. Try again.' });
  }
});

export default router;
