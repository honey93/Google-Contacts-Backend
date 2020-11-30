var express = require("express");
var router = express.Router();
const path = require('path');
const { google } = require("googleapis");
const people = google.people("v1");

const oauth2Client = new google.auth.OAuth2(

  process.env.REACT_APP_OAUTH_URL,
  process.env.REACT_APP_API_KEY,
  process.env.REACT_APP_REDIRECT_URL
);

google.options({
  auth: oauth2Client
});

// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/contacts"
];

const url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: "offline",

  // If you only need one scope you can pass it as a string
  scope: scopes
});

/* GET home page. */

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// router.get('/contacts', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });


router.get("/google", function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ url:url}));

});

router.get("/token", async function(req, res, next) {
  let auth = req.query.code;
  const { tokens } = await oauth2Client.getToken(auth);
  oauth2Client.setCredentials(tokens);

  const {
    data: { connections }
  } = await people.people.connections.list({
    personFields: ["names", "emailAddresses", "phoneNumbers", "photos"],
    resourceName: "people/me",
    pageSize: 30
  });
  //console.log("\n\nUser's Connections:\n");
  //connections.forEach(c => console.log(c));

  const result = await people.people.get({
    resourceName: "people/me",
    personFields: "emailAddresses,names,photos"
  });
 // console.log(result.data);

  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ contacts: connections, myDetails: result.data }));

  // res.render("index", { title: result.data });
});

module.exports = router;
