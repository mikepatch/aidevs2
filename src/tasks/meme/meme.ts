import {TasksProvider} from "../../services";
import {TASK_NAMES} from "../../constants";
import {TaskResponse} from "../../services/types.ts";

const TEMPLATE_ID = 'sassy-dragonflies-krump-loosely-1769';
const API_URL = 'https://get.renderform.io/api/v2/render';

(async () => {
    const {image, text} = await TasksProvider.getTask(TASK_NAMES.meme) as TaskResponse & {image: string, text: string};

    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": process.env.RENDER_FORM_API_KEY!,
        },
        body: JSON.stringify({template: TEMPLATE_ID, data: {"title.text": text, "image.src": image}})
    }
    const imageResponse = await fetch(API_URL, options);

    const answer = await imageResponse.json();
    const answerResponse = await TasksProvider.sendAnswer(answer.href);

    console.log({image, text})
    console.log(answer.href)
    console.log(answerResponse)
})()