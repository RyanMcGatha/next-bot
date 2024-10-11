import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getOpenAIResponse(userMessage, prompt) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: userMessage },
      ],
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error fetching completion from OpenAI:", error.message);
    throw new Error(
      "Failed to fetch response from OpenAI. Please check your API key and network connectivity."
    );
  }
}

export { getOpenAIResponse };
