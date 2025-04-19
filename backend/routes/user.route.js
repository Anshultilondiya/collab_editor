const express = require("express");

const router = express.Router();

router.get("/login", (req, res) => {
  res.send("respond with a resource");
});

router.get("/get-user", (req, res) => {
  const { id } = req.params;
  res.send(`respond with a resource ${id}`);
});
