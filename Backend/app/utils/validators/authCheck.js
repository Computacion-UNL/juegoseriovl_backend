const { verifyToken, decodeToken } = require("../helpers/handle.jwt");
const User = require("../../models/user.model");
const Student = require("../../models/student.model");

const checkAuth = (roles) => async (req, res, next) => {
  try {
    
    const token = req.headers.authorization.split(" ").pop(); //TODO:123123213
    const tokenData = verifyToken(token);
    console.log(
      "Token decodificado:",
      decodeToken(token).payload.role,
      "llega: ",
      roles
    );

    const decodedToken = decodeToken(token);

    const existsUser = await User.findById(decodedToken.payload.user);
    const existsStudent = await Student.findById(decodedToken.payload.user);

    req.currentUser = existsUser ? existsUser : existsStudent;
   

    if (tokenData && roles.includes(decodedToken.payload.role) && (existsUser || existsStudent )) {
      next();
    } else {
      res.status(403).send({
        error: "Acceso denegado. No tienes los permisos necesarios.",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(409);
    res.send({ error: "Acceso invalido !" });
  }
};

module.exports = checkAuth;
