const express = require("express");
const router = express.Router();
const { upload } = require("../utils/helpers/multer.helper");
const testImagesController = require("../controllers/testImages.controller");
const checkAuth = require("../utils/validators/authCheck")


router.post("/",          checkAuth(['ADMIN','DECE']),  upload.single("singleFile"), testImagesController.create);
router.get("/",           checkAuth(['STUDENT','ADMIN','DECE']),   testImagesController.findAll);
router.get("/paginated",  checkAuth(['ADMIN','DECE']),   testImagesController.findAllPaginated);
router.get("/:id",        checkAuth(['ADMIN','DECE']),  testImagesController.findOne);
router.put("/:id",        checkAuth(['ADMIN','DECE']),  upload.single("singleFile"), testImagesController.update);
router.delete("/:id",     checkAuth(['ADMIN','DECE']),  testImagesController.delete);

module.exports = router;
