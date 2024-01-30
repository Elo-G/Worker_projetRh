
// Module permettant la gestion des fichiers uploadés:
const multer = require('multer'); 

// je définie les formats de fichiers qui seront acceptés:
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

/*la méthode multer.diskStorage permet de paramétrer le nom et la destination du fichier file ;
 elle prend en paramètre un objet dont les attributs sont : destination, et filename*/
const storage = multer.diskStorage({

  destination: (req, file, callback) => {            //la valeur de l'attribut destination est une fonction anonyme definissant la destination du fichier uploadé par le client
    callback(null, './assets/uploads/');
  },

  filename: (req, file, callback) => {                     // la valeur de l'attribut filename est une fonction anonyme définissant le nom que prendra le fichier uploadé 
    const name = file.originalname.split(' ').join('_');   // on remplace les espace par des "_" dans le nom du fichier original
    const extension = MIME_TYPES[file.mimetype];           // on récupère l'extension du fichier
    callback(null, name + Date.now() + '.' + extension);   // on y ajoute Date.now()pour assurer que le nom du fichier soit unique (car basé sur date et heure uniques)
  }
});


//middleware upload = méthode multer prenant en paramètre un objet avec ici pour attributs storage, et limits (qui définit la taille maxi du fichier)
const upload = multer({ 
  storage: storage, 
  limits:{          
    fieldSize:1024*1024*3
  }
})

module.exports = upload