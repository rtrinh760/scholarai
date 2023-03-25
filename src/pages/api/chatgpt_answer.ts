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
  apiKey: process.env.OPEN_API_KEY,
});

const openai = new OpenAIApi(openaiConfig)

export default async function handler(
  req: GenerateApiRequest,
  res: NextApiResponse<resData>
) {
  const prompt = req.body.prompt;

  if (!prompt || prompt === '') {
    return new Response('No prompt entered.', { status: 400 })
  }
}
