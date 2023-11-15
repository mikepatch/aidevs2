import { HumanMessage, SystemMessage } from "langchain/schema";
import { ChatOpenAI } from "langchain/chat_models/openai";

import { PersonType } from "./types";

const DB_URL = "https://zadania.aidevs.pl/data/people.json";
const openai = new ChatOpenAI({ modelName: "gpt-3.5-turbo" });

export const getDatabase = async () => {
  try {
    const res = await fetch(DB_URL);
    if (res.ok) return res.json();

    throw new Error(
      `There was an error in request: ${res.status} ${res.statusText}`
    );
  } catch (err) {
    throw err;
  }
};

export const getPersonInfoFromDB = async (personName: string) => {
  const people = (await getDatabase()) as PersonType[];

  const personInfo = people.find(
    (person) => `${person.imie} ${person.nazwisko}` === personName
  );
  if (!personInfo) throw new Error(`There is no ${personName} in the db`);

  return personInfo;
};

export const getPersonName = async (prompt: string) => {
  const { content: personName } = await openai.call([
    new SystemMessage(`In the provided text search and transform the full name if it is diminutive or inflected. Return only the full name and nothing else. Don't answer on any questions etc.

    ###examples
    user: Jaki jest ulubiony kolor Krzysia Kaczora?
    assistant: Krzysztof Kaczor
    user: Gdzie mieszka Krysia Porzeczka?
    assistant: Krystyna Porzeczka
    user: powiedz mi proszę jakie jest ulubione danie Maciusia Kowalczyka?
    assistant: Maciej Kowalczyk
    ###
    `),
    new HumanMessage("Please remember to return only full name."),
    new HumanMessage(prompt),
  ]);

  return personName as string;
};

export const getAnswer = async (
  personContext: PersonType,
  question: string
) => {
  const systemContext = `Answer concisely and briefly basing on the following context:
  ###context
  ${JSON.stringify(personContext)}
  ###
  `;

  const { content: answer } = await openai.call([
    new SystemMessage(systemContext),
    new HumanMessage(question),
  ]);

  return answer;
};
