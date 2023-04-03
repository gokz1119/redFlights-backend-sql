const express = require("express");
const seatRouter = express.Router();
const connection = require("../../config/db");

// GET request to display the seats of a given flight with a given class

seatRouter.get("/api/schedule/:flight_schedule_id", (req, res) => {
  const flightScheduleId = req.params["flight_schedule_id"];
  const classType = req.query.class_type;

  const seatQuery = `SELECT * FROM v_flight_seat WHERE flight_schedule_id=${flightScheduleId} AND class_type='${classType}' AND available=1`;

  connection.query(seatQuery, (err, result) => {
    if (err) {
      console.log("Uh-oh! Unable to get seat details :(");
      res.send({ msg: "Uh-oh! Unable to get seat details :(" });
      throw err;
    }
    console.log(
      `GET /api/schedule/${flightScheduleId}?class_type=${classType} 200`
    );
    res.json(result);
  });
});

module.exports = seatRouter;
