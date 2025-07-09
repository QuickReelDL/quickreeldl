
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
    const response = await fetch("https://instasupersave.com/api/convert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "https://instasupersave.com",
        "Referer": "https://instasupersave.com/"
      },
      body: JSON.stringify({ url })
    });

    const data = await response.json();

    const videoUrl = data?.media?.[0]?.url;
    if (!videoUrl) {
      return res.status(404).json({ error: "Video not found" });
    }

    return res.json({
      title: "Instagram Reel",
      videoUrl
    });
  } catch (err) {
    console.error("API fetch failed:", err);
    return res.status(500).json({ error: "Failed to fetch video" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
