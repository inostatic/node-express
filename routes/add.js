const {Router} = require('express')
const  Course = require('../models/course')
const {validationResult} = require('express-validator/check')
const {courseValidators} = require('../utils/validators')
const auth = require('../middleware/auth')
const router = Router()

router.get('/', auth, (req, res) => {
    res.render('add', {
        title: 'Add course',
        isAdd: true
    })
})

router.post('/', auth, courseValidators, async (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        req.flash('registerError', errors.array()[0].msg)
        return res.status(422).render('add', {
            title: 'Add course',
            isAdd: true,
            error: errors.array()[0].msg,
            data: {
                title: req.body.title,
                price: req.body.price,
                url: req.body.url
            }
        })
    }

    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        url: req.body.url,
        userId: req.user
    })
    
    try {
        await course.save()
        res.redirect('/courses')
    } catch (e) {
        console.log('ERROR ADD', e)
    }

})

module.exports = router