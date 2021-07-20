"use strict"

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var categoriaSchema = ({
    name: String,
    products: [{type: Schema.ObjectId, ref:"product"}]
})

module.exports = mongoose.model("category",categoriaSchema);