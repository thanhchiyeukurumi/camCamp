// No need to run this file, just for seeding data to mongodb when start the project
const mongoose = require('mongoose');
const cities = require('./cities');
const Campground = require('../models/campground');
const { places, descriptors } = require('./seedHelpers');

// connect to mongodb
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
const db = mongoose.connection;
// check connection
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => { // listen once
    console.log("Database connected");
});

// ramdom function
const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

// seed function
const seedDB = async () => {
    await Campground.deleteMany({}); // delete all
    for (let i = 0; i < 20; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '67259ddea1136aae6d3c8fdc', // set author id
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dsimlypyu/image/upload/v1734769392/yelpCamp/cydmdphckirhziki2exg.jpg',
                    filename: 'yelpCamp/wny0rhzz8pswdqg5c4to'
                },
                {
                    url: 'https://res.cloudinary.com/dsimlypyu/image/upload/v1730867656/yelpCamp/vestvwlkwbzgi3ksts5v.jpg',
                    filename: 'yelpCamp/kw8jwjxcdvqyqxf08jjx'
                }
            ],
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi non nisi eu nulla hendrerit condimentum vehicula in tellus. Maecenas pellentesque mauris ac lobortis efficitur. Aliquam tristique velit in libero tristique rutrum. Donec velit libero, tempor a convallis sed, dignissim pretium nunc.',
            price: price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            }
        });
        await camp.save();
    }
};
// close connection
seedDB().then(() => {
    mongoose.connection.close();
});