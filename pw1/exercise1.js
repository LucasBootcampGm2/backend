const http = require("http");

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/plain");

  if (req.method === "GET" && req.url === "/") {
    res.statusCode = 200;
    res.end("Welcome to my HTTP server!");
    
  } else if (req.method === "GET" && req.url === "/about") {
    res.statusCode = 200;
    res.end("I am a developer passionate about learning new technologies.");
    
  } else if (req.method === "GET" && req.url === "/error") {
    res.statusCode = 404;
    res.end("404 Error: Eat my shorts! This page doesn't exist.");
    
  } else {
    res.statusCode = 404;
    res.end("404 Error: Eat my shorts! This page doesn't exist.");
  }
});

const port = 3000;

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
