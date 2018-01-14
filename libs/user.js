const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: 'E-mail could not be empty',
        validate: [
            {
                validator(value) {
                    return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
                },
                msg: 'E-mail is not valid.'
            }
        ],
        unique: 'This email already exists!'
    },
    displayName: {
        type: String,
        required: 'User must have a Name.',
        unique: 'User with this name already exists!'
    }

}, {
    timestamps: true
});

userSchema.statics.publicFields = ['email', 'displayName'];

module.exports = mongoose.model('User', userSchema);