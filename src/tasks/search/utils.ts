export const getNewsletterResources = async (sourceUrl: string) => {
  try {
    console.log(`
        -----------------------
        /// IN PROGRESS... ///
        -----------------------
        Downloading Newsletter Links...
        `);

    const res = await fetch(sourceUrl);
    if (res.ok) {
      console.log(`
        Newsletter Links downloaded successfully!
        -----------------------
        /// DONE ///
        -----------------------
        `);
      return res.json();
    }

    throw new Error(
      `There was an error with fetch: ${res.status} ${res.statusText}`
    );
  } catch (err) {
    throw err;
  }
};
