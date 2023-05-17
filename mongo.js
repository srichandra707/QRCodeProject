const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    'firstname': {
        type: String,
        required: true,
        match: /^[A-Za-z]+$/
    },
    'lastname': {
        type: String,
        required: true,
        match: /^[A-Za-z]+$/
    },
    email: {
        type: String,
        required: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        validate: {
            validator: function(email) {
                return mongoose.models.User.findOne({email: email})
                    .then ((user)=>!user);
            },
            message: 'Email already exists. '
        }
    },
    password: {
        type: String,
        required: true,
        match: /^[a-zA-Z0-9!@#$%^&*]+$/
    }
});

const User = mongoose.model('User', userSchema);