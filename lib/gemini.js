import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY)

export async function sendMessage(messages, systemPrompt) {
  // TODO 1: initialise the model using genAI.getGenerativeModel()
  //         use model 'gemini-2.5-flash', pass systemPrompt as systemInstruction

  // TODO 2: start a chat session using model.startChat()
  //         pass conversation history (all messages except the last)
  //         each message needs role and parts: [{ text: content }]

  // TODO 3: send the last message using chat.sendMessage()

  // TODO 4: return the response text using result.response.text()
}
