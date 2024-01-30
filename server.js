//imports des extensions et fichiers nécéssaires pour coder l'appli:
const express = require("express");
const mongoose = require("mongoose");
const session = require ("express-session");
const compagnyRouter= require('./Routes/compagnyRouter');
const workerRouter= require('./Routes/workerRouter');
require ('dotenv').config(); //ATTENTION à mettre soit en haut de la page soit au dessus de const db


const db = process.env.BDD_URL;
const app = express();



// Configuration et sécurisation (avec un mdp) des sessions pour gérer les informations utilisateur:
app.use(session({secret: process.env.SESSION_PWD,saveUninitialized: true, resave: true}));
//express.static sert les fichiers statiques (CSS, images, etc.) depuis le répertoire 'assets':
app.use(express.static("./assets"))
//analyse et convertit les données envoyées par le client sous le format urlencoded, en objet js:
app.use(express.urlencoded({extended: true}));
//analyse et convertit les données envoyées par le client sous le format JSON, en objet js:
app.use (express.json());
//utilisation des routes suivantes:
app.use (compagnyRouter);
app.use (workerRouter);


//écoute du serveur sur le port 3000
app.listen(3000, (err) => {
    if (err){
        console.log(err);
    }else{
        console.log("connecté");
    }
})

//méthode pr demander à mongoose de se connecter à la bdd (mongodb)
mongoose.set('strictQuery', true)
mongoose.connect(db, (err)=>{
    if (err) {
        console.log(err);   
    }else{
        console.log("connecté à la bdd");
    }
})
