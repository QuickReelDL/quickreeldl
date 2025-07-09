
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/preview', async (req, res) => {
  const { url } = req.body;

  if (!url || !url.includes('instagram.com')) {
    return res.status(400).json({ error: 'Invalid Instagram URL' });
  }

  try {
    const response = await fetch(
      `https://instagram-reels-downloader-api.p.rapidapi.com/download?url=${encodeURIComponent(url)}`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '7771c6e7e2msh1b9924108433e41p146a14jsne5111391c294',
          'X-RapidAPI-Host': 'instagram-reels-downloader-api.p.rapidapi.com'
        }
      }
    );

    const data = await response.json();

    if (!data.video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    return res.json({
      title: data.title || 'Instagram Reel',
      videoUrl: data.video
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch video' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
