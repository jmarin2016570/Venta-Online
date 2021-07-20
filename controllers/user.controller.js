"use strict"

var User = require("../models/user.model");
var Carrito = require("../models/carrito.model");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("../services/jwt");
const { param } = require("../routes/user.route");

function createCart(user){
    var carrito = new Carrito();

    carrito.compra = false;
    carrito.owner = user._id;
    carrito.save((err,cartSaved)=>{
        if(err){
            console.log(err);
        }else if(cartSaved){
            console.log("Carro de compras creado exitosamente",cartSaved);
        }else{
            console.log("No se creó");
        }
    })
}

function admin(){
    User.findOne({username: "admin"},(err,adminFind)=>{
        if(err){
            console.log("Error al crear el usuario admin");
        }else if(adminFind){
            console.log("El administrador se creo correctamente");
        }else{
            var user = new User();
            bcrypt.hash("12345",null,null,(err,passwordHashed)=>{
                if(err){
                    console.log("Error al encriptar contraseña");
                }else if(passwordHashed){
                    user.username = "admin";
                    user.password = passwordHashed;
                    user.role = "ROLE_ADMIN";
                    user.save((err,userSaved)=>{
                        if(err){
                            console.log("Error al crear el ADMIN");
                        }else if(userSaved){
                            createCart(userSaved);
                            console.log("El administrador se creo correctamente");
                        }else{
                            console.log("No se creo el usuario admin");
                        }
                    })
                }else{
                    console.log("No se encriptó la contraseña");
                }
            })
        }
    })
}

function login(req,res){
    var params = req.body;

    if(params.username && params.password){
        User.findOne({username: params.username},(err,userFind)=>{
            if(err){
                return res.status(500).send({message: "Error en el servidor al buscar"});
            }else if(userFind){
                bcrypt.compare(params.password,userFind.password,(err,checkPassword)=>{
                    if(err){
                        return res.status(500).send({message: "Error al comparar contraseñas"});
                    }else if(checkPassword){
                        if(params.gettoken){
                            return res.send({token: jwt.createToken(userFind)});
                        }else{
                            return res.send({message: "Bienvenido"});
                        }
                    }else{
                        return res.status(403).send({message: "No se creo el usuario admin incorrecta"});
                    }
                })
            }else{
                return res.send({message: "El usuario no existe"});
            }
        })
    }else{
        return res.status(403).send({message: "No se creo el usuario admin"});
    }
}

function register(req,res){
    var params = req.body;
    var user = new User();

    if(params.name && params.username && params.password && params.email){
        User.findOne({username: params.username},(err,userFind)=>{
            if(err){
                return res.status(500).send({message: "Error al buscar"});
            }else if(userFind){
                return res.send({message: "Nombre de usuario ya utilizado"});
            }else{
                bcrypt.hash(params.password,null,null,(err,passwordHashed)=>{
                    if(err){
                        return res.status(500).send({message: "Error al encriptar la contraseña"});
                    }else if(passwordHashed){
                        user.name = params.name;
                        user.lastname = params.lastname;
                        user.username = params.username;
                        user.password = passwordHashed;
                        user.email = params.email.toLowerCase();
                        if(params.role == "ROLE_ADMIN"){
                            user.role = "ROLE_ADMIN";
                        }else{
                            user.role = "ROLE_CLIENTE";
                        }
                        user.save((err,userSaved)=>{
                            if(err){
                                return res.status(500).send({message: "Error al registrarse"});
                            }else if(userSaved){
                                createCart(userSaved);
                                return res.send({message: "Usuario creado exitosamente",userSaved});
                            }else{
                                return res.status(404).send({message: "No se registró"});
                            }
                        })
                    }else{
                        return res.status(404).send({message: "Contraseña no encriptada"});
                    }
                })
            }
        })
    }else{
        return res.status(403).send({message: "Ingrese los datos mínimos (Nombre, usuario, contraseña y correo)"});
    }
}

function updateUser(req,res){
    let userId = req.params.id;
    let update = req.body;

    if(userId == req.user.sub || req.user.role == "ROLE_ADMIN"){
        if(update.password){
            return res.send({message: "No se puede actualizar la contraseña"});
        }else{
            User.findById(userId,(err,userFinded)=>{
                if(err){
                    return res.status(500).send({message: "Error al buscar"});
                }else if(userFinded){
                    if(userFinded.role == "ROLE_CLIENTE"){
                        User.findByIdAndUpdate(userId,update,{new:true},(err,userUpdated)=>{
                            if(err){
                                return res.status(500).send({message: "Error al intentar actualizar"});
                            }else if(userUpdated){
                                return res.send({message: "Usuario actualizado exitosamente",userUpdated});
                            }else{
                                return res.status(404).send({message: "No se actualizó"});
                            }
                        })
                    }else{
                        return res.status(401).send({message: "Un ADMIN no puede actualizar a otro ADMIN"});
                    }
                }else{
                    return res.status(404).send({message: "ID de usuario no existente"});
                }
            })
        }
    }else{
        return res.status(401).send({message: "No puedes actualizar este usuario"});
    }
}

function removeCart(user){
    Carrito.findOneAndRemove({owner: user._id},(err,cartRemoved)=>{
        if(err){
            console.log("Error al eliminar carrito");
        }else if(cartRemoved){
            console.log("Carrito eliminado exitosamente");
        }else{
            console.log("No se eliminó el carrito");
        }
    })
}

function removeUser(req,res){
    let userId = req.params.id;
    
    if(userId == req.user.sub || req.user.role == "ROLE_ADMIN"){
        User.findById(userId,(err,userFind)=>{
            if(err){
                return res.status(500).send({message: "Error al buscar"});
            }else if(userFind){
                if(userFind.role == "ROLE_CLIENTE"){
                    removeCart(userFind);
                    User.findByIdAndRemove(userId,(err,userRemoved)=>{
                        if(err){
                            return res.status(500).send({message: "Error al intentar eliminar"});
                        }else if(userRemoved){
                            return res.send({message: "Usuario removido exitosamente"});
                        }else{
                            return res.status(403).send({message: "Usuario no existente o ya fue eliminado"});
                        }
                    })
                }else{
                    return res.status(401).send({message: "Un ADMIN no puede eliminar a otro ADMIN"});
                }
            }else{
                return res.status(403).send({message: "ID de usuario no existente o ya fue eliminado"});
            }
        })
    }else{
        return res.status(401).send({message: "No puedes eliminar a este usuario"});
    }
}

module.exports = {
    admin,
    login,
    register,
    updateUser,
    removeUser
}