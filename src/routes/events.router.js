/*
/api/events routes; This will handle all event related api calls.
*/

module.exports = (app) => {
  const events = require('../controllers/events.controller.js');

  /**
     * @swagger
     * /api/events:
     *  post:
     *      tags:
     *          - Events
     *      name: Create
     *      summary: Creates a new event
     *      security:
     *          - token: []
     *      produces:
     *          - application/json
     *      consumes:
     *          - application/x-www-form-urlencoded
     *      parameters:
     *          - name: name
     *            type: string
     *            minLength: 1
     *            in: formData
     *          - name: attendees
     *            type: integer
     *            in: formData
     *          - name: type
     *            type: string
     *            in: formData
     *          - name: address
     *            type: string
     *            minLength: 5
     *            in: formData
     *          - name: city
     *            type: string
     *            minLength: 1
     *            in: formData
     *          - name: zipcode
     *            type: integer
     *            in: formData
     *          - name: state
     *            type: string
     *            minLength: 2
     *            in: formData
     *          - name: promotionUrl
     *            type: string
     *            in: formData
     *      responses:
     *          '200':
     *              description: event sucessfully created
     *          '401':
     *              description: unauthorized, token is invalid or not provided
     *          '422':
     *              description: invalid or missing body elements
     *
     */

  app.post('/api/events', events.validate('create'), events.create);

  /**
     * @swagger
     * /api/events:
     *  get:
     *      tags:
     *          - Events
     *      name: Get events
     *      summary: Gets all events from userId
     *      security:
     *          - token: []
     *      produces:
     *          - application/json
     *      consumes:
     *          - application/x-www-form-urlencoded
     *      responses:
     *          '200':
     *              description: get all events available to user token
     *          '401':
     *              description: unauthorized, token is invalid or not provided
     *
     */

  app.get('/api/events', events.validate('auth'), events.findAll);

  /**
     * @swagger
     * /api/events/verifyLocation:
     *  get:
     *      tags:
     *          - Events
     *      name: verify location
     *      summary: Check if the user is in the event location
     *      produces:
     *          - application/json
     *      consumes:
     *          - application/x-www-form-urlencoded
     *      parameters:
     *          - name: eventId
     *          - name: eventsId
     *            type: string
     *            minLength: 1
     *            in: formData
     *          - name: latitude
     *            type: string
     *            minLength: 1
     *            in: formData
     *          - name: longitude
     *            type: string
     *            minLength: 1
     *            in: formData
     *      responses:
     *          '200':
     *              description: The latitude and logitude provided is at the event location
     *          '422':
     *              description: invalid parameters or latitude/logitude is not at the event
     *
     */

  app.post('/api/events/verifyLocation', events.validate('verifyLocation'), events.verifyLocation);

  /**
     * @swagger
     * /api/event:
     *  get:
     *      tags:
     *          - Event
     *      name: get a single event
     *      summary: Get an event by its id
     *      produces:
     *          - application/json
     *      consumes:
     *          - application/x-www-form-urlencoded
     *      parameters:
     *          - name: eventsId
     *            type: string
     *            minLength: 1
     *            in: query
     *      responses:
     *          '200':
     *              description: The eventsId provided is some event's id
     *          '422':
     *              description: invalid eventsId is given
     *
     */

  app.get('/api/event', events.validate('get'), events.get);
};
