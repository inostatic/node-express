const {Router} = require('express')
const bcrypt = require('bcryptjs')
const {validationResult} = require('express-validator/check')
const sgMail = require('@sendgrid/mail')
const keys = require('../keys')
const User = require('../models/user')
const regEmail = require('../emails/registration')
const {registerValidators, loginValidators} = require('../utils/validators')
const router = Router()

sgMail.setApiKey(keys.SENDGRID_API_KEY)


router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect(('/auth/login#login'))
    })

})

router.post('/login', loginValidators, async (req, res) => {
    try {
        const {email, password} = req.body

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('registerError', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#login')
        }

        const candidate = await User.findOne({email})

        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password)

            if (areSame) {
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                    res.redirect('/')
                })

            } else {
                req.flash('loginError', 'Неправильный логин или пароль')
                res.redirect('/auth/login#login')
            }

        } else {
            req.flash('loginError', 'Неправильный логин или пароль')
            res.redirect('/auth/login#login')
        }
    } catch (e) {

    }

})

router.post('/register', registerValidators, async (req, res) => {
    try {
        const {email, password, name} = req.body

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('registerError', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#register')
        }

        const hasPassword = await bcrypt.hash(password, 10)
        const user = new User({
            email, password: hasPassword, name, cart: {items: []}
        })
        await user.save()
        // await sgMail.send(regEmail(email, password))
        res.redirect('/auth/login#login')

    } catch (e) {
        console.log(e)
    }
})

module.exports = router