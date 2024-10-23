const { fs, path } = require("../constants.js");

const handleError = require("./handleError.js");
const fullTextPath = require("./fullTextPath.js");
const copiedFile = require("./copiedFile.js");
const purposelyErrors = require("./purposelyErrors.js");

const largeFile = "largeFile.txt";

function joinPath(actual, file) {
  return path.join(actual, file);
}

function createFile(path) {
  const writeStream = fs.createWriteStream(path);
  const l = 10000;

  handleError(writeStream);

  for (let i = 0; i < l; i++) {
    writeStream.write("Welcome to GM2 Lucas!\n");
  }

  writeStream.on("finish", () => {
    console.log("File created successfully.");
    readFilePerParts(fullTextPath, largeFile);
    copiedFile(
      joinPath(fullTextPath, largeFile),
      joinPath(fullTextPath, "copiedFile.txt")
    );
    purposelyErrors(fullTextPath);
  });

  writeStream.end();
}

function readFilePerParts(path, file) {
  const readStream = fs.createReadStream(joinPath(path, file), {
    highWaterMark: 1024,
  });

  handleError(readStream);

  readStream.on("data", (chunk) => {
    console.log(`Chunk of ${chunk.length} bytes received`);
    console.log(chunk.toString());
  });
  readStream.on("end", () => {
    console.log("Reading completed.");
  });
}

createFile(joinPath(fullTextPath, largeFile));
