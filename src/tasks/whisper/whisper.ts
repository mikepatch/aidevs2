import { TASK_NAMES } from "../../constants";
import { TasksProvider } from "../../services";
import { downloadAudio, getLink, getTranscription } from "./helpers";

(async () => {
  const pathToFile = import.meta.dir + "/whisper.mp3";

  const { msg } = await TasksProvider.getTask(TASK_NAMES.whisper);
  const linkToFile = await getLink(msg);
  await downloadAudio(pathToFile, linkToFile);

  const transcription = await getTranscription(pathToFile);
  const answerResponse = await TasksProvider.sendAnswer(transcription);

  console.log(answerResponse);
})();
