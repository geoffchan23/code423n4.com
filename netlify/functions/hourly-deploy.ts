const { schedule } = require("@netlify/functions");
import { PostNetlifyUrl } from "../_config";

const handler = schedule("@hourly", async () => {
  await fetch(PostNetlifyUrl!, {
    method: "POST",
  }).then((response) => {
    console.log("Build hook response:", response);
  });

  return {
    statusCode: 200,
  };
});

exports.handler = schedule("@hourly", handler);
