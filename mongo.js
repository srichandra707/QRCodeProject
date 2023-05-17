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

const VendorSchema = new mongoose.Schema({
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

VendorSchema.pre('save', async function(next) {
    const vendor = this;
    if (vendor.isModified('password')) {
        vendor.password = await bcrypt.hash(vendor.password, 10);
    }
    next();
});

const Vendor = mongoose.model('Vendor', VendorSchema);

module.exports = User;
module.exports = Vendor;
