import fs from "fs";
import * as url from 'url';
import {ChatOpenAI} from "langchain/chat_models/openai";
import {HumanMessage, SystemMessage} from "langchain/schema";

import {DatabaseType} from "./types.ts";
import {getSystemPrompt} from "./prompts.ts";

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
export const DB_PATH = `${__dirname}/db_draft.json`;
const chat = new ChatOpenAI({modelName: 'gpt-4-1106-preview'});

export const getDatabase = async (url="https://zadania.aidevs.pl/data/3friends.json") => {
    const res = await fetch(url);
    if(!res.ok) throw new Error('Problem while downloading db');

    return await res.json();
}

export const saveAsJSON =  (database: DatabaseType) => {
    const jsonContent = JSON.stringify(database);

    fs.writeFile(DB_PATH, jsonContent, 'utf8', (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}

export const optimizeData = async (data: string)=> {
    const system = getSystemPrompt();

    const response = await chat.call([
        new SystemMessage(system),
        new HumanMessage(data),
    ])
    const content: string = response.content as string;
    content.replace(/ /g, '');

    return content;
}