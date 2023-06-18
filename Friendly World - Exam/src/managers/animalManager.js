const Animal = require('../models/Animal')

exports.getAll = () => Animal.find().populate('owner')

exports.getLatestThree = () => Animal.find().sort('-posted').lean();

exports.getOne = (animalId) => Animal.findById(animalId).populate('owner')

exports.create = (animalData) => Animal.create(animalData)

exports.delete = (animalId) => Animal.findByIdAndDelete(animalId)

exports.edit = async (animalId, animalData) => {

 try{
    await Animal.findByIdAndUpdate(animalId, animalData,  { runValidators: true })
 }catch(err){
    throw Error (err.message)
 }
    
}

exports.donate = async (animalId, userId) => {
    const animal = await Animal.findById(animalId)

    animal.donations.push(userId)
    return animal.save()
}

exports.findAnimalBySearch = async ({ location }) => {
    const animals = await Animal
        .find({
            location: { $regex: location, $options: 'i' }
        })
        .lean();
    return animals;
}