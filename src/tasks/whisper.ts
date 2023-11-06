import OpenAI from "openai";
import { TASK_NAMES } from "../constants";
import { OpenaiProvider, TasksProvider } from "../services";
import { CompletionMessage } from "../services/types";
import { downloadAudio } from "../utils";
import * as fs from "fs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

(async () => {
  const pathToFile = "./src/tasks/whisper.mp3";

  const { msg } = await TasksProvider.getTask(TASK_NAMES.whisper);
  const linkToFile = await getLink(msg);
  await downloadAudio(pathToFile, linkToFile);

  const transcription = await getTranscription(pathToFile);
  const answerResponse = await TasksProvider.sendAnswer(transcription);

  console.log(answerResponse);
})();

async function getLink(text: string) {
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
}

async function getTranscription(pathToFile: string) {
  const { text } = await openai.audio.transcriptions.create({
    file: fs.createReadStream(pathToFile),
    model: "whisper-1",
  });

  return text;
}
