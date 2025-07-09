
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const app = express();
const PORT = process.env.PORT || 3000;

// Your personal Apify API token
const APIFY_TOKEN = process.env.APIFY_TOKEN;
app.use(cors());
app.use(express.json());

app.post("/api/preview", async (req, res) => {
  const { url } = req.body;

  if (!url || !url.includes("instagram.com")) {
    return res.status(400).json({ error: "Invalid Instagram URL" });
  }

  try {
    const response = await fetch(
      `https://api.apify.com/v2/acts/presetshubham~instagram-reel-downloader/run-sync-get-dataset-items?token=${APIFY_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reelLinks: [url],
          proxyConfiguration: { useApifyProxy: true }
        })
      }
    );

    const results = await response.json();
    const first = results[0];
    if (!first || !first.videoUrl) {
      return res.status(404).json({ error: "Video not found" });
    }

    return res.json({
      title: first.title || "Instagram Reel",
      videoUrl: first.videoUrl
    });
  } catch (err) {
    console.error("Apify fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch video from Apify" });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
