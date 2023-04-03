const express = require("express");
const connection = require("../../config/db");

const countryCodesRouter = express.Router();

countryCodesRouter.get("/api/countryCodes", (req, res) => {
  const countryCodeQuery = "SELECT * FROM country_code";
  connection.query(countryCodeQuery, (err, result) => {
    if (err) {
      res.send({ msg: "Unable to get country codes" }).status(404);
      throw err;
    }

    console.log("GET /api/countryCodes 200");
    res.json(result);
  });
});

module.exports = countryCodesRouter;
