const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Invalid email'],
        // trim: true,
        // validate: [
        //     {
        //         validator: function(value) {
        //             return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value);
        //         }
        //     }
        // ]
    },
    photo: String,
    role: {
        type: String,
        enum: ['guest','user', 'admin'],
        default: 'user',
    },
    phone: {
        type: String,
        required: [true, 'Phone is required'],
        unique: true,
        validate: [
            {
                validator: function(value) {
                    return /^[0-9]{10}$/.test(value);
                }
            }
        ]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false,
        minlength: [6, 'Password must be at least 6 characters long'],
        maxlength: [20, 'Password must be at most 20 characters long'],
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Password confirmation is required'],
        validate: {
            validator: function(value) {
                return value === this.password;
            },
            message: 'Password and password confirmation must match'
        }
    },
    passwordChangedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    __v: {
        type: Number,
        select: false
    }
});

//pre save middleware
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    
    next();
});


userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(JWTTimestamp, 10);
        const userTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return userTimestamp > changedTimestamp;
    }
    return false;
}

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
