const { fs, path } = require("../constants.js");
const handleError = require("./handleError.js");

function appendToFile(file, text, callback) {
  const fullPath = path.join(__dirname, file);
  fs.appendFile(fullPath, `${text}\n`, (err) => {
    if (err) {
      handleError(err);
      return;
    }
    if (callback) callback(text);
  });
}

module.exports = appendToFile;
