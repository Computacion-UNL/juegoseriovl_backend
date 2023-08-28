const { check,body } = require('express-validator');
const { validateFields } = require('../helpers/validate.helper');

const validateCreateUser = [
    body('CI')
    .notEmpty()
    .isLength({min:10, max:10})
    .withMessage('CI is required'),
  body('name')
    .notEmpty()
    .isLength({min:2})
    .withMessage('Name is required'),
  body('lastName')
    .notEmpty()
    .isLength({min:2})
    .withMessage('Last name is required'),
  body('address')
    .notEmpty()
    .isLength({min:2})
    .withMessage('Address is required'),
  body('phone')
    .notEmpty()
    .isLength({min:6, max:10 })
    .withMessage('Phone is required'),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address'),
  body('password')
    .notEmpty()
    .isLength({min:6})
    .withMessage('Password is required'),,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ];


  //No listo
const validateUpdateUser = [
    check('person', 'Person is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty().isLength({ min: 8, max: 16 }).exists(),
    check('role', 'Role is required').not().isEmpty(),
    (req, res, next) => {
        validateFields(req, res, next);
    }
];

module.exports = { validateCreateUser, validateUpdateUser };