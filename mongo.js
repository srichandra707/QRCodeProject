const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        unique: false
    },
    lastName: {
        type: String,
        required: true,
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
            validator: function (v) {
                return /[a-zA-Z0-9!@#$%^&*]{8,}/.test(v);
            },
            message: props => 'Invalid password!'
        }
    },
    money: {
        type: Number,
        required: false,
        unique: false,
        default: 10000
    }
});

UserSchema.pre('save', async function (next) {

});

const User = mongoose.model('User', UserSchema);

const VendorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        unique: false
    },
    lastName: {
        type: String,
        required: true,
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
            validator: function (v) {
                return /[a-zA-Z0-9!@#$%^&*]{8,}/.test(v);
            },
            message: props => 'Invalid password!'
        }
    },
    money: {
        type: Number,
        required: false,
        unique: false,
        default: 10000
    }

});

VendorSchema.pre('save', async function (next) {

});

const Vendor = mongoose.model('Vendor', VendorSchema);

const transactionSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true
    },
    vendorEmail: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = { User, Vendor, Transaction };
