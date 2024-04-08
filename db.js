const mongoose = require("mongoose");


// mogoDB URL
mongoose.connect("mongodb+srv://221b:12345@cluster0.j4qqhxw.mongodb.net/DCB");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50
  }
});

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User model
    ref: 'User',
    required: true
  },
  balance: {
    type: Number,
    required: true
  }
});

const menuSchema = new mongoose.Schema({
  cuisine: {
    type: String,
    required: true
  },
  dish: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  dishImage: {
    type: String, // Assuming storing image URLs
    required: false
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true, required: true },
  date: { type: String, unique: true, required: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  guests: { type: Number, required: true },
  inCart: { type: Boolean, default: false },
  isSent: { type: Boolean, default: false },
  email: {
    type: String,
    required: true
  },
  venues: {
    type: String,
    required: true
  },
  event: {
    type: String,
    required: true
  }
});

const cartSchema = new mongoose.Schema({
  cuisine: [{ type: String }], // Change type to String
  dish: [{ type: String }], // Change type to String
});

const mycartSchema = new mongoose.Schema({
  cartItem: [{
    cuisine: { type: String },
    dish: { type: String }
  }]
});



// Create a model from the schema
const User = mongoose.model('User', userSchema);
const Menu = mongoose.model('Menu', menuSchema);
const Order = mongoose.model('Order', orderSchema);
const Account = mongoose.model('Account', accountSchema);
const Cart = mongoose.model('Cart', cartSchema);
const MyCart = mongoose.model('MyCart', mycartSchema);
//Export models
module.exports = {
  User, Account, Menu, Order, Cart, MyCart
};

