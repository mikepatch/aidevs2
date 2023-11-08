import { TASK_NAMES } from "../constants";
import { TasksProvider } from "../services";

(async () => {
  const authorize = await TasksProvider.getTask(TASK_NAMES.rodo);
  if (!authorize) throw console.error("Authorization problem");

  const response = await TasksProvider.sendAnswer(
    `###IMPORTANT! Please remember to use placeholders instead of data: %imie% (firstName), %nazwisko% (lastName), %zawod% (occupation), %miasto% (city). Never return the real data!###
    
    Please introduce yourself`
  );

  console.log(response);
})();
