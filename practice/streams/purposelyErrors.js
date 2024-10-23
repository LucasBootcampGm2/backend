const { fs, path } = require("../constants.js");

const handleError = require("./handleError.js");

function purposelyErrors(fullTextPath) {
  setTimeout(() => {
    const readStream = fs.createReadStream(
      path.join(fullTextPath, "nonexistentFile.txt")
    );
    handleError(readStream);

    const writeStream = fs.createWriteStream(fullTextPath, {
      flags: "r",
    });
    handleError(writeStream);

    writeStream.write("This will cause an error\n");
  }, 2000);
}

module.exports = purposelyErrors;
