const express = require("express");
const connection = require("../../config/db");
const authMiddleware = require("../../middleware/auth");
const getHash = require("../../helpers/hash.helper");
const jwt = require("jsonwebtoken");

const userRoutes = express.Router();
const secret = "pneumonoultramicroscopicsilicovolcanoconiosis94";

// GET request for fetching user profile details

userRoutes.get("/api/users/:id", authMiddleware, (req, res) => {
  const profileDetailsQuery = `SELECT user_name, email, phone_no, code_no FROM users JOIN country_code USING(country_code_id) WHERE user_id=${req.params["id"]}`;
  connection.query(profileDetailsQuery, (err, result) => {
    if (err) {
      console.log("Unable to fetch details");
      throw err;
    }
    console.log("GET /api/users/" + req.params["id"] + " 200");
    res.json(result);
  });
});

// POST request for new user signup

userRoutes.post("/api/signup", (req, res) => {
  console.log(req.body);
  const hash = getHash(req.body.password);
  const accountExistsQuery = `SELECT user_name FROM users WHERE email='${req.body.email}'`;
  connection.query(accountExistsQuery, (err, result) => {
    if (err) {
      console.log("Oops! Unable to signup");
      res.send({ msg: "Oops! Unable to signup" });
      throw err;
    }
    if (result.length) {
      console.log("POST /api/signup 200");
      res.send({
        msg: "User already exists!",
        status: false,
        userAlreadyExists: true,
      });
      return;
    } else {
      const signupQuery = `INSERT INTO users(user_name, email, phone_no, country_code_id, password) VALUES ('${req.body.name}', '${req.body.email}', '${req.body.phone_no}', ${req.body.country_code_id}, '${hash}')`;

      connection.query(signupQuery, (err, result) => {
        if (err) {
          console.log("Oops! Unable to signup!");
          res.send({
            msg: "Oops! Unable to signup!",
            status: false,
            userAlreadyExists: false,
          });
          throw err;
        }
        res.send({
          msg: "Yayy! Account created successfully...",
          status: true,
          userAlreadyExists: false,
        });
        console.log("POST /api/signup 200");
      });
    }
  });
});

// POST request for new user login

userRoutes.post("/api/login", (req, res) => {
  console.log(req.body);
  const hash = getHash(req.body.password);

  const loginQuery = `SELECT password, user_id FROM users WHERE email='${req.body.email}'`;
  connection.query(loginQuery, (err, result) => {
    if (err) {
      console.log("Uh-oh! Unable to login at the moment");
      res.send({ msg: "Uh-oh! Unable to login at the moment" });
      throw err;
    }
    if (result.length) {
      if (hash === result[0].password) {
        const token = jwt.sign(
          { id: result[0].user_id, email: req.body.email },
          secret
        );
        console.log("GET /api/login 200");
        res.cookie("auth", token, { maxAge: 900000, httpOnly: true }).json({
          token: token,
          msg: "Yayy! User authenticated successfully",
        });
      } else
        res.send({
          msg: "Uh-oh! Unable to find you, cause you forgot your password :(",
        });
    } else {
      res.send({ msg: "Uh-oh! Unable to find you :(" });
    }
  });
});

module.exports = userRoutes;
