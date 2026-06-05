const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ROUTE
app.post("/generate-roadmap", async (req, res) => {

  const { career } = req.body;

  try {

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct",

        messages: [
          {
            role: "user",
            content: `
Create a detailed roadmap for becoming a ${career}.

Use EXACTLY this structure:

📘 Learn the Basics:
1. Detailed learning point
2. Detailed learning point
3. Detailed learning point

🧠 Develop Skills:
1. Detailed learning point
2. Detailed learning point
3. Detailed learning point

🚀 Build Projects:
1. Detailed project idea
2. Detailed project idea
3. Detailed project idea

💼 Career Growth:
1. Detailed career tip
2. Detailed career tip
3. Detailed career tip

✨ Conclusion:
Write 2 motivational sentences.

IMPORTANT RULES:

- Do NOT use markdown
- Do NOT use **
- Do NOT use *
- Do NOT create nested numbering
- Only section headings and numbered points
- Add emojis only in section headings
- Each point should be descriptive
- Each point should contain around 12-20 words
- Explain what the student should learn or do
- Keep language simple and beginner friendly
- Make roadmap practical and realistic
`
          }
        ]
      },

      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const roadmap =
      response.data.choices[0].message.content;

    res.json({
      roadmap
    });

  } catch (error) {

    console.log("==============");
    console.log("FULL ERROR");
    console.log("==============");

    console.log(error.response?.data);
    console.log(error.response?.status);
    console.log(error.message);

    res.status(500).json({
      roadmap: "❌ Error generating roadmap"
    });

  }

});

// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
