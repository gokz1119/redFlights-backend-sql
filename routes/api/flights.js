const express = require("express");
const connection = require("../../config/db");
const flightRoutes = express.Router();

// GET request for listing the data of all the flights on a particular route on a particular date
flightRoutes.get("/api/schedule", (req, res) => {
  const scheduleQuery = `SELECT * FROM v_flight_schedule WHERE source_airport_id=${req.query.source} AND destination_airport_id=${req.query.destination} AND DATE(departure_datetime)=${req.query.date}`;

  connection.query(scheduleQuery, (err, result) => {
    if (err) {
      console.log("Uh-oh! Unable to get the flights for you :(");
      res.send({ msg: "Uh-oh! Unable to get the flights for you :(" });
      throw err;
    }
    console.log("GET /api/schedule 200");
    res.json(result);
  });
});

module.exports = flightRoutes;
