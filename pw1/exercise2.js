const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
app.use(express.json());

const filePath = path.join(__dirname, "users.txt");

const verifyUserData = (user, password, res) => {
  if (!user || !password) {
    res.status(400).send("Please provide user and password.");
    return false;
  }
  return true;
};

const readFile = () => fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";

const writeFile = (users) => {
  const formattedData = users
    .map(({ id, user, password }) => `${id}|${user}|${password}`)
    .join("\n");
  fs.writeFileSync(filePath, formattedData, "utf8");
};

const parseUsers = (data) => data
  .split("\n")
  .filter(Boolean) 
  .map(line => {
    const [id, user, password] = line.split("|");
    return { id: parseInt(id), user, password };
  });

const getNextId = (users) => users.length ? users[users.length - 1].id + 1 : 1;

const filterByData = (users, method, key, comparedValue) => users[method]((user) => user[key] === comparedValue);

app.get("/user", (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).send("Please provide an ID in the query string.");
  }

  const data = readFile();
  if (!data) return res.status(404).send("File not found.");

  const users = parseUsers(data);
  const user = filterByData(users, "find", "id", parseInt(id));

  return user ? res.status(200).json(user) : res.status(404).send("User not found.");
});

app.post("/user", (req, res) => {
  const { user, password } = req.body;

  if (!verifyUserData(user, password, res)) return;

  const data = readFile();
  const users = data ? parseUsers(data) : [];

  const existingUser = filterByData(users, "find", "user", user);
  if (existingUser) return res.status(400).send("User with this name already exists.");

  users.push({ id: getNextId(users), user, password });
  writeFile(users);

  res.status(201).send("User added successfully.");
});

app.put("/user", (req, res) => {
  const { id, user, password } = req.body;

  if (!verifyUserData(user, password, res)) return;

  const data = readFile();
  if (!data) return res.status(404).send("File not found.");

  let users = parseUsers(data);
  const userIndex = filterByData(users, "findIndex", "id", parseInt(id));

  if (userIndex === -1) return res.status(404).send("User not found.");

  users[userIndex] = { id: parseInt(id), user, password };
  writeFile(users);

  res.status(200).send("User updated successfully.");
});

app.delete("/user", (req, res) => {
  const { id } = req.body;

  if (!id) return res.status(400).send("Please provide an ID.");

  const data = readFile();
  if (!data) return res.status(404).send("File not found.");

  let users = parseUsers(data);
  const userIndex = filterByData(users, "findIndex", "id", parseInt(id));

  if (userIndex === -1) return res.status(404).send("User not found.");

  users.splice(userIndex, 1);

  users = users.map((user, index) => ({ id: index + 1, user: user.user, password: user.password }));
  writeFile(users);

  res.status(200).send("User deleted successfully.");
});

app.use((req, res) => res.status(404).send("Oops! The page you are looking for does not exist."));

const port = 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
