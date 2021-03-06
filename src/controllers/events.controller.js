/*
controller for events
*/

const dynamoDb = require('../models/dynamoDbWrapper.js');

// validators
const {check, validationResult} = require('express-validator');
// jwt
const auth = require('../utils/auth.js');

const responseMsg = require('../utils/responseMsg');
const errorMsg = require('../utils/errorMsg');

// validate POST body contents
exports.validate = (method) => {
  switch (method) {
    case 'create': {
      return [
        auth.checkAuth,
        check('name').trim().isLength({min: 1}),
        check('attendees').isInt(),
        check('type').trim().isIn(['lecture', 'speech', 'conference']),
        check('address').trim().isLength({min: 5}),
        check('city').trim().isLength({min: 1}),
        check('zipcode').trim().isInt(),
        check('state').trim().isLength({min: 2}),
        check('promotionUrl').trim().isURL(),
      ];
    }
    case 'auth': {
      return auth.checkAuth;
    }
  }
};

// get all events based on current userId
exports.findAll = async (req, res, next) => {
  const result = await dynamoDb.getEvents(req.usersId);
  res.json(result);
};

// create an event
exports.create = async (req, res, next) => {
  // check whether inputs are valid
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(422).json(responseMsg.validationError422(validation.errors));
  }
  const attendees = parseInt(req.body.attendees);
  if (!attendees || attendees < 10 || attendees > 100000) {
    res.status(422).json(responseMsg.error(errorMsg.params.ATTENDEES,
        errorMsg.messages.ATTENDEE_COUNT_INVALID));
  }
  const item = {
    ...req.body,
    attendees,
    eventsId: dynamoDb.generateID(),
    date: req.body.date,
    organizerId: req.usersId,
    status: 'pending', // TODO: constanize
  };
  const result = await dynamoDb.putData('eventsTable', item);
  if (!result.success) return res.json(result);
  res.json({success: true});
};
