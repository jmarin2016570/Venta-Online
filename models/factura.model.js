"use strict"

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var facturaSchema = ({
    name: String,
    products: [{type: Schema.ObjectId, ref:"product"}]
})

module.exports = mongoose.model("bill",facturaSchema);