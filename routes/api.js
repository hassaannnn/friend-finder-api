var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.status(418);
});

router.get("/test", function (req, res, next) {
  res.status(200).send("test");
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const tokenOnly = authHeader && authHeader.split(" ")[1];
  try {
    //const tokenOnly = req.cookies.token;
    if (tokenOnly == null) {
      //console.log("token is null");
      res.status(200).json({ loggedIn: false });
      return;
    }
    //console.log(tokenOnly + " is token only");
    if (tokenOnly == null) return res.sendStatus(401);

    jwt.verify(tokenOnly, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(401).json({ loggedIn: false });

      req.user = user;
      //console.log(req.user, " is req.user");
      next();
    });
  } catch (e) {
    console.log(e);
    res.status(401).send({
      error: e,
      loggedIn: false,
    });
  }
}

module.exports = router;
