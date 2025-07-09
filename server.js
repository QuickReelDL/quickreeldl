
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/api/preview", async (req, res) => {
  const { url } = req.body;

  if (!url || !url.includes("instagram.com")) {
    return res.status(400).json({ error: "Invalid Instagram URL" });
  }

  try {
    const response = await fetch("https://snapinsta.io/api/ajaxSearch", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Origin": "https://snapinsta.io",
        "Referer": "https://snapinsta.io/en",
        "User-Agent": "Mozilla/5.0"
      },
      body: new URLSearchParams({
        q: url,
        t: "media",
        lang: "en"
      })
    });

    const html = await response.text();

    const match = html.match(/href="(https:\/\/[^"]+\.mp4)"/);
    if (!match) return res.status(404).json({ error: "Video not found" });

    const videoUrl = match[1];

    return res.json({
      title: "Instagram Reel",
      videoUrl
    });
  } catch (err) {
    console.error("SnapInsta error:", err);
    res.status(500).json({ error: "SnapInsta API failed" });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
