const handleError = require("./handleError.js");
const {fs} = require("../constants.js");

function copiedFile(fileToCopy, copiedFile) {
  const readStream = fs.createReadStream(fileToCopy);
  const writeStream = fs.createWriteStream(copiedFile);

  handleError(readStream);
  handleError(writeStream);

  readStream.pipe(writeStream);

  writeStream.on("finish", () => {
    console.log(`The file has been copied from ${fileToCopy} to ${copiedFile}`);
  });
}

module.exports = copiedFile;
