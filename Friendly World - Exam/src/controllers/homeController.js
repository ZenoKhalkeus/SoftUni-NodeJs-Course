const router = require('express').Router()
const Animal = require('../models/Animal')
const animalManager = require('../managers/animalManager')

//TODO add controller routes

router.get('/', async (req, res) =>{
    let query = await animalManager.getLatestThree()
    let length = query.length
    queryResult = query.slice(length-3,length)
    res.render('home', {queryResult})
})

router.get('/404', (req, res)=>{
    res.render('404')
})

module.exports = router