// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

type resData = {
  text: string;
};

interface GenerateApiRequest extends NextApiRequest {
  body: {
    prompt: string;
  };
}

const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(openaiConfig);

export default async function handler(
  req: GenerateApiRequest,
  res: NextApiResponse<resData>
) {
  const prompt = req.body.prompt;
   
  if (!prompt || prompt === "") {
    return new Response("No prompt entered.", { status: 400 });
  }

  // https://platform.openai.com/docs/api-reference/chat/create
  const completionOutput = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{"role": "user", "content": `${prompt}`}],
    temperature: 0.5,
    frequency_penalty: 0.5
  });

  const completionResponse =
    completionOutput.data.choices[0].message?.content.trim() ||
    "Error occurred. Please try again.";
  res.status(200).json({ text: completionResponse });
}
