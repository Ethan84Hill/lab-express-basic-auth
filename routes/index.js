const router = require("express").Router();
const bcryptjs = require('bcryptjs')
const User = require('../models/User.model')

const { isLoggedIn , isAnon } = require('../middlewares/auth.middlewares')

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/signup', isAnon, (req, res, next) => {
  res.render('signup.hbs')
})

router.post('/signup', isAnon, (req, res, next) => {
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

router.get('/login', isAnon, (req, res, next) => {
  res.render('login.hbs')
})



router.post('/login', isAnon, (req, res, next) => {

  const { username, password } = req.body

  if(!username || !password) {
      res.render('login.hbs', { errorMessage: 'sorry you forgot email or password'})
      return;
  }

  User.findOne({ username: username })
      .then(foundUser => {

          if(!foundUser) {
              // res.send('sorry user does not exist')
              res.render('login.hbs', { errorMessage: 'sorry user does not exist' })
              return;
          }

          const isValidPassword = bcryptjs.compareSync(password, foundUser.password)

          if(!isValidPassword) {
              // res.send('sorry wrong password')
              res.render('login.hbs', { errorMessage: 'sorry wrong password' })
              return;
          }

          req.session.user = foundUser
          // res.send('logged in')
          res.render('profile.hbs', foundUser)
      })
      .catch(err => {
          console.log(err)
          res.send(err)
      })
})

router.get('/profile', isLoggedIn, (req, res, next) => {
  console.log(req.session)
  res.render('profile.hbs', req.session.user)
})

router.get('/main', isAnon, (req, res, next) => {
  res.render('main.hbs')
})

router.get('/private', isLoggedIn, (req, res, next) => {
  res.render('private.hbs', req.session.user)
})

router.get('/logout', (req, res, next) => {
  req.session.destroy(() => {
      res.redirect('/');
  })
})


module.exports = router;
