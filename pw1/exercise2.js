const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
app.use(express.json());

const filePath = path.join(__dirname, "users.txt");

function verifyUserData(user, password, res) {
  if (!user || !password) {
    return res.status(400).send("Please provide user and password.");
  }
}

function readFiles(file){
  return fs.readFileSync(file, "utf8")
}

function filterByData(users, method, key, comparedValue) {
  return users[method]((user) => user[key] === comparedValue);
}

function writeFile(users) {
  const formattedData = users
    .map((user) => `${user.id}|${user.user}|${user.password}`)
    .join("\n");
  fs.writeFileSync(filePath, formattedData, "utf8");
}

function existsFile(file, res) {
  if (!fs.existsSync(file)) {
    return res.status(404).send("File not found.");
  }
}

function getNextId(users) {
  return users.length > 0 ? users[users.length - 1].id + 1 : 1;
}

function parseUsers(data) {
  return data
    .split("\n")
    .filter((line) => line)
    .map((line) => {
      const [id, user, password] = line.split("|");
      return { id: parseInt(id), user, password };
    });
}

app.get("/user", (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).send("Please provide an ID in the query string.");
  }

  if (existsFile(filePath)) {
    return res.status(404).send("File not found.");
  }

  const data = readFiles(filePath);
  const users = parseUsers(data);
  const user = filterByData(users, "find", "id", parseInt(id));
  if (!user) {
    return res.status(404).send("User not found.");
  }

  return res.status(200).json(user);
});

app.post("/user", (req, res) => {
  const { user, password } = req.body;

  verifyUserData(user, password, res);

  let users = [];
  if (!existsFile(filePath)) {
    const data = readFiles(filePath);
    users = parseUsers(data);
  }
  const existingUser = filterByData(users, "find", "user", user);
  if (existingUser) {
    return res
      .status(400)
      .send("User with this name already exists. Cannot add.");
  }

  const newUser = {
    id: getNextId(users),
    user,
    password,
  };

  users.push(newUser);
  writeFile(users);
  return res.status(201).send("User added successfully.");
});

app.put("/user", (req, res) => {
  const { id, user, password } = req.body;

  verifyUserData(user, password, res);
  existsFile(filePath, res);

  const data = readFiles(filePath);
  let users = parseUsers(data);
  const userIndex = filterByData(users, "findIndex", "id", parseInt(id));

  if (userIndex === -1) {
    return res.status(404).send("User not found.");
  }

  users[userIndex] = { id: parseInt(id), user, password };
  writeFile(users);
  return res.status(200).send("User updated successfully.");
});

app.delete("/user", (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).send("Please provide an ID.");
  }

  existsFile(filePath, res);

  const data = readFiles(filePath);
  let users = parseUsers(data);
  const userIndex = filterByData(users, "findIndex", "id", parseInt(id));

  if (userIndex === -1) {
    return res.status(404).send("User not found.");
  }

  users.splice(userIndex, 1);

  users = users.map((user, index) => ({
    id: index + 1,
    user: user.user,
    password: user.password,
  }));

  writeFile(users);
  return res.status(200).send("User deleted successfully.");
});

app.use((req, res) => {
  res.status(404).send("Oops! The page you are looking for does not exist.");
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
