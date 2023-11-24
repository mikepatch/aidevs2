import {TasksProvider} from "../../services";
import {TASK_NAMES} from "../../constants";

(async () => {
    const API_URL = "https://miketest.bieda.it/search";
    const taskInit = await TasksProvider.getTask(TASK_NAMES.google);
    if(!taskInit) throw new Error('Problem with task init');

    const answerResponse = await TasksProvider.sendAnswer(API_URL);

    console.log(answerResponse);
})()