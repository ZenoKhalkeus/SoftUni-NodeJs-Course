const router = require('express').Router()

const gameManager = require('../managers/gameManager')
const {getErrorMessage} = require('../utils/errorHelpers')


router.get('/', async (req, res)=>{
    const games = await gameManager.getAll().lean()

    res.render('games', {games})
})


router.get('/create', (req, res)=>{
    res.render('games/create')
})

router.post('/create', async (req, res)=>{
    const photoData = {...req.body, owner: req.user._id}
    
    try{
        await gameManager.create(photoData)

        res.redirect('/games')
    }catch (err){
        res.render('games/create', {error: getErrorMessage(err)})
    }
})

router.get('/:gameId/details', async (req, res)=>{
    const user = req.user?._id
    const gameId = req.params.gameId
    const game = await gameManager.getOne(gameId).lean()

    const isOwner = req.user?._id == game.owner._id
    let hasBought = game.boughtBy.filter(e => e.user == user)
    
    if(hasBought.length == 0){
        hasBought = false
    }else{
        hasBought = true
    }

    res.render('games/details', {game, isOwner, hasBought})
    
})

router.get('/:gameId/delete', async (req, res)=>{
    const gameId = req.params.gameId
    try{
        await gameManager.delete(gameId)

        res.redirect('/games')
    }catch(err){
        res.render('games/details', {error: "Unsuccessful deletion"})
    }
})

router.get('/:gameId/edit', async (req, res)=>{
    const gameId = req.params.gameId

    const game = await gameManager.getOne(gameId).lean()
    res.render('games/edit', {game})
})

router.post('/:gameId/edit', async (req, res)=>{
    const gameData = req.body
    const gameId = req.params.gameId

    try{
        await gameManager.edit(gameId, gameData)
        res.redirect(`/games/${gameId}/details`)
    }catch(err){
        res.render('games/edit', {error: 'Unable to update game, all fields are required', ...gameData})
    }
})

router.get('/:gameId/buy', async (req, res)=>{
    const gameId = req.params.gameId
    const user = req.user._id

    try{
        await gameManager.buy(gameId, {user})
        res.redirect(`/games/${gameId}/details`)
    }catch(err){
        console.log(err.message)
        res.render('games/details', {error: 'Unable to buy game'})
    }
})

router.get('/search' ,async (req, res)=>{
    
    res.render('games/search')
    
})

router.post('/search' ,async (req, res)=>{
    const {name, platform} = req.body   
    
    try{
        let games = await gameManager.findGameBySearch({name, platform})
    

        res.render('games/search', {games})
    }catch(err){
        res.render('games/details', {error: 'Unable to search, something went wrong'})
    }
    
    
})


module.exports = router