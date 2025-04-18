const express = require("express");

const router = express.Router();

router.get("/get-all-docs", (req, res) => {
  res.send("respond with a resource");
});

router.get("/get-docs/:id", (req, res) => {
  const { id } = req.params;
  res.send(`respond with a resource ${id}`);
});

router.get("/create-doc", (req, res) => {
  res.send(`respond with a resource ${doc}`);
});
