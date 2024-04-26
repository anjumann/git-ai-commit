import Groq from "groq-sdk";
import { apiKey, config } from "./utils.js";


const groq = new Groq({
    apiKey: apiKey
});


const res = await getGroqChatCompletion();

export const chatCompletion  = res.choices[0]?.message?.content || "" 
async function getGroqChatCompletion() {
    return groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: "Explain the importance of fast language models"
            }
        ],
        model: config.model,
    });
}