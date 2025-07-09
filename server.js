
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
    // Call a public API to get reel data
    const apiUrl = `https://aiovideodl.ml/api/ig?url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Check if valid
    if (!data.medias || !data.medias[0]?.url) {
      return res.status(404).json({ error: 'Video not found' });
    }

    return res.json({
      title: data.title || "Instagram Reel",
      videoUrl: data.medias[0].url
    });
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: 'Failed to fetch video' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
