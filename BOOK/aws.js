const AWS = require('aws-sdk');
const FORM = require('./writeform');

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

let docClient = new AWS.DynamoDB.DocumentClient();

function getAllItem(res) {
  let params = {
    TableName: "Books"
  };
  let scanObject = {};
  docClient.scan(params, (err, data) => {
    if (err) {
      scanObject.err = err;
    } else {
      scanObject.data = data;
    }
    FORM.writeItemTable(scanObject, res);
  });
}

function searchItem(year, name, res) {
  let params = {
    TableName: 'Books'
  };
  let queryObject = {};
  console.log(year);
  console.log(name);
  if (year) {
    if (name) {
      params.KeyConditionExpression = '#y = :year and #n =:name';
      params.ExpressionAttributeNames = {
        '#y': 'year',
        '#n': 'name'
      };
      params.ExpressionAttributeValues = {
        ':year': Number(year),
        ':name': String(name)
      };
      docClient.query(params, (err, data) => {
        if (err) {
          queryObject.err = err;
        } else {
          queryObject.data = data;
        }
        FORM.writeItemTable(queryObject, res);
      });
    }
    else {
      params.FilterExpression = '#y = :year';
      params.ExpressionAttributeNames = {'#y': 'year'};
      params.ExpressionAttributeValues = {':year': Number(year)};
      docClient.scan(params, (err, data) => {
        if (err) {
          queryObject.err = err;
        } else {
          queryObject.data = data;
        }
        FORM.writeItemTable(queryObject, res);
      });
    }
  }
  else if (!year) {
    if (name) {
      params.FilterExpression = '#n = :name';
      params.ExpressionAttributeNames = {'#n': 'name'};
      params.ExpressionAttributeValues = {':name': String(name)};
      docClient.scan(params, (err, data) => {
        if (err) {
          queryObject.err = err;
        } else {
          queryObject.data = data;
        }
        FORM.writeItemTable(queryObject, res);
      });
    }
  }
}

function createItem(year, name, type, author, res) {
  let params = {
    TableName: 'Books',
    Item: {
      name: String(name),
      year: Number(year),
      type: String(type),
      author: String(author)
    }
  };
  docClient.put(params, (err, data) => {
    if (err) {
      FORM.writeCreateForm(res);
      res.write('<h5 style="color:red;">Vui lòng nhập đủ các thuộc tính</h5>');
    } else {
      res.writeHead(302, {'Location': '/'});
    }
    res.end();
  });
}

function updateItem(year, name, type, author, res) {
  let params = {
    TableName: 'Books',
    Key:{
      "name": String(name),
      "year": Number(year)
    },
    UpdateExpression: "set #t = :type, #a = :author",
    ExpressionAttributeNames: {
      '#t':'type',
      '#a':'author'
    },
    ExpressionAttributeValues:{
      ':type': String(type),
      ':author':String(author)
    },
    ReturnValues:"UPDATED_NEW"
  };
  docClient.update(params, (err, data) => {
    if (err) {
      FORM.writeEditForm(year, name, type, author, res);
      res.write('<h5 style="color:red;">Vui lòng nhập đủ các thuộc tính</h5>');
    } else {
      res.writeHead(302, {'Location': '/'});
    }
    res.end();
  })
}

function deleteItem(year,name,res) {
  let params = {
    TableName: 'Books',
    Key:{
      "name": String(name),
      "year": Number(year)
    }
  };

  docClient.delete(params, (err, data) => {
    if (err) {
      console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      res.writeHead(302, {'Location': '/'});
    }
    res.end();
  });
}

module.exports = {
  getAllItem : getAllItem,
  searchItem : searchItem,
  createItem : createItem,
  updateItem : updateItem,
  deleteItem : deleteItem
};