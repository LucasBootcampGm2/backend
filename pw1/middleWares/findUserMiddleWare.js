const { parseUsers, filterByData } = require("../helpers/helpers");

function findUserMiddleware(req, res, next) {
  const users = parseUsers(req.users);

  let id;
  if (req.method == "DELETE" || req.method === "PUT") {
    id = req.body.id;
  } else {
    id = req.query.id;
  }

  const userIndex = filterByData(users, "findIndex", "id", parseInt(id));

  if (userIndex === -1) return res.status(404).send("User not found.");
  req.userIndex = userIndex;
  req.users = users;
  next();
}

module.exports = findUserMiddleware;
