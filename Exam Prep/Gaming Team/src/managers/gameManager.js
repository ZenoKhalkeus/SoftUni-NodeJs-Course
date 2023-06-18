const Game = require('../models/Game')

exports.getAll = () => Game.find().populate('owner')

exports.getOne = (gameId) => Game.findById(gameId).populate('owner')

exports.create = (gameData) => Game.create(gameData)

exports.delete = (photoId) => Game.findByIdAndDelete(photoId)

exports.edit = async (gameId, gameData) => {
    const {platform, name, image, price, genre, description} = gameData

    if(platform == "" || name == "" || image == "" || price == ""|| genre == "" || description == ""){
        throw new Error("All fields are required")
    }else{
        await Game.findByIdAndUpdate(gameId, gameData)
    } 
}

exports.buy = async (gameId, userId) => {
    const game = await Game.findById(gameId)

    game.boughtBy.push(userId)
    return game.save()
}

exports.findGameBySearch = async ({ name, platform }) => {
    const games = await Game
        .find({
            name: { $regex: name, $options: 'i' },
            platform: { $regex: platform, $options: 'i' }
        })
        .lean();
    return games;
}