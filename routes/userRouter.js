const express = require('express')
const { getAllUsers, createUser, getUser, Register, isAuth, userExists } = require('../controller/userController')
const passport = require('passport');



const router = express.Router()



router.get('/users', getAllUsers)


router.get('/user', getUser)

router.post('/Register', Register)

router.post('/Login', passport.authenticate('local'), (req, res) => {
  console.log('inside login');
  res.cookie('user', req.user.UserID + ' ' + req.user.Firstname + ' ' + req.user.Lastname, { maxAge: 14 * 24 * 3600000, httpOnly: true });
  res.send(req.user);

});

router.post('/logout', (req, res) => {
  console.log('inside logout');

  req.logout((err) => {
    if (err) throw err;
    res.clearCookie('user');
    res.send('logged out');
  });

})

router.post('/user', createUser)

router.get('/protected-route', isAuth, (req, res, next) => {

  res.send('<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>');
});





module.exports = router