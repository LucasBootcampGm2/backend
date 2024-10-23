const appendToFile = require("./appendFile.js");
const handleError = require("./handleError.js");
const readFileAndDelete = require("./unlinkFile.js");

function completedExercise(file) {
  try {
    console.log("File system exercises");
    appendToFile(file, "Welcome to GM2 Lucas");
    console.log(`Adding a message into file ${file}...`);
    setTimeout(() => {
      appendToFile(
        file,
        "We are grateful that you have chosen to be with us",
        (text) => {
          console.log(`Message "${text}" appended to file ${file}`);

          console.log("Reading file...");
          setTimeout(() => {
            readFileAndDelete(file);
          }, 3000);
        }
      );
    }, 4000);
  } catch (error) {
    handleError(error);
  }
}

completedExercise("data.txt");
