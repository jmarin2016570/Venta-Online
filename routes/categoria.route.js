"use strict"

var express = require("express");
var categoriaController = require("../controllers/categoria.controller");
var api = express.Router();
var mdAuth = require("../middlewares/authenticated");

api.post("/createCategoria",[mdAuth.ensureUser,mdAuth.ensureAdmin],categoriaController.createCategoria);
api.put("/updateCategoria/:id",[mdAuth.ensureUser,mdAuth.ensureAdmin],categoriaController.updateCategoria);
api.delete("/removeCategoria/:id",[mdAuth.ensureUser,mdAuth.ensureAdmin],categoriaController.removeCategoria);
api.get("/getCategorias",mdAuth.ensureUser,categoriaController.getCategorias);
api.get("/searchCategoria",mdAuth.ensureUser,categoriaController.searchCategoria);

module.exports = api;