const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const passport = require('passport')
const passportLocal = require('passport-local').Strategy
const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs')
const session = require('express-session')
const User = require('./user')
const app = express()

mongoose.connect("mongodb+srv://mhulme:SThendy137!@cluster0.aq0gb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
},
() => {
    console.log("Mongoose Is Connected")
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

app.use(session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true
}))

app.use(cookieParser("secretcode"))
app.use(passport.initialize())
app.use(passport.session())
require('./passportConfig')(passport)

/*app.post("/login", (req, res, next) => {
    passport.authenticate("local", (err,user,info) => {
        if(err) throw err
        if(!user) res.send("No User Exists")
        else{
            req.login(user, err => {
                if(err) throw err
                res.send('Successfully Authenticated')
                console.log(req.user)
            })
        }
    })(req,res,next)
})*/
app.post("/login", passport.authenticate("local"), function(req, res){
    console.log(req.user)
    req.login(req.user, err => {
        if(err) throw err
        res.send('Successfully Authenticated')
        console.log(req.user)
    })
})
app.post("/register", (req, res) => {
    User.findOne({userName: req.body.userName}, async (err,doc) => {
        if(err) throw err
        if(doc) res.send("User Already Exists")
        if(!doc) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const newUser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                userName: req.body.userName,
                password: hashedPassword
            })
            await newUser.save()
            res.send("User Created")
        }
    })
})
app.post("/newstory", (req,res) => {
    var story = req.body
    console.log(story)
})
app.get("/user", (req, res) => {
    res.send(req.user)
})

app.listen(5000, () => {
    console.log('Server Has Started')
})