const mongoose = require("mongoose");

const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost:27017/ADMotors");

const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }]
});

userSchema.plugin(plm);

module.exports = mongoose.model("User", userSchema);