
import fs from "fs";

import {getDatabase, optimizeData, saveAsJSON} from "./helpers.ts";
import {TasksProvider} from "../../services";
import {TASK_NAMES} from "../../constants";
import {DatabaseType} from "./types.ts";

(async () => {
  await TasksProvider.getTask(TASK_NAMES.optimaldb);
  const db = await getDatabase() as DatabaseType;
  if(!db) throw new Error('Problem with loading db');

  for(const user in db) {
   console.log(`Converting: ${user}`);
   const userInfoArr = db[user] as string[];
   const userInfoStr = userInfoArr.join().replace(/ /g, '');
   db[user] = await optimizeData(userInfoStr);

   console.log(`${user} converted`)
   console.log(userInfoStr)

   }

  console.log(db)
  saveAsJSON(db);

  const file = fs.readFileSync('src/tasks/optimaldb/db_draft.json', "utf8",);
  console.log(file);


  const answerResponse = await TasksProvider.sendAnswer(file);
  console.log(answerResponse);
})()

