const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required:true,
        unique: false
    },
    lastName:{
        type: String,
        required:true,
        unique: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /[a-zA-Z0-9!@#$%^&*]{8,}/.test(v);
            },
            message: props => 'Invalid password!'
        }
    }
});

UserSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
