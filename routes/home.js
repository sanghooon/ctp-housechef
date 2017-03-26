var express = require('express');
var path = require('path');
var router = express.Router();

router.use(express.static('/public'));

router.get('/', (req, res, next) => {
  res.render('home', {
    title: 'House Chef', 
    user: req.user
  });
});

module.exports = router;
