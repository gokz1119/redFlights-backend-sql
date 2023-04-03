const express = require("express");
const connection = require("../../config/db");
const authMiddleware = require("../../middleware/auth");

const bookingRoutes = express.Router();

// POST request for booking a ticket
bookingRoutes.post("/api/booking", authMiddleware, (req, res) => {
  const userId = req.body.user_id;
  const noOfPassengers = req.body.no_of_passengers;
  const totalAmount = req.body.total_amount;
  const passengerDetails = req.body.passenger_details;

  if (noOfPassengers !== passengerDetails.length) {
    console.log("Disparity in number of passengers and their details");
    res.status(400).send({ msg: "Uh-oh! We ran into an error ;-;" });
    return;
  } else {
    connection.beginTransaction((err) => {
      if (err) {
        res.send({ msg: "Transaction error!" });
        throw err;
      } else {
        const bookingQuery = `INSERT INTO booking(user_id, total_amount, no_of_passengers) VALUES(${userId}, ${totalAmount}, ${noOfPassengers})`;

        console.log(bookingQuery);

        connection.query(bookingQuery, (err, result) => {
          if (err) {
            return connection.rollback(function () {
              throw err;
            });
          }
          console.log("Inserted into booking");
          console.log(result);

          const bookingId = result.insertId;

          let ticketQuery = `INSERT INTO ticket(booking_id, flight_seat_detail_id, passenger_name, passenger_age, passenger_gender) VALUES`;
          passengerDetails.forEach((passenger) => {
            let flightSeatDetailId = passenger.flight_seat_detail_id;
            let passengerName = passenger.passenger_name;
            let passengerAge = passenger.passenger_age;
            let passengerGender = passenger.passenger_gender;

            ticketQuery =
              ticketQuery +
              `(${bookingId}, ${flightSeatDetailId}, '${passengerName}', '${passengerAge}', '${passengerGender}'),`;
          });

          ticketQuery = ticketQuery.slice(0, -1);
          console.log(ticketQuery);

          connection.query(ticketQuery, (err, result) => {
            if (err) {
              return connection.rollback(function () {
                throw err;
              });
            }
            console.log("Inserted into ticket");
            console.log(result);

            let flightSeatQuery = `UPDATE flight_seat_detail SET available=0 WHERE flight_seat_detail_id IN (`;
            passengerDetails.forEach((passenger) => {
              let flightSeatDetailId = passenger.flight_seat_detail_id;

              flightSeatQuery = flightSeatQuery + `${flightSeatDetailId},`;
            });

            flightSeatQuery = flightSeatQuery.slice(0, -1) + `)`;

            connection.query(flightSeatQuery, (err, result) => {
              if (err) {
                return connection.rollback(function () {
                  throw err;
                });
              }
              console.log("Updated flight_seat_detail");
              console.log(result);

              let flightScheduleQuery = `UPDATE flight_schedule SET available_seats=available_seats-${noOfPassengers} WHERE flight_schedule_id=${req.body.flight_schedule_id}`;
              connection.query(flightScheduleQuery, (err, result) => {
                if (err) {
                  return connection.rollback(function () {
                    throw err;
                  });
                }
                console.log("Updated flight_schedule");
                console.log(result);

                connection.commit((err) => {
                  if (err) {
                    return connection.rollback(function () {
                      throw err;
                    });
                  }
                  res.send({
                    msg: "Yayy! Transaction successful. Booking created",
                  });
                });
              });
            });
          });
        });
      }
    });
  }
});

module.exports = bookingRoutes;
