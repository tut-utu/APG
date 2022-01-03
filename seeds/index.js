const mongoose = require('mongoose');
const cities = require('./cities');
const Campground = require('../models/campground');
const {descriptors,places} = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp')
.then(()=>{
    console.log('Connection open')
})
.catch(err=>{
    console.log('Error!')
    console.log(err)
});

const sample = array => array[Math.floor(Math.random()*array.length)];


const seedDB = async ()=>{
    await Campground.deleteMany({});
    for(let i=0;i <200;i++){
        const random1000 = Math.floor(Math.random()*1000)
        const camp = new Campground({
            author:'61cfb1e551a6d8a7a03182c7',
            title: `${sample(descriptors)},${sample(places)}`,
            location:`${cities[random1000].city},${cities[random1000].state}`,
            images:[
                {
                    url: 'https://res.cloudinary.com/hyccc/image/upload/v1641176940/YelpCamp/mmdaiqhsnsudnsxmnori.png',
                    filename: 'YelpCamp/mmdaiqhsnsudnsxmnori'
                  },
                  {
                    url: 'https://res.cloudinary.com/hyccc/image/upload/v1641176939/YelpCamp/aooaxmkuiguctbbhpyqq.png',
                    filename: 'YelpCamp/aooaxmkuiguctbbhpyqq'
                  }
              ]
              ,
            price: Math.floor(Math.random()*20+10),
            geometry: { type: 'Point', coordinates: [cities[random1000].longitude, cities[random1000].latitude]},
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium nam earum eligendi pariatur amet, corrupti eveniet sequi delectus! Consequatur officia incidunt eos quos quo neque nam sequi deleniti at expedita.'
        })
        await camp.save()
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});