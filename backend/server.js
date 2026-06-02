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
        model: "openai/gpt-3.5-turbo",

        messages: [
          {
            role: "user",
            content: `
Create a detailed roadmap for becoming a ${career}.

Include:
- skills to learn
- tools/technologies
- project ideas
- career tips

Add emojis for every point.

Example:
📘 Learn Basics
💻 Build Projects
🧠 Practice DSA
🚀 Apply for Jobs

Give everything in step-by-step numbered points.
`,
          },
        ],
      },

      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const roadmap =
      response.data.choices[0].message.content;

    res.json({
      roadmap,
    });

  } catch (error) {

    console.log(
      error.response?.data || error.message
    );

    res.status(500).json({
      roadmap: "❌ Error generating roadmap",
    });

  }

});

// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});