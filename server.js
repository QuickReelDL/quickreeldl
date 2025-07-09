
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
    const response = await fetch("https://snapinsta.app/api/ajaxSearch", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Origin": "https://snapinsta.app",
        "Referer": "https://snapinsta.app/en",
        "User-Agent": "Mozilla/5.0"
      },
      body: new URLSearchParams({
        q: url,
        t: "media",
        lang: "en"
      }),
    });

    const html = await response.text();

    // Attempt to extract video URL
    const match = html.match(/href="(https:\/\/[^"]+\.mp4)"/);
    if (!match || !match[1]) {
      return res.status(404).json({ error: "No video found in SnapInsta response." });
    }

    return res.json({
      title: "Instagram Reel",
      videoUrl: match[1]
    });
  } catch (err) {
    console.error("SnapInsta request failed:", err);
    res.status(500).json({ error: "Backend crashed. Check SnapInsta or try another API." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
