const router = require('express').Router()

const animalManager = require('../managers/animalManager')
const Animal = require('../models/Animal')
const {getErrorMessage} = require('../utils/errorHelpers')
const { isAuth } = require('../middlewares/authMiddleware')


router.get('/', async (req, res)=>{
    const animals = await animalManager.getAll().lean()

    res.render('animals', {animals})
})


router.get('/create', isAuth, (req, res)=>{
    res.render('animals/create')
})

router.post('/create', isAuth, async (req, res)=>{
    const animalData = {...req.body, owner: req.user._id}
    
    try{
        await animalManager.create(animalData)

        res.redirect('/animals')
    }catch (err){
        res.render('animals/create', {error: getErrorMessage(err)})
    }
})

router.get('/:animalId/details', async (req, res)=>{
    const user = req.user?._id
    const animalId = req.params.animalId
    const animal = await animalManager.getOne(animalId).lean()

    console.log(req.user)
    console.log(animal.owner._id)
    const isOwner = req.user?._id == animal.owner._id
    let hasDonated = animal.donations.filter(e => e.user == user)
    
    if(hasDonated.length == 0){
        hasDonated = false
    }else{
        hasDonated = true
    }

    res.render('animals/details', {animal, isOwner, hasDonated})
    
})

router.get('/:animalId/delete', async (req, res)=>{
    const animalId = req.params.animalId
    const animal = await animalManager.getOne(animalId).lean()
    const isOwner = req.user?._id == animal.owner._id
    
    try{
        if(!isOwner){
            throw Error
        }
        await animalManager.delete(animalId)

        res.redirect('/animals')
    }catch(err){
        res.render('animals/details', {error: "Unsuccessful deletion"})
    }
})

router.get('/:animalId/edit', async (req, res)=>{
    const animalId = req.params.animalId
    
    const animal = await animalManager.getOne(animalId).lean()
    const isOwner = req.user?._id == animal.owner._id
    if(!isOwner){
        res.redirect('/details')
    }
    res.render('animals/edit', {animal})
})

router.post('/:animalId/edit', async (req, res)=>{
    const animalData = req.body
    const animalId = req.params.animalId

    const animal = await animalManager.getOne(animalId).lean()
    const isOwner = req.user?._id == animal.owner._id
    if(!isOwner){
        res.redirect('/details')
    }

    try{
        await animalManager.edit(animalId, animalData)
        res.redirect(`/animals/${animalId}/details`)
    }catch(err){
        res.render('animals/edit', {error: getErrorMessage(err), ...animalData})
    }
})

router.get('/:animalId/donate', async (req, res)=>{
    const animalId = req.params.animalId
    const user = req.user._id
    const animal = await animalManager.getOne(animalId).lean()
    const isOwner = req.user?._id == animal.owner._id
    try{
        if(isOwner){
            throw Error
        }
        await animalManager.donate(animalId, {user})
        res.redirect(`/animals/${animalId}/details`)
    }catch(err){
        console.log(err.message)
        res.render('animals/details', {error: 'Unable to Donate'})
    }
})

router.get('/search' ,async (req, res)=>{
    
    res.render('animals/search')
    
})

router.post('/search' ,async (req, res)=>{
    const {location} = req.body   
    
    try{
        let animals = await animalManager.findAnimalBySearch({location})

        let noResults = animals.length
        if(noResults == 0){
            noResults = true
        }else{
            noResults = false
        }
    

        res.render('animals/search', {animals, noResults})
    }catch(err){
        console.log(err)
        res.render('animals/search', {error: 'Unable to search, something went wrong'})
    }
    
    
})


module.exports = router