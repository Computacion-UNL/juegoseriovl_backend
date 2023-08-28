const {validationResult} = require('express-validator');

const validateFields = (req, res, next) => {
    try{
        validationResult(req).throw();
         return next();
    }catch(err){
        res.status(400).json({
            ok: false,
            errors: err.mapped()
        });
    }
}

module.exports = { validateFields };