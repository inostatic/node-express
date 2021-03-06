const {Router} = require('express')
const Course = require('../models/course')
const {validationResult} = require('express-validator/check')
const {courseValidators} = require('../utils/validators')
const auth = require('../middleware/auth')
const router = Router()

router.get('/', async (req, res) => {
    const result = await Course.find()
    const courses = result.reduce((a, e) => [...a, {
        title: e.title,
        price: e.price,
        url: e.url,
        id: e._id
    }], [])

    res.render('courses', {
        title: "Courses",
        isCourses: true,
        courses
    })
})

router.post('/remove', auth, async (req, res) => {
    try {
        await Course.deleteOne({_id: req.body.id})
        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }
})

router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }
    const result = await Course.findById(req.params.id)
    const course = {
        title: result.title,
        price: result.price,
        url: result.url,
        _id: result._id
    }
    res.render('edit',{
        title: `Edit ${course.title}`,
        course
    })
})

router.get('/:id', async (req, res) => {
    const result = await Course.findById(req.params.id).select('title price url')
    const course = {
        title: result.title,
        price: result.price,
        url: result.url
    }
    res.render('course', {
        layout: 'empty',
        title: `Course ${course.title}`,
        course
    })
})

router.post('/edit', auth, courseValidators, async (req, res) => {
    const errors = validationResult(req)
    const {id} = req.body
    if (!errors.isEmpty()) {
        return res.status(422).redirect(`/courses/${id}/edit?allow=true`)

    }
    delete req.body.id

    await Course.findByIdAndUpdate(id, req.body)
    res.redirect('/courses')

})

module.exports = router