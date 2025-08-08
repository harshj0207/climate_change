const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const path = require("path");

dotenv.config();
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/get-forecast", async (req, res) => {
  const location = req.body.location;

  const prompt = `Forecast climate impacts for "${location}" by analyzing historical climate data, current environmental conditions, and human activities. Inform effective mitigation strategies. Return the result in 4–6 lines.`;

  try {
    const result = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        contents: [
          {
            parts: [{ text: prompt }],
            role: "user",
          },
        ],
      }
    );

    const reply =
      result.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    res.json({ reply });
  } catch (error) {
    console.error("❌ Gemini API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get response from Gemini." });
  }
});

app.listen(port, () => {
  console.log(`🌐 Server running at http://localhost:${port}`);
});
