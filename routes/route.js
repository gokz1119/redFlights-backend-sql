const express = require("express");
const userRoutes = require("./api/users");
const flightRoutes = require("./api/flights");
const bookingRoutes = require("./api/bookings");
const seatRouter = require("./api/seats");
const airportRouter = require("./api/airports");
const countryCodesRouter = require("./api/countrycodes");

const router = express.Router();

router.use(userRoutes);
router.use(flightRoutes);
router.use(bookingRoutes);
router.use(seatRouter);
router.use(airportRouter);
router.use(countryCodesRouter);

router.get("/", (req, res) => {
  console.log("GET / 200");
  res.send({ msg: "Welcome back home" });
});

module.exports = router;
