const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                courseId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Course',
                    required: true

                }
            }
        ]
    }
})

module.exports = mongoose.model('User', userSchema)