const mongoose = require('mongoose');
const Product = require('../models/product');
const dotenv = require('dotenv')
dotenv.config();

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log('Database Connected ✔'))
    .catch((e) => {
        console.log(e)
    });

const seedProducts = [
    {
        name: 'Feather Wand',
        description: 'Trigger your cat\'s hunting instinct with every swish.',
        image: 'https://ae01.alicdn.com/kf/HTB1e3VtLXXXXXaFXFXXq6xXFXXXN/Randomly-color-Turkey-Feather-Wand-Stick-For-Cat-Catcher-Teaser-Toy-For-Pet-Kitten-Jumping-Train.jpg',
        price: 7.99
    },
    {
        name: 'Catnip Ball',
        description: 'Packed with premium catnip, prepare for chaos.',
        image: 'https://ae01.alicdn.com/kf/HTB1tNQ.K7voK1RjSZFwq6AiCFXaW/Cat-Toy-Catnip-Ball-Chicken-Feather-Shuttlecock-Pet-Cat-Chewing-Healthy-Interactive-Tease-Toy-Healthy-and.jpg',
        price: 5.99
    },
    {
        name: 'Ball Pyramid',
        description: 'Three levels of spinning, swatting fun.',
        image: 'https://assets.petco.com/petco/image/upload/f_auto,q_auto/3131727-center-1',
        price: 10.99
    },
    {
        name: 'Scratch Ball',
        description: 'Hunt it, scratch it, love it, all in one.',
        image: '/images/scratch.png',
        price: 7.99
    },
    {
        name: 'Yarn Ball',
        description: 'A timeless classic. Simple, satisfying, irresistible.',
        image: '/images/yarn.png',
        price: 6.99
    },
    {
        name: 'Mouse Toy',
        description: 'Bring the hunt indoors with this lifelike crinkle mouse.',
        image: 'https://cdn.shopify.com/s/files/1/1834/5785/products/product-image-921103875_large.jpg?v=1557375188',
        price: 2.99
    }
];

const seedDB = async() => {
    await Product.deleteMany({});
    await Product.insertMany(seedProducts);
    console.log('Database seeded!');
}

seedDB().then(() => {
    mongoose.connection.close();
})
