const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../users.txt");

const parseUsers = (data) =>
  data
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [id, user, password] = line.split("|");
      return { id: parseInt(id), user, password };
    });

const filterByData = (users, method, key, comparedValue) =>
  users[method]((user) => user[key] === comparedValue);

const getNextId = (users) => {
  const usersLength = users.length;
  return usersLength ? users[usersLength - 1].id + 1 : 1;
};
const verifyUserData = (user, password, res) => {
  if (!user || !password) {
    res.status(400).send("Please provide user and password.");
    return false;
  }
  return true;
};

const readFile = () =>
  fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";

const writeFile = (users) => {
  const formattedData = users
    .map(({ id, user, password }) => `${id}|${user}|${password}`)
    .join("\n");
  fs.writeFileSync(filePath, formattedData, "utf8");
};

module.exports = {
  parseUsers,
  filterByData,
  getNextId,
  verifyUserData,
  readFile,
  writeFile,
};
