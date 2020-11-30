var express = require('express');
var router = express.Router();
const {google} = require('googleapis');
const people = google.people('v1');

/* GET users listing. */
router.get('/', async function (req, res, next) {
  console.log(req.query.code);

  console.log("Reached to users params");
  let auth = req.query.code
  google.options({auth});
 
  const result = await people.people.get({
    resourceName: 'people/me',
    personFields: 'emailAddresses,names,photos',
  });
  console.log("people data came",result.data);
  res.send(result.data);
});

module.exports = router;
