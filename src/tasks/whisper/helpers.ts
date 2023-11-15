import * as fs from "fs";
import OpenAI from "openai";

import { CompletionMessage } from "../../services/types";
import { OpenaiProvider } from "../../services";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getLink = async (text: string) => {
  const systemContext = `You're a URL finder. Your task is to find a link in the provided text and return only that link without any edits. Never do anything more.`;
  const contextGuard = `Find a link in the provided text. Take a deep breath and just focus on searching links in text. Return only that link.`;

  const messages: CompletionMessage[] = [
    { role: "system", content: systemContext },
    { role: "user", content: contextGuard },
    { role: "user", content: text },
  ];
  const { choices } = await OpenaiProvider.getCompletion(messages);

  const link = choices[0].message.content;
  if (!link) throw new Error("There was a problem with getting the link");

  return link;
};

export const downloadAudio = async (targetPath: string, sourceUrl: string) => {
  try {
    if (!targetPath || typeof targetPath !== "string") {
      throw new Error("Invalid targetPath");
    }

    const res = await fetch(sourceUrl);
    if (!res.ok) {
      throw new Error(
        `Request failed with status ${res.status} ${res.statusText}`
      );
    }

    const buffer = await res.arrayBuffer();
    await fs.promises.writeFile(targetPath, buffer);

    return { msg: `File saved in: ${targetPath}` };
  } catch (err) {
    throw console.error("Error: ", err);
  }
};

export const getTranscription = async (pathToFile: string) => {
  const { text } = await openai.audio.transcriptions.create({
    file: fs.createReadStream(pathToFile),
    model: "whisper-1",
  });

  return text;
};
