const AWS = require('aws-sdk');

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

let docClient = new AWS.DynamoDB.DocumentClient();

function getAllItem(res) {
  let params = {
    TableName: "Books"
  };
  docClient.scan(params, (err, data) => {
    if (err) {
      res.writeHead(500, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({error: 'Lỗi không thể truy xuất dữ liệu'}));
    } else {
      res.writeHead(200, {'Content-Type': 'application/json'});
      if (data.Items.length === 0) {
        res.end(JSON.stringify({message: 'Table rỗng, chưa có item nào được thêm'}));
      }
      res.end(JSON.stringify(data.Items));
    }
  });
}

function searchItem(year, name, res) {
  let params = {
    TableName: 'Books'
  };
  let queryObject = {};
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
          res.writeHead(500, {'Content-Type': 'application/json'});
          res.end(JSON.stringify({error: 'Lỗi không thể tìm item'}));
        } else {
          res.writeHead(200, {'Content-Type': 'application/json'});
          if (data.Items.length === 0) {
            res.end(JSON.stringify({message: 'Không có item nào trùng với điều kiện tìm kiếm'}));
          }
          res.end(JSON.stringify(data.Items));
        }
      });
    }
    else {
      params.FilterExpression = '#y = :year';
      params.ExpressionAttributeNames = {'#y': 'year'};
      params.ExpressionAttributeValues = {':year': Number(year)};
      docClient.scan(params, (err, data) => {
        if (err) {
          res.writeHead(500, {'Content-Type': 'application/json'});
          res.end(JSON.stringify({error: 'Lỗi không thể tìm item'}));
        } else {
          res.writeHead(200, {'Content-Type': 'application/json'});
          if (data.Items.length === 0) {
            res.end(JSON.stringify({message: 'Không có item nào trùng với điều kiện tìm kiếm'}));
          }
          res.end(JSON.stringify(data.Items));
        }
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
          res.writeHead(500, {'Content-Type': 'application/json'});
          res.end(JSON.stringify({error: 'Lỗi không thể tìm item'}));
        } else {
          res.writeHead(200, {'Content-Type': 'application/json'});
          if (data.Items.length === 0) {
            res.end(JSON.stringify({message: 'Không có item nào trùng với điều kiện tìm kiếm'}));
          }
          res.end(JSON.stringify(data.Items));
        }
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
      res.writeHead(500, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({error: 'Lỗi không thêm item, vui lòng cung cấp đủ các tham số'}));
    } else {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({
        message: 'Thêm thành công',
        book: {
          name: params.Item.name,
          year: params.Item.year,
          type: params.Item.type,
          author: params.Item.author
        }
      }));
    }
  });
}

function updateItem(year, name, type, author, res) {
  let params = {
    TableName: 'Books',
    Key: {
      "name": String(name),
      "year": Number(year)
    },
    UpdateExpression: "set #t = :type, #a = :author",
    ExpressionAttributeNames: {
      '#t': 'type',
      '#a': 'author'
    },
    ExpressionAttributeValues: {
      ':type': String(type),
      ':author': String(author)
    },
    ReturnValues: "UPDATED_NEW"
  };
  docClient.update(params, (err, data) => {
    if (err) {
      res.writeHead(500, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({error: 'Lỗi không thể update item, vui lòng cung cấp đủ các tham số'}));
    } else {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({
        message: 'Sửa thành công',
        change : data.Attributes
      }));
    }
  });
}

function deleteItem(year, name, res) {
  let params = {
    TableName: 'Books',
    Key: {
      "name": String(name),
      "year": Number(year)
    }
  };

  docClient.delete(params, (err, data) => {
    if (err) {
      res.writeHead(500, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({error: 'Lỗi không thể delele item, vui lòng cung cấp đủ các tham số'}));
    } else {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({
        message: 'Xóa thành công',
        book : {
          name : name,
          year : year
        }
      }));
    }
  });
}

module.exports = {
  getAllItem: getAllItem,
  searchItem: searchItem,
  createItem: createItem,
  updateItem: updateItem,
  deleteItem: deleteItem
};