const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes/route");
const connection = require("./config/db");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(router);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
