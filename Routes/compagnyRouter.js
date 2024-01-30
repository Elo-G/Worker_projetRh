
const compagnyModel = require ("../models/compagnyModel");
const compagnyRouter = require ("express").Router();
//import du fichier crypto.js contenant les fonctions pour crypter et comparer les passwords:
const crypto = require('../services/crypto')



//-------------------------ROUTE FORMULAIRE D'ENREGISTREMENT-----------------------------


compagnyRouter.get ("/registerCompagny", async (req,res)=> {
    try {
      res.render ("formRegister.twig"); 
    } catch (error) {
       console.log(error);
       res.send (error) ;
    }
});
    


//--------------------ROUTE POUR POSTER LE FORMULAIRE D 'ENREGISTREMENT----------------------

compagnyRouter.post ("/registerCompagny", async (req, res)=>{
 try {
     //vérifie si le mail utilisé pour s'enregistrer n'existe pas déjà en bdd :
     let findedCompagny = await compagnyModel.findOne({mail:req.body.mail});
     if (findedCompagny){
         throw {errorMail:"Cette adresse existe déjà"};
        };

     //vérifie que le mdp est conforme à la regex:
     if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[\#?!@$%^&*\-\.]).{8,}$/g.test(req.body.password)) {
         throw {errorPassword:"Le mot de passe doit contenir au moins: 8 caractères, 1 majuscule, 1 minuscule, 1 caractère spécial et 1 chiffre"};
        };
    
     //vérifie que le mdp est correctement confirmé:
     if(req.body.password != req.body.confirmPassword){
         throw {errorConfirmPassword :"Les mots de passe doivent être identiques"};
        };

     //sécurise mon mot de passe en le hashant avec ma fonction crytpPassword créée ds fichier crypto.js:
     req.body.password= await crypto.cryptPassword(req.body.password);

     //crée une instance d'userCompagny (à partir des données saisies ds req.body):
     let newCompagny= new compagnyModel(req.body);
    
     //vérifie les règles de validation du compagnyModel, et si erreur=> génère l'erreur:
     let validateError = newCompagny.validateSync()
     if(validateError){
        throw validateError;
     };

     //sauvegarde de newCompagny en bdd puis redirection vers login:
     await newCompagny.save();
     res.redirect ('/login');

     // En cas d'erreur(s), rend à nouveau le formulaire en y affichant les erreurs 
    } catch (error) {
     console.log(error);
     res.render("formRegister.twig",{
         mailError:error.errorMail,
         passwordError:error.errorPassword,
         confirmPasswordError:error.errorConfirmPassword,
         validateErrors:error.errors 
      });
    }
});


 //-------------------------ROUTES FORMULAIRE LOGIN---------------------------------

compagnyRouter.get("/login",async(req,res)=>{
    try{
        res.render ("login.twig"); 
    }
    catch(error){
        console.log(error);
        res.send(error);
    };    
});


//---------------------------ROUTE POUR SE LOGUER :----------------------------------

compagnyRouter.post("/login",async(req,res)=>{
    try{
     //vérifie que la compagny est bien enregistrée en bdd:
     const compagny = await compagnyModel.findOne({ mail: req.body.mail});
     if (compagny){
         //si le mdp saisi correspond à celui en bdd:
         if (await crypto.comparePassword(req.body.password, compagny.password)){
             //garde en session l'entreprise dont l'attribut compagnyId = _id enregistré en bdd:
             req.session.compagnyId = compagny._id ;
             //redirige vers la route main
             res.redirect('/main');
          //sinon rend la page login , en y affichant l'erreur:   
          }else{
             res.render('login.twig',{ 
                 errorPassword: "le mot de passe est incorrect !" 
                });
            };
     // si pas de compagny, rend la page login ,en y affichant l'erreur:       
     }else{ 
           res.render('login.twig',{    
             errorConnect: "l'utilisateur n'existe pas !"
            }) ;  
        };  
    }catch(error){
        console.log(error);
        res.send(error);
    };
});



//--------------------------------ROUTE POUR SE DECONNECTER:--------------------------------
compagnyRouter.get("/logout", async (req, res) => {
    try{
       req.session.destroy()
       res.redirect("/")
    }catch{
        console.log(error);
        res.send(error);
    };
});
  



module.exports= compagnyRouter;