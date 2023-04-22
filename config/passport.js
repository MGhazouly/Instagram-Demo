const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const mysql = require('mysql2')
const { validPassword } = require('../util/PasswordValidation');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  port: process.env.MYSQL_PORT,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
}).promise()


const customFields = {
  usernameField: 'username',
  passwordField: 'password',
};


/*Passport JS*/
const verifyCallback = async (username, password, done) => {
  console.log(" inside verify callback")

  try {
    let [results] = await pool.query('SELECT * FROM users WHERE UserName = ? ', [username]);
    if (results.length == 0) { return done("Wrong username or password", false) }
    const isValid = validPassword(password, results[0].hash, results[0].salt);
    user = { UserID: results[0].UserID, UserName: results[0].UserName, hash: results[0].hash, salt: results[0].salt, Firstname: results[0].Firstname, Lastname: results[0].Lastname };
    if (isValid) {
      return done(null, user);
    }
    else {
      return done("Wrong username or password", false);
    }


  } catch (err) { return done(err) }

}
const strategy = new LocalStrategy(customFields, verifyCallback);
passport.use(strategy);


passport.serializeUser((user, done) => {
  console.log("inside serialize");
  done(null, user.UserID)
});

passport.deserializeUser(async function (userId, done) {
  console.log('deserializeUser' + userId);
  let [results] = await pool.query('SELECT * FROM users where UserID = ?', [userId])
  done(null, results[0]);
});
