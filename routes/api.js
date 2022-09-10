var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.status(418);
});

router.get("/test", function (req, res, next) {
  res.status(200).send("test");
});

module.exports = router;
