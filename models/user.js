const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const mongooseBcrypt = require('mongoose-bcrypt');

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: 'First name is required',
        trim: true,
        max: 30
    },
    surname: {
        type: String,
        required: 'Surname is required',
        trim: true,
        max: 30
    },
    email: {
        type: String,
        required: 'Email address is required',
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: 'Password is required',
        bcrypt: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.plugin(mongooseBcrypt);
   // before we can use it in our username Schema the plugin of passport-local-mongoose is added by this way
userSchema.plugin( passportLocalMongoose, { usernameField: 'email' } );

module.exports = mongoose.model('User', userSchema);

// "trim" means cut any space off
// "max" means maximum number of characters
// "unique" ensure the same data in stored once inside our data base
// "lowercase" when set to be true it makes sure email is stored in lowercase

// at 34 send to use email { usernameField: 'email' } ) means we ant to log in by email
