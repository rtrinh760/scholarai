// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import nextSession from "next-session";

type resData = {
  text: string;
};

interface GenerateApiRequest extends NextApiRequest {
  body: {
    prompt: string;
  };
}

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

  let prompt: string = req.body.prompt;

  if (!prompt || prompt === "") {
    prompt = "Say Please enter a prompt so I may be able to assist you.";
  }

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

  console.log(session.chatHistory)

  res.setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify({ text: completionResponse }));
}

/**
 * 
  export async function handler(
  req: GenerateApiRequest,
  res: NextApiResponse<resData>
) {
  // const requestData = await

  const prompt = req.body.prompt;

  const [completionResponse, _] = await queryGPT(prompt, []) // change this to store chat history as well

  res.status(200).json({ text: completionResponse as string });
}

export async function queryGPT(userPrompt: string, chatHistory: ChatCompletionRequestMessage[]) {
  const [chatLog, setChatLog, chatLogRef] = useState(chatHistory);

  if (!chatHistory || chatHistory.length === 0) {
    chatHistory = [{ role: "system", content: "You are a helpful assistant." }];
  }

  if (!userPrompt || userPrompt === "") {
    userPrompt = "Say Please enter a prompt so I may be able to assist you.";
  }

  setChatLog([...chatLogRef.current, { role: "user", content: `${userPrompt}` }]);

  // https://platform.openai.com/docs/api-reference/chat/create
  const completionOutput = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: chatHistory,
    temperature: 0.5,
    frequency_penalty: 0.5,
  });

  const completionResponse =
    completionOutput.data.choices[0].message?.content.trim() ||
    "Error occurred. Please try again.";

  chatHistory = [...chatHistory, { role: "assistant", content: `${completionResponse}` }];

  return [completionResponse, chatHistory];
}
 */
