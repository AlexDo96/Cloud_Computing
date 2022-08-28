const fs = require('fs');

function writeSearchForm(res) {
  let data = fs.readFileSync('searchForm.html', 'utf-8');
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(data);
}

function writeItemTable(obj, res) {
  res.write('<table border="1px solid black"><tr><th>Year</th><th>Name</th><th>Type</th><th>Author</th><th>Action</th></tr>');
  if (obj.err) {
    res.write(`<h5 style="color:red;">Error:: ${obj.err}</h5>`);
    res.write('<tr><td colspan="5">Nothing to show</td></tr>');
  } else {
    if (obj.data.Items.length === 0) {
      res.write('<tr><td colspan="5">Nothing to show</td></tr>');
    }
    obj.data.Items.forEach((book) => {
      res.write(`<tr><td>${book.year}</td><td>${book.name}</td>
      <td>${book.type}</td><td>${book.author}</td>
      <td><a href="/edit?year=${book.year}&name=${book.name}&type=${book.type}&author=${book.author}">Edit</a>
      <a href="/delete?year=${book.year}&name=${book.name}">Delete</a></td></tr>`);
    });
  }
  res.write('</table>');
  res.end();
}

function writeCreateForm(res) {
  let data = fs.readFileSync('createForm.html', 'utf-8');
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(data);
}

function writeEditForm(year, name, type, author, res) {
  let data = fs.readFileSync('editForm.html', 'utf-8');
  res.writeHead(200, {'Content-Type': 'text/html'});
  data = insertYear(data, year);
  data = insertName(data, name);
  data = insertType(data, type);
  data = insertAuthor(data, author);
  res.write(data);
}

function insertYear(data, year) {
  let strInputYear = '<input name="year" type="text" readonly="readonly"/>';
  let indexYear = data.indexOf(strInputYear) + strInputYear.length - 2;
  return data.substr(0, indexYear) + ` value='${year}'` + data.substr(indexYear);
}

function insertName(data, name) {
  let strInputName = '<input name="name" type="text" readonly="readonly"/>';
  let indexName = data.indexOf(strInputName) + strInputName.length - 2;
  return data.substr(0, indexName) + ` value='${name}'` + data.substr(indexName);
}

function insertType(data, type) {
  let strInputType = '<input name="type" type="text"/>';
  let indexType = data.indexOf(strInputType) + strInputType.length - 2;
  return data.substr(0, indexType) + ` value='${type}'` + data.substr(indexType);
}

function insertAuthor(data, author) {
  let strInputAuthor = '<input name="author" type="text"/>';
  let indexAuthor = data.indexOf(strInputAuthor) + strInputAuthor.length - 2;
  return data.substr(0, indexAuthor) + ` value='${author}'` + data.substr(indexAuthor);
}


module.exports = {
  writeSearchForm: writeSearchForm,
  writeCreateForm: writeCreateForm,
  writeEditForm: writeEditForm,
  writeItemTable: writeItemTable
};
