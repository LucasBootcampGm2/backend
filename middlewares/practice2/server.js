const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());

const { logger, authenticate, validateUser } = require("./middlewares");
app.use(logger);

const path = require("path");
const usersFilePath = path.join(__dirname, "users.json");

const readUsersFromFile = () => {
  const data = fs.readFileSync(usersFilePath, "utf8");
  return JSON.parse(data);
};

const writeUsersToFile = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};


app.post("/register", validateUser, (req, res) => {
  const users = readUsersFromFile();
  const existingUser = users.find(
    (user) => user.username === req.body.username
  );

  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push(req.body);
  writeUsersToFile(users);

  res
    .status(201)
    .json({ message: "User successfully registered", user: req.body });
});

app.get("/users", (req, res) => {
  const users = readUsersFromFile();
  res.status(200).json(users);
});

app.get("/protected", authenticate, (req, res) => {
  res.json({ message: "Access allowed to protected route" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Server Error");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
