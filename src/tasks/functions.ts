import { TASK_NAMES } from "../constants";
import { TasksProvider } from "../services";

(async () => {
  const addUserSchema = {
    name: "addUser",
    description: "add a new user",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "name of the new user",
        },
        surname: {
          type: "string",
          description: "surname of the new user",
        },
        year: {
          type: "integer",
          description: "date of birth of the new user",
        },
      },
    },
  };

  const response = await TasksProvider.getTask(TASK_NAMES.functions);

  console.log(response);

  const answerResponse = await TasksProvider.sendAnswer(addUserSchema);

  console.log(answerResponse);
})();
