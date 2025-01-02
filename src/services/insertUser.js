const bcrypt = require('bcryptjs');
const User = require("../models/User");

const insertUserService = {
    async insertUser(item)
    {
        let defaultDay = new Date();
        defaultDay.setDate(defaultDay.getDate() + 7);
        const { fullName, password, nickname, email, dateOfBirth, type, idCategory = null, remainingTime, verificationToken } = item;
        const saltRounds = 10;
        let result;
        let fail = false;
        const hash = bcrypt.hashSync(password, saltRounds);

        const newUser = new User({
            fullName,
            password: hash,
            nickname: type === "writer" ? nickname : null,
            email,
            dateOfBirth,
            type,
            idCategory: type === "editor" ? idCategory : null,
            remainingTime: type === "subscriber" ? (remainingTime ? remainingTime : defaultDay) : null,
            verificationToken: verificationToken,
            isVerified: true
        })
            
        try
        {
            result = await newUser.save();
        }
        catch(err)
        {
            fail = true;
            result = err;
        }

        return { fail, result }
    },
}

module.exports = insertUserService