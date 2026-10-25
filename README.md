
const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Tola AI Backend is running!");
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, language } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Gaaffii kee barreessi."
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "AI API key hin qophoofne."
      });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: `Ati Tola AI, gargaaraa barnootaa ti. Afaan ${language || "Afaan Oromoo"} fayyadami. Barattootaa fi barsiisotaaf deebii sirrii, salphaa fi kabajaa qabu kenni.`
            }]
          },
          contents: [{
            role: "user",
            parts: [{ text: message }]
          }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(502).json({
        error: "Tajaajilli AI deebii kennuu hin dandeenye."
      });
    }

    const answer =
      data.candidates?.[0]?.content?.parts
        ?.map(part => part.text || "")
        .join("") || "Deebii hin arganne.";

    res.json({ answer });

  } catch (error) {
    res.status(500).json({
      error: "Rakkoo server uumame."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Tola AI backend port ${PORT} irratti baname.`);
});
# tola-ai-backend
