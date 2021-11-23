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

router.get('/', checkLogIn, async function (req, res, next) {
    if (req.session.user.role == 'User') {
        res.redirect('/projects')
    }
    let querySyntax = `SELECT userid, email, firstname, lastname, position, isfulltime, role FROM users `
    if (req.query.idCheckFilter) {
        if (req.query.idFilter != '') {
            querySyntax += ` WHERE userid = ${Number(req.query.idFilter)}`
        }
    }
    if (req.query.emailCheckFilter) {
        if (req.query.emailFilter != '') {
            if (req.query.idCheckFilter && req.query.idFilter != '') {
                querySyntax += ` AND LOWER(email) LIKE '%${String(req.query.emailFilter).toLowerCase()}%'`
            } else { querySyntax += ` WHERE LOWER(email) LIKE '%${String(req.query.emailFilter).toLowerCase()}%'` }
        }
    }
    if (req.query.firstnameCheckFilter) {
        if (req.query.firstnameFilter != '') {
            if ((req.query.idCheckFilter && req.query.idFilter != '') || (req.query.emailCheckFilter && req.query.emailFilter != '')) {
                querySyntax += ` AND LOWER(firstname) LIKE '%${String(req.query.firstnameFilter).toLowerCase()}%'`
            } else { querySyntax += ` WHERE LOWER(firstname) LIKE '%${String(req.query.firstnameFilter).toLowerCase()}%'` }
        }
    }
    if (req.query.lastnameCheckFilter) {
        if (req.query.lastnameFilter != '') {
            if ((req.query.idCheckFilter && req.query.idFilter != '') || (req.query.emailCheckFilter && req.query.emailFilter != '') || (req.query.firstnameCheckFilter && req.query.firstnameFilter != '')) {
                querySyntax += ` AND LOWER(lastname) LIKE '%${String(req.query.lastnameFilter).toLowerCase()}%'`
            } else { querySyntax += ` WHERE LOWER(lastname) LIKE '%${String(req.query.lastnameFilter).toLowerCase()}%'` }
        }
    }
    if (req.query.positionCheckFilter) {
        if (req.query.positionFilter != '') {
            if ((req.query.idCheckFilter && req.query.idFilter != '') || (req.query.emailCheckFilter && req.query.emailFilter != '') || (req.query.firstnameCheckFilter && req.query.firstnameFilter != '') || (req.query.lastnameCheckFilter && req.query.lastnameFilter != '')) {
                querySyntax += ` AND position = '${req.query.positionFilter}'`
            } else { querySyntax += ` WHERE position = '${req.query.positionFilter}'` }
        }
    }
    if (req.query.isfulltimeCheckFilter) {
        if (req.query.isfulltimeFilter != '') {
            if ((req.query.idCheckFilter && req.query.idFilter != '') || (req.query.emailCheckFilter && req.query.emailFilter != '') || (req.query.firstnameCheckFilter && req.query.firstnameFilter != '') || (req.query.lastnameCheckFilter && req.query.lastnameFilter != '') || (req.query.positionCheckFilter && req.query.positionFilter != '')) {
                querySyntax += ` AND isfulltime = '${req.query.isfulltimeFilter}'`
            } else { querySyntax += ` WHERE isfulltime = '${req.query.isfulltimeFilter}'` }
        }
    }
    if (req.query.roleCheckFilter) {
        if (req.query.roleFilter != '') {
            if ((req.query.idCheckFilter && req.query.idFilter != '') || (req.query.emailCheckFilter && req.query.emailFilter != '') || (req.query.firstnameCheckFilter && req.query.firstnameFilter != '') || (req.query.lastnameCheckFilter && req.query.lastnameFilter != '') || (req.query.positionCheckFilter && req.query.positionFilter != '') || (req.query.isfulltimeCheckFilter && req.query.isfulltimeFilter != '')) {
                querySyntax += ` AND role = '${req.query.roleFilter}'`
            } else { querySyntax += ` WHERE role = '${req.query.roleFilter}'` }
        }
    }

    let sorting
    if (req.query.id_asc == '') {
        querySyntax += ' ORDER BY userid ASC'
        sorting = 'id_asc'
    }
    else if (req.query.id_desc == '') {
        querySyntax += ' ORDER BY userid DESC'
        sorting = 'id_desc'
    }
    else if (req.query.email_asc == '') {
        querySyntax += ' ORDER BY email ASC'
        sorting = 'email_asc'
    }
    else if (req.query.email_desc == '') {
        querySyntax += ' ORDER BY email DESC'
        sorting = 'email_desc'
    }
    else if (req.query.firstname_asc == '') {
        querySyntax += ' ORDER BY firstname ASC'
        sorting = 'firstname_asc'
    }
    else if (req.query.firstname_desc == '') {
        querySyntax += ' ORDER BY firstname DESC'
        sorting = 'firstname_desc'
    }
    else if (req.query.lastname_asc == '') {
        querySyntax += ' ORDER BY lastname ASC'
        sorting = 'lastname_asc'
    }
    else if (req.query.lastname_desc == '') {
        querySyntax += ' ORDER BY lastname DESC'
        sorting = 'lastname_desc'
    }
    else if (req.query.position_asc == '') {
        querySyntax += ' ORDER BY position ASC'
        sorting = 'position_asc'
    }
    else if (req.query.position_desc == '') {
        querySyntax += ' ORDER BY position DESC'
        sorting = 'position_desc'
    }
    else if (req.query.isfulltime_asc == '') {
        querySyntax += ' ORDER BY isfulltime ASC'
        sorting = 'isfulltime_asc'
    }
    else if (req.query.isfulltime_desc == '') {
        querySyntax += ' ORDER BY isfulltime DESC'
        sorting = 'isfulltime_desc'
    }
    else if (req.query.role_asc == '') {
        querySyntax += ' ORDER BY role ASC'
        sorting = 'role_asc'
    }
    else if (req.query.role_desc == '') {
        querySyntax += ' ORDER BY role DESC'
        sorting = 'role_desc'
    }
    else { querySyntax += ' ORDER BY userid ASC' }

    let dataRaw = await db.query(querySyntax)

    if (!req._parsedUrl.query) { req._parsedUrl.query = '?' }
    let url = `${req._parsedUrl.query}`
    let bridge = ''
    //moving page only
    if (url.split('=')[0] == 'page') {
        url = '?'
    }
    //moving page with filter only
    if (url.split('=')[0] == 'idFilter') {
        url = '?' + url;
        url += '&';
    }
    if (url.split('=')[0] == '?idFilter' && String(url.split('=')[url.split('=').length - 2]).includes("page")) {
        url = url.split('&');
        url.pop(); url.pop();
        url = url.join('&') + '&'
    }
    //moving page with sort only
    if (url == 'id_asc' || url == 'id_desc' ||
        url == 'email_asc' || url == 'email_desc' ||
        url == 'firstname_asc' || url == 'firstname_desc' ||
        url == 'lastname_asc' || url == 'lastname_desc' ||
        url == 'position_asc' || url == 'position_desc' ||
        url == 'isfulltime_asc' || url == 'isfulltime_desc' ||
        url == 'role_asc' || url == 'role_desc') {
        url = '?' + url;
        bridge = "&"
    }
    if ((String(url.split('&')[0]).includes('asc') || String(url.split('&')[0]).includes('desc')) && String(url.split('&')[1]).includes('page')) {
        url = url.split('&')
        url.pop();
        url = '?' + url.join('&') + '&'
    }
    let urls = url.split('&')
    urls.pop(); urls.pop();
    urls = urls.join('&') + '&'

    let totalPage = Math.ceil(dataRaw.rows.length / 3)
    let currentPage = req.query.page ? Number(req.query.page) : 1
    let offset = 3 * (currentPage - 1)
    let dataEachPage = dataRaw.rows.slice(offset, offset + 3)

    const setting = await db.query(`SELECT setting FROM users WHERE userid = 4;`)
    res.render('users/list', {
        title: 'Users',
        base: req.baseUrl,
        data: dataEachPage,
        option: req.query,
        sorting,
        totalPage,
        currentPage,
        offset,
        url,
        bridge,
        urls,
        setting: setting.rows[0].setting,
        role: req.session.user.role,
    });
});

router.post('/saveoption', checkLogIn, async function (req, res, next) {
    let setting = {
        idOption: req.body.idOption,
        emailOption: req.body.emailOption,
        firstnameOption: req.body.firstnameOption,
        lastnameOption: req.body.lastnameOption,
        positionOption: req.body.positionOption,
        isfulltimeOption: req.body.isfulltimeOption,
        roleOption: req.body.roleOption,
    }
    setting = JSON.stringify(setting)
    db.query(`UPDATE users SET setting ='${setting}' WHERE userid = 4;`, (err, res) => {
        if (err) return res.send(err)
    })
    res.redirect('/users');
});

router.get('/add', checkLogIn, function (req, res, next) {
    res.render('users/form', {
        title: 'Add User',
        base: req.baseUrl,
        role: req.session.user.role,
    });
});

router.post('/add', checkLogIn, async function (req, res, next) {
    req.body.isfulltime == 'on' ? req.body.isfulltime = true : req.body.isfulltime = false;
    bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
        if (err) return res.send(err)
        await db.query(`INSERT INTO users (email, password, firstname, lastname, position, role, isfulltime) values('${req.body.email}', '${hash}', '${req.body.firstname}', '${req.body.lastname}', '${req.body.position}', '${req.body.role}',${req.body.isfulltime}); `, (err) => {
            if (err) console.log(err);
        })
    });
    res.redirect('/users');
});

router.get('/edit/:id', checkLogIn, async function (req, res, next) {
    let id = Number(req.params.id);
    let user = await db.query(`SELECT * FROM users WHERE userid = ${id}`)
    res.render('users/formEdit', {
        title: 'Edit User',
        base: req.baseUrl,
        user: user.rows[0],
        role: req.session.user.role,
    });
});

router.post('/edit/:id', checkLogIn, async function (req, res, next) {
    req.body.isfulltime == 'on' ? req.body.isfulltime = true : req.body.isfulltime = false;
    const updateUser = await db.query('UPDATE users SET firstname = $1, lastname = $2, position = $3, isfulltime = $4, role = $5 WHERE userid = $6',
        [req.body.firstname, req.body.lastname, req.body.position, req.body.isfulltime, req.body.role, Number(req.params.id)], (err, res) => {
            if (err) return res.send(err)
        })
    if (req.body.password == '') {
        res.redirect('/users')
    } else {
        bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
            await db.query(`UPDATE users SET password = '${hash}' WHERE userid = ${Number(req.params.id)}`)
            res.redirect('/users');
        })
    }
});

router.get('/delete/:id', checkLogIn, async function (req, res, next) {
    await db.query(`DELETE FROM users WHERE userid = ${Number(req.params.id)}`)
    res.redirect('/users');
});

module.exports = router;