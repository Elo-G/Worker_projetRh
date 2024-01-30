const mongoose = require("mongoose");

const compagnySchema = new mongoose.Schema({

  name :{
    type:String,
    required: [true,'nom requis'],
    validate: {
     //validator  méthode pour utiliser des regexs afin de sécuriser un password ou de paramétrer la chaîne de caractère saisie par l'utilisateur
     validator: function (valeur) {
       return /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(valeur);
       },
       message: "Entrez un nom valide", // la méthode renvoie ce message si le nom ne respecte pas la regex
    },
  },

  siretNumber:{
    type: String,
    required:[true,'numero de siret requis'],
    validate: {
     validator: function(v) {
       return /^[0-9]{14}$/u.test(v);
      },
     message: "Entrez un numéro de siret valide"
    },
  },

  mail:{
    type:String,
    required:[true,'mail requis'],
    validate: {
     validator: function(v) {
       return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(v);
      },
     message: "Entrez un mail valide"
    },
  }, 

  pdgName:{
    type:String,
    required:[true, 'nom du directeur requis'],
    validate: {
      validator: function(v) {
        return /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/g.test(v);
      },
      message: "Entrez un nom valide"
    },
  },

  password:{
    type:String,
    required:[true, 'mot de passe requis']
  }

});


const compagnyModel = mongoose.model ('compagnys', compagnySchema);
module.exports = compagnyModel;