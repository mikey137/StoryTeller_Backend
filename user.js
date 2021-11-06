const mongoose = require('mongoose')

const user = new mongoose.Schema({
    firstName: String,
    lastName: String,
    userName: String,
    password: String
})

const story = new mongoose.Schema({
    userName: String,
    title: String,
    body: String
})

module.exports = mongoose.model("Story", story)
module.exports = mongoose.model("User", user)