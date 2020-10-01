const {Router} = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const router = Router()

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

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body

        const candidate = await  User.findOne({email})

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

router.post('/register', async (req, res) => {
    try {
        const {email, password, repeat, name} = req.body

        const candidate = await User.findOne({email})

        if (candidate) {
            req.flash('registerError', 'Такой email уже занят ')
            res.redirect('/auth/login#register')
        } else {
            const hasPassword = await bcrypt.hash(password, 10)
            const user = new User({
                email, password: hasPassword, name, cart: {items: []}
            })
            await user.save()
            res.redirect('/auth/login#login')
        }

    } catch (e) {

    }
})

module.exports = router