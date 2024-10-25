const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../users.txt");

const readFile = () =>
  fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";

function readFileMiddleware(req, res, next) {
  const data = readFile();
  if (!data) {
    return res.status(404).send("File not found.");
  }
  req.users = data; 
  next();
}

module.exports = readFileMiddleware
