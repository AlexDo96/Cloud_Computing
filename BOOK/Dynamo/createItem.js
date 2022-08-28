const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-west-2',
  endpoint: 'http://localhost:8000',
});

const docClient = new AWS.DynamoDB.DocumentClient();

const table = 'Books';

const year = 2015;
const name = 'A New Book';
const type = 'Thiếu Nhi';
const author = 'Tran Trung Nam';

const params = {
  TableName: table,
  Item: {
    name,
    year,
    type,
    author
  },
};

console.log('Adding a new book...');
docClient.put(params, (err, data) => {
  if (err) {
    console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
  } else {
    console.log('Added An Item', JSON.stringify(params));
  }
});
