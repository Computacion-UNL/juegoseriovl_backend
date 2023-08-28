const bcryptjs = require('bcryptjs');//dotenv permite cargar variables de entorno
require('dotenv').config();

const encrypt = async (password) => {
    const hash = await bcryptjs.hash(password, 10);
    return hash;
}

const compare = async (password, hash) => {
    const result = await bcryptjs.compare(password, hash);
    return result;
}

const decrypt = async (password) =>{
    const hash = await bcryptjs.hash(password, 10);
    return hash;
} 

module.exports = { encrypt, compare , decrypt};