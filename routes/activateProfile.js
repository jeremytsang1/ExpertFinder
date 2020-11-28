var express = require('express');
const dbInterface = require('../database/db_interface');
var router = express.Router();

router.get('/', function(req, res) {
  const context = {message: null};
  const Id = parseInt(req.query.Id);
  console.log(`Id: ${Id}`);

  const NO_EXPERT_FOUND = "Activation failed. No Expert found!";
  const EXPERT_ALREADY_ACTIVE = "Activation failed. The Expert is already active!";

  if (Number.isNaN(Id) || dbInterface.getExpertById(Id) == null) {
    context.message = NO_EXPERT_FOUND;
  } else if (dbInterface.getExpertById(Id).Active) {
    context.message = EXPERT_ALREADY_ACTIVE;
  } else {
    dbInterface.activateExpert(Id);
    context.message = `${dbInterface.getExpertById(Id).ContactInfo.Email} is now active!`
  }

  res.render('activateProfile', context);
})

module.exports = router;
