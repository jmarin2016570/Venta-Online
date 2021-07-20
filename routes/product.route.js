"use strict"

var express = require("express");
var productoController = require("../controllers/product.controller");
var api = express.Router();
var mdAuth = require("../middlewares/authenticated");

api.put("/setProduct/:id",[mdAuth.ensureUser,mdAuth.ensureAdmin],productoController.setProduct);
api.put("/:idC/updateProduct/:idP",[mdAuth.ensureUser,mdAuth.ensureAdmin],productoController.updateProduct);
api.put("/:idC/removeProduct/:idP",[mdAuth.ensureUser,mdAuth.ensureAdmin],productoController.removeProduct);
api.get("/getProducts",mdAuth.ensureUser,productoController.getProducts);
api.get("/searchProduct",mdAuth.ensureUser,productoController.searchProduct);
api.get("/spentProducts",mdAuth.ensureUser,productoController.spentProducts);

module.exports = api;