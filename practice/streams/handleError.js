const { fs, path } = require("../constants.js");

const fullPath = require("./fullTextPath.js");
const writeStream = fs.createWriteStream(path.join(fullPath, "error.txt"));

function handleError(stream) {
  stream.on("error", (err) => {
    console.log(err);
    writeStream.write(`\n${err}`);
  });
}

module.exports = handleError;
