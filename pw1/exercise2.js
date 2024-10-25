const fs = require("fs");
const path = require("path");
const express = require("express");
const readFileMiddleware = require("./middleWares/readFileMiddleWare.js");
const findUserMiddleware = require("./middleWares/findUserMiddleWare.js");
const {
  verifyUserData,
  readFile,
  writeFile,
  parseUsers,
  getNextId,
  filterByData,
} = require("./helpers/helpers.js");

const app = express();
app.use(express.json());

app.get("/user", readFileMiddleware, findUserMiddleware, (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).send("Please provide an ID in the query string.");
  }

  return res.status(200).json(req.users[req.userIndex]);
});

app.post("/user", (req, res) => {
  const { user, password } = req.body;

  if (!verifyUserData(user, password, res)) return;

  const data = readFile();
  const users = data ? parseUsers(data) : [];

  const existingUser = filterByData(users, "find", "user", user);
  if (existingUser)
    return res.status(400).send("User with this name already exists.");

  users.push({ id: getNextId(users), user, password });
  writeFile(users);

  res.status(201).send("User added successfully.");
});

app.put("/user", readFileMiddleware, findUserMiddleware, (req, res) => {
  const { id, user, password } = req.body;

  if (!verifyUserData(user, password, res)) return;

  req.users[req.userIndex] = { id: parseInt(id), user, password };
  writeFile(req.users);

  res.status(200).send("User updated successfully.");
});

app.delete("/user", readFileMiddleware, findUserMiddleware, (req, res) => {
  const { id } = req.body;

  if (!id) return res.status(400).send("Please provide an ID.");

  req.users.splice(req.userIndex, 1);

  req.users = req.users.map((user, index) => ({
    id: index + 1,
    user: user.user,
    password: user.password,
  }));

  writeFile(req.users);

  res.status(200).send("User deleted successfully.");
});

app.use((req, res) =>
  res.status(404).send("Oops! The page you are looking for does not exist.")
);

const port = 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
