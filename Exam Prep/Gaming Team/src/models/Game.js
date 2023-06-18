const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    image: {
        type: String,
        required: [true, "Image is required"],
        validate: [/^https?:\/\//i, 'The game image should start with "http://" or "https://"']
    },
    price: {
        type: Number,
        required: [true, "Price is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    genre: {
        type: String,
        required: [true, "Genre is required"]
    },
    platform: {
        type: String,
        match: [/(PC)\b|(Nintendo)\b|(PS4)\b|(PS5)\b|(XBOX)\b/, "Platform should be one of the following PC/Nintendo/PS4/PS5/XBOX"],
        required: [true, "Platform is required"]
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    boughtBy: [
        {
            user: {
                type: mongoose.Types.ObjectId,
                required: true,
                ref: 'User'
            }
        }
    ]
})

const Game = mongoose.model('Game', gameSchema)

module.exports = Game