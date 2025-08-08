import express from "express";
import fetch from "node-fetch";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Serve all static files (HTML, CSS, JS, images)
app.use(express.static(path.resolve()));

// Parse JSON requests
app.use(express.json());

// Gemini API route
app.post("/api/forecast", async (req, res) => {
  const { location } = req.body;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: `Give me a climate forecast for ${location} in short and clear language.` }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Start server (for local testing)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
