const { fs, path } = require("../constants.js");
const handleError = require("./handleError.js");
const deleteFile = require("./unlinkFile.js");

function readFileAndDelete(file) {
  const fullPath = path.join(__dirname, file);
  fs.readFile(fullPath, "utf-8", (err, data) => {
    if (err) {
      handleError(err);
      return;
    }
    console.log(data);
    deleteFile(file); 
  });
}

module.exports = readFileAndDelete;
