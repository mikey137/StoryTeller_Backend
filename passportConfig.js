const User = require('./user')
const bcrypt = require('bcryptjs')
const localStrategy = require('passport-local').Strategy

module.exports = function(passport){
    passport.use(
        new localStrategy(
            {usernameField: 'userName', passwordField: 'password'},
            (userName, password, done) => {
            User.findOne({userName: userName}, (err, user) => {
                if(err) throw err
                if(!user) {
                    console.log('no user')
                    return done(null, false)
                }
                bcrypt.compare(password, user.password, (err, result) => {
                    if(err) throw err
                    if(result === true){
                        delete user.password 
                        delete user.__v
                        console.log(user)
                        return done(null, user)
                    }else{
                        return done(null, false)
                    }

                })
            })
        })
    )

    passport.serializeUser((user, cb) => {
        cb(null, user.id)
    })
    passport.deserializeUser((id, cb) => {
        User.findOne({ _id: id}, (err, user) => {
            const userInformation = {
                userName: user.userName,
            }
            cb(err, userInformation)
        })
    })
}
    