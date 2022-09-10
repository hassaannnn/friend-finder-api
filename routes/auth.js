var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Server Auth" });
});

router.post("/login", async (req, res) => {
  const allowedDomains = ["ualberta", "gmail"];

  const { token } = req.body;
  if (token == null) {
    res.status(401).send("No token provided");
    return;
  }
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });
    const { name, email, picture } = ticket.getPayload();
    let emailDomain = email.split("@")[1].split(".")[0];
    if (!allowedDomains.includes(emailDomain)) {
      res.status(401).send("Unauthorized");
    }

    let jwttoken = await createUser(
      req,
      res,
      email,
      name,
      picture,
      function (tok, points) {
        res.cookie("token", tok, { httpOnly: true });
        let jtoken = tok;
        loginValid = true;
        res.status(200).json({ name, email, picture, jtoken, loginValid });
      }
    );
  } catch (e) {
    console.log(e, " is e");
    res.status(500).send({
      error: e,
    });
  }
});

const createUser = async (req, res, email, name, picture, callback) => {
  let user = await User.findOne({ email: email });
  if (!user) {
    user = new User({
      email: email,
      name: name,
      picURL: picture,
    });
    await user.save();
  }
  let jtoken = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  callback(jtoken);
};

module.exports = router;
