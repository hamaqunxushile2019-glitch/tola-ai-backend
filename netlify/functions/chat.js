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
      return {
        statusCode: 502,
        body: JSON.stringify({ error: "Tajaajilli AI deebii kennuu hin dandeenye." })
      };
    }

    const answer = data.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "").join("") || "Deebii hin arganne.";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Rakkoo server uumame." })
    };
  }
};
            
