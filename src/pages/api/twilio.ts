import { NextApiRequest, NextApiResponse } from "next";
import { Twilio } from "twilio";
import MessagingResponse from "twilio/lib/twiml/MessagingResponse";
import { Configuration, OpenAIApi } from "openai";
import nextSession from "next-session";

const getSession = nextSession();

const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(openaiConfig);

export default async function sendMessage(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession(req, res);
  if (!session.chatHistory || session.chatHistory === null) {
    session.chatHistory = [
      { role: "system", content: "You are a helpful assistant." },
    ];
  }

  let prompt: string = req.body.Body;

  session.chatHistory.push({ role: "user", content: `${prompt}` });

  // https://platform.openai.com/docs/api-reference/chat/create
  const completionOutput = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: session.chatHistory,
    temperature: 0.5,
    frequency_penalty: 0.5,
  });

  const completionResponse =
    completionOutput.data.choices[0].message?.content.trim() ||
    "Error occurred. Please try again.";

  session.chatHistory.push({
    role: "assistant",
    content: `${completionResponse}`,
  });

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

  if (req.method === "GET") {
    if (accountSid && authToken && twilioNumber) {
      const { userNumber, userMessage } = req.body;
      const client = new Twilio(accountSid, authToken);
      client.messages
        .create({
          from: twilioNumber,
          to: userNumber,
          body: userMessage,
        })
        .then((message) => res.json({ text: message.sid }));
    } else {
      console.error(
        "You are missing one of the variables you need to send a message"
      );
      return res.json({
        success: false,
      });
    }
  } else if (req.method === "POST") {
    const smsResponse = new MessagingResponse();
    smsResponse.message(completionResponse);

    res.writeHead(200, { "Content-Type": "text/xml" });
    return res.end(smsResponse.toString());
  }
}
