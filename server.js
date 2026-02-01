const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Test route (very important)
app.get('/', (req, res) => {
  res.send('Daizy backend is running');
});

// Chat route
app.post('/chat', async (req, res) => {
  console.log('Incoming request body:', req.body);

  const userMessage = req.body.message;
  if (!userMessage) {
    return res.status(400).json({ error: 'No message provided' });
  }

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/gpt2',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: userMessage })
      }
    );

    const data = await response.json();
    console.log('Hugging Face response:', data);

    const reply =
      Array.isArray(data) && data[0]?.generated_text
        ? data[0].generated_text
        : 'Sorry, I could not generate a response.';

    res.json({ reply });
  } catch (error) {
    console.error('SERVER ERROR:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
