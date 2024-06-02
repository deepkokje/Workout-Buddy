const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema; 

const userSchema =  new Schema({
email: {
    type: String,
    required: true,
    unique: true,
},
password: {
    type: String,
    required: true,
}
});

userSchema.statics.signUp =  async function (email, password) {
const isMailExists = await this.findOne({email});
if(isMailExists) {
    throw Error('Email already in use!');
}
if(!validator.isEmail(email)) {
    throw Error('Enter a valid email!');
}
if (!validator.isStrongPassword(password)) {
    throw Error('Enter a strong password!');
}
const salt = await bcrypt.genSalt(10) //used for generating random string appended to password  
const hashedPassword = await bcrypt.hash(password, salt);

const user = await this.create({email, password: hashedPassword});
return user;
};

userSchema.statics.login =  async function (email, password) {
    if(!email || !password) {
        throw Error('All fields must be filled!');
    }
    const user  = await this.findOne({email});
    if(!user) {
        throw Error('Incorect email!')
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if(!isPasswordMatched) {
        throw Error('Incorrect password!');
    }
    return user;
    };
module.exports = mongoose.model('User', userSchema);
