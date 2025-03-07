import { Request, Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth";
import { v4 as uuidv4 } from "uuid";
import OpenAI from 'openai'


const openai = new OpenAI({
  apiKey: process.env.API_KEY || '',
})

// ✅ Handle Sending Messages to OpenAI and Storing History
export const chatWithOpenAI = async (req: AuthRequest, res: Response): Promise<void>   => {
  try {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    } 

    const { message } = req.body;
    if (!message) {
        res.status(400).json({ message: "Message is required" });
        return;
    } 

    const user = await User.findById(req.user);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return
    } 

    // // Call OpenAI API
    // const response = await openai.createChatCompletion({
    //   model: "gpt-3.5-turbo",
    //   messages: [{ role: "user", content: message }],
    // });

    // const botReply = response.data.choices[0].message?.content || "No response";

    // // Generate unique message ID
    // const messageID = uuidv4();

    // // Store message in user's chat history
    // const newChat = { title: message.slice(0, 20), messageID };
    // user.history.push(newChat);
    // await user.save();

    // res.json({ messageID, reply: botReply });
  } catch (error) {
    console.error("❌ OpenAI Error:", error);
    res.status(500).json({ message: "Failed to connect to OpenAI" });
  }
};

// ✅ Fetch User Chat History
// export const getChatHistory = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     if (!req.user) {
//         res.status(401).json({ message: "Unauthorized" });
//         return;
//     } 

//     const user = await User.findById(req.user).select("history");
//     if (!user) {
//         res.status(404).json({ message: "User not found" });
//         return;
//     } 

//     res.json({ history: user.history });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };
