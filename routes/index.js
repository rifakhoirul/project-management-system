const Router = require('express-promise-router')
const router = new Router()
const db = require('../db')
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/', async function (req, res, next) {
  if (req.session.user) {
    res.redirect("/projects")
  }
  res.render('login', {
    infoFailed: req.flash('infoFailed'),
    infoSuccess: req.flash('infoSuccess')
  });
});

router.post('/auth', function (req, res, next) {
  db.query(`SELECT * FROM users WHERE email = '${req.body.email}'`, (err, data) => {
    if (err) return res.send(err)
    if (data.rows.length == 0) {
      req.flash('infoFailed', 'User not found.');
      return res.redirect('/')
    }
    bcrypt.compare(req.body.password, data.rows[0].password, function (err, result) {
      if (err) return res.send('Login failed')
      if (!result) {
        req.flash('infoFailed', 'Wrong password.');
        return res.redirect('/');
      }
      req.session.user = data.rows[0];
      res.redirect('/projects')
    });
  })
});

router.get('/logout', function (req, res, next) {
  req.session.destroy(function (err) {
    res.redirect('/');
  })
});

module.exports = router;
