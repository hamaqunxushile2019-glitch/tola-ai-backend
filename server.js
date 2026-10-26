
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "POST qofa fayyadami." })
    };
  }

  try {
    const { message, language } = JSON.parse(event.body || "{}");
    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Gaaffii kee barreessi." })
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Gemini API key hin qophoofne." })
      };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `Ati Tola AI, gargaaraa barnootaa ti. Afaan ${language || "Afaan Oromoo"} fayyadami. Barattootaa fi barsiisotaaf deebii sirrii, salphaa fi kabajaa qabu kenni.`
    });

    const result = await model.generateContent(message);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer: result.response.text() })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Rakkoo uumame. Irra deebi'i." })
    };
  }
};
      
