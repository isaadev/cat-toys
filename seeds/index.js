const mongoose = require('mongoose');
// const data = require('./data')
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
        description: 'Entice your cat with the hunt!',
        image: 'https://images-ext-2.discordapp.net/external/LJNKGAqv8O3-3oub0BhTy_czk2ewKB5LZOXTdO9Em7c/%3Fu%3Dhttps%253A%252F%252Fae01.alicdn.com%252Fkf%252FHTB1e3VtLXXXXXaFXFXXq6xXFXXXN%252FRandomly-color-Turkey-Feather-Wand-Stick-For-Cat-Catcher-Teaser-Toy-For-Pet-Kitten-Jumping-Train.jpg%26f%3D1%26nofb%3D1/https/external-content.duckduckgo.com/iu/',
        price: 7.99
    },
    {
        name: 'Catnip Ball',
        description: 'Bring out your cat\'s inner crazy!',
        image: 'https://images-ext-1.discordapp.net/external/I0a78WPtXTeaT7-GSjCT15nXOuPo9M3HhOPceCNiswI/%3Fu%3Dhttps%253A%252F%252Fae01.alicdn.com%252Fkf%252FHTB1tNQ.K7voK1RjSZFwq6AiCFXaW%252FCat-Toy-Catnip-Ball-Chicken-Feather-Shuttlecock-Pet-Cat-Chewing-Healthy-Interactive-Tease-Toy-Healthy-and.jpg%26f%3D1%26nofb%3D1/https/external-content.duckduckgo.com/iu/',
        price: 5.99
    },
    {
        name: 'Ball Pyramid',
        description: 'Watch your cat\'s mind go in circles!',
        image: 'https://images-ext-2.discordapp.net/external/d9PR3sjsv2G8FvrSqsPIv_MEsox2Vh2wDqXwH1fiN5A/%3Fu%3Dhttps%253A%252F%252Fassets.petco.com%252Fpetco%252Fimage%252Fupload%252Ff_auto%252Cq_auto%252F3131727-center-1%26f%3D1%26nofb%3D/https/external-content.duckduckgo.com/iu/?width=1226&height=1226',
        price: 10.99
    },
    {
        name: 'Scratch Ball',
        description: 'Hunt + Scratch in one ball!',
        image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.istockphoto.com%2Fphotos%2Fcat-toy-isolated-on-white-background-picture-id505887949%3Fk%3D6%26m%3D505887949%26s%3D170667a%26w%3D0%26h%3DOuE0wNY5rPN-IeJ3uJzWMYwMpkWqrOrZgnKzeM9xjNY%3D&f=1&nofb=1',
        price: 7.99
    },
    {
        name: 'Yarn Ball',
        description: 'Every cat\'s favorite!',
        image: 'https://ext_ernal-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.publicdomainpictures.net%2Fpictures%2F170000%2Fvelka%2Fcat-isolated-on-the-white-1461322116tdn.jpg&f=1&nofb=1',
        price: 6.99
    },
    {
        name: 'Mouse Toy',
        description: 'Tom and Jerry right in your home',
        image: 'https://cdn.shopify.com/s/files/1/1834/5785/products/product-image-921103875_large.jpg?v=1557375188',
        price: 2.99
    }
];


const seedDB = async() => {
    await Product.deleteMany({});
    await Product.insertMany(seedProducts);
}

seedDB().then(() => {
    mongoose.connection.close();
})