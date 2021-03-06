/*
createTables.js

Creates all tables (based on jsons) in dynamodb instance found in config.js.
*/

const config = require('../../config.js');
const AWS = require('aws-sdk');

// communicate directly with dynamo rather than docker routing
config['dynamodb']['endpoint'] = config['dynamoPublicEndpoint'];

AWS.config.update(config.dynamodb);
const dynamoDb = new AWS.DynamoDB();

/**
 * Create tables in DynamoDB.
 * @param { string } tableJson filepath to table JSON create rules.
 */
function createTable(tableJson) {
  dynamoDb.createTable(tableJson, function(err, data) {
    if (err) {
      console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));
    } else {
      console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2));
    }
  });
}

// create all dynamo tables
createTable(require('./jsons/usersTable.json'));
createTable(require('./jsons/eventsTable.json'));
