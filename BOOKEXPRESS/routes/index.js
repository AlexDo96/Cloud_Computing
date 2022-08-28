const express = require('express');
const router = express.Router();
const DATA = require('./aws');

//Lấy danh sách tất cả các cuốn sách
router.get('/books', (req, res) => {
  let y1 = req.query.y1;
  let y2 = req.query.y2;
  let name = req.query.name;
  let year = req.query.year;
  if(y1&&y2){
    if (name){

    } else  {

    }
  }else if (name||year){
    DATA.searchItem(year,name, res);
  }else{
    DATA.getAllItem(res);
  }
});

//Lấy thông tin sách theo range key year
router.get('/books/:year([0-9]{4})', ((req, res) => {
  let year = req.params.year;
  DATA.searchItem(year, "", res);
}));

//Lấy thông tin sách theo hash key name
router.get('/books/:name', ((req, res) => {
  let name = req.params.name;
  DATA.searchItem("", name, res);
}));

router.get('/books/:name/:year', ((req, res) => {
  let name = req.params.name;
  let year = req.params.year;
  DATA.searchItem(year, name, res);
}));

//Tạo một cuốn sách
router.post('/books', ((req, res) => {
  let year = req.body.year;
  let name = req.body.name;
  let type = req.body.type;
  let author = req.body.author;
  DATA.createItem(year, name, type, author, res);
}));

//Update sách
router.put('/books/:name/:year', ((req, res) => {
  let name = req.params.name;
  let year = req.params.year;
  let type = req.body.type;
  let author = req.body.author;
  DATA.updateItem(year ,name, type, author, res);
}));

router.delete('/books/:name/:year', ((req, res) => {
  let name = req.params.name;
  let year = req.params.year;
  DATA.deleteItem(year ,name, res);
}));

module.exports = router;
