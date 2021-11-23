const Router = require('express-promise-router')
const router = new Router()
const db = require('../db')
const bcrypt = require('bcrypt');
const saltRounds = 10;

function checkLogIn(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/');
    }
};

router.get('/', checkLogIn, function (req, res, next) {
    res.render('profile/form', {
        title: 'Profile',
        base: req.baseUrl,
        user: req.session.user,
        infoFailed: req.flash('infoFailed'),
        infoSuccess: req.flash('infoSuccess'),
        role: req.session.user.role,
    });
});

router.post('/', checkLogIn, async function (req, res, next) {
    req.body.isfulltime == 'on' ? req.body.isfulltime = true : req.body.isfulltime = false;
    if (!req.body.password[0]) {
        await db.query(`UPDATE users SET position = '${req.body.position}', isfulltime = ${req.body.isfulltime} WHERE email = '${req.session.user.email}'; `, (err, res) => {
            if (err) {
                req.flash('infoFailed', 'Error.');
                return console.log(err);
            }
        })

    } else {
        bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
            if (err) return console.log(err);
            await db.query(`UPDATE users SET password = '${hash}', position = '${req.body.position}', isfulltime = ${req.body.isfulltime} WHERE email = '${req.session.user.email}'`, (err, res) => {
                if (err) {
                    req.flash('infoFailed', 'Error.');
                    return console.log(err);
                };
            })
        });
    }
    req.flash('infoSuccess', 'Profil updated successfully.')
    req.session.user.position = req.body.position;
    req.session.user.isfulltime = req.body.isfulltime;
    res.render('profile/form', {
        title: 'Profile',
        base: req.baseUrl,
        user: req.session.user,
        infoFailed: req.flash('infoFailed'),
        infoSuccess: req.flash('infoSuccess'),
        role: req.session.user.role,
    });
});

module.exports = router;