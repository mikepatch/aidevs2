import {TasksProvider} from "../../services";
import {TASK_NAMES} from "../../constants";

const API_URL = 'https://miketest.bieda.it/chat';

(async () => {
    const taskInit = await TasksProvider.getTask(TASK_NAMES.ownapipro);
    if(!taskInit) throw new Error('Task init problem');

    const answerResponse = await  TasksProvider.sendAnswer(API_URL);
    console.log(answerResponse);
})()