const express = require("express");
const connection = require("../../config/db");

const airportRouter = express.Router();

// GET request for fetching name and details of all airports

airportRouter.get("/api/airports", (req, res) => {
  const airportQuery = "SELECT * FROM airport";
  connection.query(airportQuery, (err, result) => {
    if (err) {
      res.send({ msg: "Uh-oh! Unable to get airport details :(" });
      throw err;
    }
    console.log("GET /api/airports 200");
    res.json(result);
  });
});

module.exports = airportRouter;
