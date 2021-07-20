"use strict"

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var productoSchema = ({
    name: String,
    price: Number,
    stock: Number
})

module.exports = mongoose.model("product",productoSchema);