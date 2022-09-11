var express = require("express");
var router = express.Router();
const User = require("../models/users");
const Matches = require("../models/matches");
const Preferences = require("../models/preferences");
const jwt = require("jsonwebtoken");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.status(418);
});

router.get("/test", authenticateToken, function (req, res, next) {
  findMatches(req);
  res.status(200).send("test");
});

router.post("/createUserPreferences", authenticateToken, function (req, res) {
  console.log("runnign");
  if (createUserPreferences(req)) {
    res.status(200).send("success");
  } else {
    res.status(500).send("failure");
  }
});

router.post("/createMatch", authenticateToken, async function (req, res) {
  results = await createMatch(req);
  console.log(results + " is results");
  if (results != false) {
    res.status(200).json({ message: "Success!", valid: true, data: results });
  } else {
    res.status(200).json({ message: "No Matches Found", valid: false });
  }
});
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const tokenOnly = authHeader && authHeader.split(" ")[1];
  //console.log(req.headers)
  try {
    //const tokenOnly = req.cookies.token;
    if (tokenOnly == null) {
      //console.log("token is null");
      res.status(200).json({ loggedIn: false });
      return;
    }
    //console.log(tokenOnly + " is token only");
    if (tokenOnly == null) return res.sendStatus(200).json({ loggedIn: false });

    jwt.verify(tokenOnly, process.env.JWT_SECRET, async (err, user) => {
      if (err) return res.status(200).json({ loggedIn: false });
      let foundUser = await User.findOne({ email: user.email });
      req.user = foundUser;
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

function createUserPreferences(req) {
  let p = new Preferences({
    user: req.user,
    faculty: req.body.faculty,
    age: req.body.age,
    year: req.body.year,
    fitness: req.body.fitness,
    sociability: req.body.sociability,
    lastMeal: req.body.lastMeal,
    animal: req.body.animal,
    languages: req.body.languages,
  });
  try {
    let foundUser = req.user;
    if (foundUser.prefsCompleted == true) {
      return true;
    }
    p.save();
    foundUser.preferences = p;
    foundUser.prefsCompleted = true;
    foundUser.save();
  } catch {
    return false;
  }
  return true;
}

async function createMatch(req) {
  let foundMatch = await findMatches(req);
  //console.log(foundMatch + ": is foundMatch");
  if (foundMatch == null) {
    return false;
  }

  let m = new Matches({
    user1: req.user,
    user2: foundMatch,
  });
  try {
    m.save();
    //req.user.currentlyMatched = true;
    req.user.save(); //unmdo these
    //foundMatch.currentlyMatched = true;
    foundMatch.save();
    const data = {
      matchName: foundMatch.name,
      matchPic: foundMatch.picURL,
      meetingLocation: m.meetingPlace,
    };

    return data;
  } catch {
    return false;
  }
}
async function findMatches(req) {
  let foundUser = req.user;
  let foundPreferences = foundUser.preferences;

  let possibleMatches = await User.find({
    currentlyMatched: false,
    prefsCompleted: true,
    _id: { $ne: foundUser._id },
  });
  //console.log(possibleMatches);
  if (possibleMatches.length == 0) {
    return null;
  }
  //Implement logic to find matches, randomize for now
  getRandomInt(possibleMatches.length);
  let match = possibleMatches[getRandomInt(possibleMatches.length)];
  console.log("lenght is " + possibleMatches.length);
  return match;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

module.exports = router;
