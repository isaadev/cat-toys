module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;


    this.add = function(item, id) {
        let storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;

    };

    this.removeItem = function(id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };
    
    this.generateArray = function() {
        let arr = [];
        for (let id in this.items) {
            arr.push(this.items[id])
        }
        return arr;
    }
};



// const mongoose = require("mongoose");

// const CartSchema = new mongoose.Schema(
//     {
//         userId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User"
//         },
//         products: [
//             {
//                 productId: Number,
//                 quantity: Number,
//                 name: String,
//                 price: Number
//             }
//         ], 
//         active: {
//             type: Boolean,
//             default: true
//         },
//         modifiedOn: {
//             type: Date,
//             default: Date.now
//         }
//     },
//     { timestamps: true }
// );

// module.exports = mongoose.model("Cart", CartSchema);