const AWS = require('aws-sdk');

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

let dynamodb = new AWS.DynamoDB();

let params = {
  TableName: "Books",
  KeySchema: [
    { AttributeName: "name", KeyType: "HASH" },
    { AttributeName: "year", KeyType: "RANGE" }
  ],
  AttributeDefinitions: [
    { AttributeName: "name", AttributeType: "S" },
    { AttributeName: "year", AttributeType: "N" }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10
  }
};

dynamodb.createTable(params, (err, data) => {
  if (err) {
    console.error(`Something went wrong ${JSON.stringify(err, null, 2)}`);
  } else {
    console.log(`Created table ${JSON.stringify(data, null, 2)}`);
  }
});
