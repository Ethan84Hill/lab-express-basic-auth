const router = require("express").Router();
const bcryptjs = require('bcryptjs')
const User = require('../models/User.model')

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/signup', (req, res, next) => {
  res.render('signup.hbs')
})

router.post('/signup', (req, res, next) => {
  console.log(req.body)

  if(!req.body.username || !req.body.password) {
      res.send('sorry you forgot a username or password')
      return;
  }

  User.findOne({ username: req.body.username })
  .then(foundUser => {
      if(foundUser) {
          res.send('sorry user already exists')
          return;
      }

      return User.create({
          username: req.body.username,
          password: bcryptjs.hashSync(req.body.password)
      })
  })

  .then(createdUser => {
      console.log("here's the new user", createdUser)
      res.send(createdUser)
  })
  .catch(err => {
      console.log(err)
      res.send(err)
  })
})

router.get('/login', (req, res, next) => {
  res.render('login.hbs')
})


module.exports = router;
