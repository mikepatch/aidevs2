import {TasksProvider} from "../../services";
import {API_ROOT, TASK_NAMES} from "../../constants";

(async () => {
    const API_URL = API_ROOT + "/convert";

   const taskInfo = await TasksProvider.getTask(TASK_NAMES.md2html);
    console.log(taskInfo);
    const answerResponse = await TasksProvider.sendAnswer(API_URL);

    console.log(answerResponse);
    console.log(answerResponse.prompt);
    console.log(answerResponse.reply);
})()