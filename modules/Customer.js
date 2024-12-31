const mongoose = require('mongoose')
const cutomerSchema = new mongoose.Schema({
    name: String,
    age: Number
});

const Customer = mongoose.model('Customer', cutomerSchema);

module.exports = Customer;