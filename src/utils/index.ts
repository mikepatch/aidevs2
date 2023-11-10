import * as fs from "fs";

export const downloadAudio = async (targetPath: string, sourceUrl: string) => {
  try {
    if (!targetPath || typeof targetPath !== "string") {
      throw new Error("Invalid targetPath");
    }

    const res = await fetch(sourceUrl);
    if (!res.ok) {
      throw new Error(
        `Request failed with status ${res.status} ${res.statusText}`
      );
    }

    const buffer = await res.arrayBuffer();
    await fs.promises.writeFile(targetPath, buffer);

    return { msg: `File saved in: ${targetPath}` };
  } catch (err) {
    throw console.error("Error: ", err);
  }
};

export const delayRequest = async (ms: number, info?: string) =>
  new Promise((resolve) => setTimeout(() => resolve(console.log(info)), ms));
