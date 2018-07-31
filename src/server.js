// import { instanceLocator, chatkitKey } from "./config.js";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Chatkit = require("pusher-chatkit-server");
const app = express();

const chatkit = new Chatkit.default({
  instanceLocator: "v1:us1:6b55df7b-3005-459c-b861-6033487ab8d6",
  key:
    "aca5b732-44b9-45bf-a029-f6bcacfbac9c:5u4ZZnU/NpPt1ZCuYWg08JcLyE0YvPwuXvTOHPIiZ5c="
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post("/users", (req, res) => {
  const { username } = req.body;
  chatkit
    .createUser({
      id: username,
      name: username
    })
    .then(() => res.sendStatus(201))
    .catch(error => {
      if (error.error_type === "services/chatkit/user_already_exists") {
        res.sendStatus(200);
      } else {
        res.status(error.status).json(error);
      }
    });
});

app.post("/authenticate", (req, res) => {
  const authData = chatkit.authenticate({ userId: req.query.user_id });
  console.log(userId);
  res.status(authData.status).send(authData.body);
});

const PORT = 3001;
app.listen(PORT, err => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Running on port ${PORT}`);
  }
});
