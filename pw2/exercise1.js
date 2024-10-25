const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
app.use(express.json());
const EventEmitter = require("events");
const myEmitter = new EventEmitter();

const createTaskPath = "taskCreated";
const file = "logTasks.txt"
const logPath = path.join(__dirname, file);

const verifyTaskData = (id, name, res) => {
  if (!id || !name) {
    res.status(400).send("Please provide id and name.");
    return false;
  }
  return true;
};

const readLogFile = () =>
  fs.existsSync(logPath) ? fs.readFileSync(logPath, "utf8") : "";

const writeLogFile = (logMessage) => {
  fs.appendFile(logPath, logMessage, (err) => {
    if (err) {
      console.error("Error al escribir en el archivo de log", err);
    } else {
      console.log("Log guardado correctamente.");
    }
  });
};

const parseLogData = (data) => {
  return data
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [id, name] = line.split("|");
      return { id: parseInt(id), name };
    });
};

const idExistsInLog = (id) => {
  const data = readLogFile();
  const tasks = parseLogData(data);
  return tasks.some((task) => task.id === parseInt(id));
};

myEmitter.on(createTaskPath, (task) => {
  setTimeout(() => {
    console.log(
      `Notification: Task created with id: ${task.id} and name: ${task.name}`
    );
  }, 2000);
});

myEmitter.on(createTaskPath, (task) => {
  const logMessage = `${task.id}|${task.name}\n`;
  writeLogFile(logMessage);
});

app.post("/task", (req, res) => {
  const { id, name } = req.body;

  if (!verifyTaskData(id, name, res)) return;

  if (idExistsInLog(id)) {
    return res.status(400).send("Task with this ID already exists.");
  }

  myEmitter.emit(createTaskPath, { id, name });

  res.status(200).send("Task created successfully.");
});

app.use((req, res) =>
  res.status(404).send("Oops! The page you are looking for does not exist.")
);

app.listen(3000, () => {
  console.log("Servidor ejecutándose en el puerto 3000");
});
