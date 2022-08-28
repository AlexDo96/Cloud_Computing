const http = require('http');
const url = require('url');
const port = 3000;
const FORM = require('./writeform');
const DATA = require('./aws');

http.createServer((req, res) => {
  let urlObject = url.parse(req.url, true);
  let pathName = urlObject.pathname;
  let data = urlObject.query;
  let year = data.year;
  let name = data.name;
  let type = data.type;
  let author = data.author;

  if (pathName === '/') {
    FORM.writeSearchForm(res);
    DATA.getAllItem(res);
  } else if (pathName === '/search') {
    if (!year&&!name) {
      res.writeHead(302, {'Location': '/'});
      res.end();
    } else {
      FORM.writeSearchForm(res);
      DATA.searchItem(year, name, res);
    }
  }
  else if (pathName === '/new') {
    FORM.writeCreateForm(res);
    res.end();
  } else if (pathName === '/create') {
    DATA.createItem(year, name, type, author, res);
  } else if (pathName === '/edit') {
    FORM.writeEditForm(year, name, type, author, res);
    res.end();
  } else if (pathName === '/save') {
    DATA.updateItem(year, name, type, author, res);
  } else if (pathName === '/delete') {
    DATA.deleteItem(year, name, res);
  }
}).listen(port, () => {
  console.log(`Server starting at port ${port}`);
});



