"use strict"

var express = require("express");
var bodyParser = require("body-parser");
var userRoutes = require("./routes/user.route");
var categoriaRoutes = require("./routes/categoria.route");
var productRoutes = require("./routes/product.route");
var cartRoutes = require("./routes/carrito.route");
var facturaRoutes = require("./routes/factura.route");

var app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use("/v1",userRoutes);
app.use("/v1",categoriaRoutes);
app.use("/v1",productRoutes);
app.use("/v1",cartRoutes);
app.use("/v1",facturaRoutes);

module.exports = app;