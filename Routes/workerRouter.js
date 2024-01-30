const workerRouter = require("express").Router();
const workerModel = require("../models/workerModel");
const authGuard = require("../services/authGuard");
const upload = require("../services/uploadFile");



//---------------------------ROUTE PAGE INDEX---------------------------------

workerRouter.get("/", async (req, res) => {
  try {
    res.render("index.twig");
  } catch (error) {
    console.log(error);
    res.send(error);
  };
});


//----------------------------- ROUTE PAGE MAIN (contient LISTING EMPLOYES)---------------

workerRouter.get("/main", authGuard, async (req, res) => {
  try {
    let allWorkers = await workerModel.find({ compagnyId: req.session.compagnyId });
    res.render("main.twig", {
     workers: allWorkers,
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  };
});


//--------------------ROUTE DU FORMULAIRE POUR CREER UN EMPLOYE:-------------------

workerRouter.get("/addWorker", async (req, res) => {
  try {
    res.render("form-addWorker.twig");
  } catch (error) {
    console.log(error);
    res.send(error);
  };
});
 


//--------------------ROUTE PR POSTER LE FORMULAIRE (<=> CREER L'EMPLOYE):------------

workerRouter.post("/addWorker", authGuard, upload.single("img"), async (req, res) => {
  try {
   if (req.file){
      //si multerError ds fichier uploadé (cf dans /services/uploadFile.js) => génère une erreur :
      if(req.multerError){
        throw {fileError:"Veuillez entrer un fichier valide"};
      }else{
       //sinon, l'attribut img = au nom du fichier uploadé:
       req.body.img = req.file.filename;}
   }else{
       //si pas de fichier uploadé, génère une erreur :
       throw {fileMessage: "Une photo de l'employé(e) est requise"}
     }
  
    req.body.compagnyId = req.session.compagnyId;
    //crée une instance de workerModel via les données saisies dans le form (<=>req.body):
    let worker = new workerModel(req.body);
    //vérifie les règles de validation du modèle worker, et si erreur => génère l'erreur:
    let validateError = worker.validateSync();
    if(validateError){
      throw validateError;
    }
    //sauvegarde le worker en bdd:
    await worker.save();
    res.redirect("/main");
   // En cas d'erreur(s), rend à nouveau le formulaire en y affichant les erreurs 
  }catch (error) {
    console.log(error);
    res.render("form-addWorker.twig",{
      errorFile:error.fileError,
      messageFile:error.fileMessage,
      validateErrors:error.errors,
    });
  };
});


//---------------------------ROUTE FORMULAIRE UPDATE EMPLOYE-----------

workerRouter.get("/updateWorker/:id",authGuard, async (req, res) => {
  try {
    let workerToUpdate = await workerModel.findOne({ _id: req.params.id });
    res.render("updateWorkerForm.twig", {workerToUpdate:workerToUpdate});
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

//--------------------ROUTE POUR ENREGISTRER LES MAJ DE L'EMPLOYE----------

workerRouter.post("/updateWorker/:id",authGuard,upload.single("img"), async (req, res) =>{ 
  // Récupère les données du worker correspondant à req.params.id
  let workerToUpdate = await workerModel.findOne({ _id: req.params.id }); 
  try{
   if(req.file) {
     //gestion d'erreur de fichier uploadé
     if(req.multerError){
       throw {fileError:"Veuillez entrer un fichier valide"};
     }else{
       req.body.img = req.file.filename;
     }
   //gestion d'erreur si pas de fichier uploadé
   }else{
     throw {fileMessage: "Une photo de l'employé(e) est requise"}
   }
  //mise à jour du worker en bdd, avec vérification des règles de validation du modèle worker
  await workerModel.updateOne({ _id: req.params.id }, req.body, { runValidators: true });
   res.redirect("/main");
  // En cas d'erreur(s), rend à nouveau le formulaire de màj en y affichant les erreurs 
  }catch(error) { 
    console.log(error);
    res.render("updateWorkerForm.twig", {
      validateErrors:error.errors,
      errorFile:error.fileError,
      messageFile:error.fileMessage,
      workerToUpdate:workerToUpdate /*clé pour réafficher ds la vue les données du worker
                                    après un rafraîchissement de page suite à une erreur */
    })
  }
});



//----------------------------------ROUTE POUR BLAMER EMPLOYE----------------

workerRouter.get("/addBlame/:id",authGuard, async (req, res) => {
    try {
      const workerToBlame = await workerModel.findById(req.params.id);
      let blame= workerToBlame.blameNumber;
      blame++
      if (blame >= 3) {
        res.redirect("/deleteWorker/" + req.params.id)
      }else{
        await workerModel.updateOne({_id:req.params.id}, {blameNumber: blame})
        res.redirect("/main");
      }
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  });


  
//-------------------------------ROUTE POUR SUPPRIMER EMPLOYE-----------------

workerRouter.get("/deleteWorker/:id",authGuard, async (req, res) => {
  try {
    await workerModel.deleteOne({ _id: req.params.id });
    res.redirect("/main");
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});


module.exports = workerRouter;
