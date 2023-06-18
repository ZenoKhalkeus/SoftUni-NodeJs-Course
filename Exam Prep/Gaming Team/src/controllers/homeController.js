const router = require('express').Router()

const photoManager = require('../managers/gameManager')
const {isAuth} = require('../middlewares/authMiddleware')
//TODO add controller routes



router.get('/', (req, res) =>{
    res.render('home')
})

router.get('/404', (req, res)=>{
    res.render('404')
})

router.get('/profile', isAuth,async (req, res)=>{
    
    const photos = await photoManager.getByOwner(req.user._id)
    

    res.render('profile', {photos, photoCount: photos.length})
})


module.exports = router