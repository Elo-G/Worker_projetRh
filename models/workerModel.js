const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  img: {
    type: String,
    required: [true, "photo requise"],
  },
  
  name: {
    type: String,
    required: [true, "nom requis"],
    validate: {
      validator: function (valeur) {
           return /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(valeur);
         },
      message: "Entrez un nom valide", 
    },
  },

  firstName: {
    type: String,
    required: [true, "prénom requis"],
    validate: {
      validator: function (valeur) {
           return /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(valeur);
         },
      message: "Entrez un prénom valide", 
    },
  },

  workStation: {
    type: String,
    required: [true, "poste requis"],
    validate: {
      validator: function (valeur) {
           return /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(valeur);
         },
      message: "Entrez un nom de poste valide", 
    },
  },

  blameNumber: {
    type: Number,
    default: 0,
  },
});

const workerModel = mongoose.model("workers", workerSchema);
module.exports = workerModel;
