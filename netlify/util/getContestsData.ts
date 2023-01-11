const fetch = require("node-fetch");

export const getApiContestData = async () => {  // only allow GET
  try {
    const res = await fetch(`${process.env.C4_API_URL}/api/v0/getContest`, {
      method: "GET",
    });
    console.log("inside,", process.env.C4_API_URL);
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};
