import { NextApiRequest } from "next";

export type resData = {
  text: string;
};

export interface GenerateApiRequest extends NextApiRequest {
  body: {
    prompt: string;
  };
}
