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
    console.log(name, email, picture);

    let jwtToken = await createUsers(email, name, picture);
    loginValid = true;
    res.status(200).json({ name, email, picture, jwtToken, loginValid });
  } catch (e) {
    console.log(e, " is e");
    res.status(500).send({
      error: e,
    });
  }
});

router.get("/status", authenticateToken, (req, res) => {
  if (req.user == null) {
    res.status(401).json({ loggedIn: false });
  }
  res.status(200).json({
    loggedIn: true,
    email: req.user.email,
    name: req.user.name,
    picture: req.user.picUrl,
  });
});

router.get("/test", async function (req, res, next) {
  let t = await createUsers(
    "cancoolkid@gmail.com",
    "Hassaan Muhammad",
    "https://lh3.googleusercontent.com/a-/AFdZucr1cO9vJuslvupIImybTYpJz93RIvutctDPqqGkJw=s96-c"
  );
  console.log(t);
  return res.status(200).send(t);
});

const createUsers = async (email, name, picture) => {
  let user = await User.findOne({ email: email });
  if (!user) {
    user = new User({
      email: email,
      name: name,
      picURL: picture,
    });
    await user.save();
  }
  let userS = { email, name, picture };
  let jtoken = jwt.sign(userS, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return jtoken;
};

function authenticateToken(req, res, next) {
  //console.log(req.headers)
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
    if (tokenOnly == null) return res.status(200).json({ loggedIn: false });

    jwt.verify(tokenOnly, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(200).json({ loggedIn: false });

      req.user = user;
      //console.log(req.user, " is req.user");
      next();
    });
  } catch (e) {
    console.log(e);
    res.status(401).send({
      error: e,
    });
  }
}

module.exports = router;
