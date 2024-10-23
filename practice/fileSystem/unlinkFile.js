const { fs, path } = require("../constants.js");
const handleError = require("./handleError.js");

function deleteFile(file) {
  const fullPath = path.join(__dirname, file);

  fs.unlink(fullPath, (err) => {
    handleError(err);
    console.log(`File ${file} deleted`);
  });
}

module.exports = deleteFile;
