let bcrypt = require('bcrypt');

let saltRounds = 5

 async function cryptPassword(password){
    let salt = await bcrypt.genSalt(saltRounds)
    return await bcrypt.hash(password ,salt)
}

async function comparePassword (plainPass, hashedPass){
let compare = await  bcrypt.compare(plainPass, hashedPass);
return compare;
}


//j'exporte les fonctions crées pour pouvoir les appeler dans mes fichiers routes 
module.exports = {
    cryptPassword,
    comparePassword
}