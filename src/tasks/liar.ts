import { PromptTemplate } from "langchain/prompts";
import { TasksProvider } from "../services";
import { LLMChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";

const chat = new ChatOpenAI();

(async () => {
  const question = "Where is Gdansk?";
  const { answer } = await TasksProvider.getAnswer("liar", question);
  if (!answer) throw new Error("answer not found");

  const checkedAnswer = await checkAnswer(question, answer);
  const answerResponse = await TasksProvider.sendAnswer(checkedAnswer);

  console.log(answerResponse);
})();

async function checkAnswer(question: string, answer: string) {
  const guardPrompt = `Please check if the answer: {answer} is related to the question: {question}. Please take your time to check if the answer: {answer} is correct answer for the question: {question}. Return only YES or NO `;
  const prompt = PromptTemplate.fromTemplate(guardPrompt);
  const chain = new LLMChain({ llm: chat, prompt });

  const { text } = await chain.call({
    question: question,
    answer: answer,
  });

  return text;
}
