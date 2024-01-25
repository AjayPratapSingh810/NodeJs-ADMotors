const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    vechileName: String,
    description: String,
    ownerName: String,
    ownerAddress: String,
    contact: String,
    postUrl: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model("post", postSchema);