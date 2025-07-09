
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/preview', async (req, res) => {
  const { url } = req.body;

  // Simulated response for demo purposes
  if (!url || !url.includes('instagram.com')) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  // Replace this with real scraping logic or external API
  return res.json({
    title: 'Example Instagram Reel',
    videoUrl: 'https://example.com/demo-video.mp4'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
