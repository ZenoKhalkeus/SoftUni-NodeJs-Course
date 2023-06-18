const mongoose = require('mongoose')

const animalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minLength: [2, "2 Characters minimum for Animal Name"]
    },
    years: {
        type: Number,
        required: [true, "Years is required"],
        min: [1, "Please enter a positive number"],
        max: [100, "Max age is 100"]
    },
    image: {
        type: String,
        required: [true, "Image is required"],
        validate: [/^https?:\/\//i, 'The animal image should start with "http://" or "https://"']
    },
    kind: {
        type: String,
        required: [true, "Kind is required"],
        minLength: [3, "3 Characters minimum for Animal Kind"]
    },
    
    need: {
        type: String,
        required: [true, "Need is required"],
        minLength: [3, "3 Characters minimum for Animal need"],
        maxLength: [20, "20 Characters maximum for Animal Need"]
    },
    location: {
        type: String,
        required: [true, "Location is required"],
        minLength: [5, "5 Characters minimum for Animal Location"],
        maxLength: [15, "15 Characters maximum for Animal Location"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        minLength: [5, "5 Characters minimum for Animal Description"],
        maxLength: [50, "50 Characters maximum for Animal Description"]
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    donations: [
        {
            user: {
                type: mongoose.Types.ObjectId,
                required: true,
                ref: 'User'
            }
        }
    ]
})

const Animal = mongoose.model('Animal', animalSchema)

module.exports = Animal