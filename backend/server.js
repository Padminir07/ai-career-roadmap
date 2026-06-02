const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/roadmap", async (req, res) => {
  const { career } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Create a detailed roadmap for becoming a ${career}. 
            Include:
            - skills to learn
            - tools/technologies
            - project ideas
            - career tips
            Add suitable emojis for every point.

Example:
📘 Learn Basics
💻 Build Projects
🧠 Practice DSA
🚀 Apply for Jobs

            Give everything in proper step-by-step points.`,
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
    console.log(error.response?.data || error.message);

    res.json({
      roadmap: "Error generating roadmap",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});