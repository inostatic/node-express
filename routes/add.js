const {Router} = require('express')
const  Course = require('../models/course')
const router = Router()

router.get('/', (req, res) => {
    res.render('add', {
        title: 'Add course',
        isAdd: true
    })
})

router.post('/', async (req, res) => {
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