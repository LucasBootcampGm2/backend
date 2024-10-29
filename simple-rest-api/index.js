const express = require("express");
const app = express();
app.use(express.json());

let users = [
  { id: 1, name: "Juan", email: "juan@example.com" },
  { id: 2, name: "Maria", email: "maria@example.com" },
];

app.get("/users", (req, res) => {
  res.json(users);
});

app.get("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
  res.json(user);
});

app.post("/users", (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email,
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.put("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
  users[userIndex] = { id: userId, name: req.body.name, email: req.body.email };
  res.json(users[userIndex]);
});

app.delete("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
  users.splice(userIndex, 1);
  res.status(204).send();
});

const port = 3000;
const host = "localhost";

app.listen(port, () => {
  console.log(`Server running in http://${host}:${port}`);
});
