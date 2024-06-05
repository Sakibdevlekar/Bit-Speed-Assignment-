const router = require("express").Router();
const { getData } = require("../controllers/identify.controller");
const { validateContactData } = require("../validators/contactData.validator");
const { dataValidationResult } = require("../validators/validationResult");

router.post("/",[validateContactData, dataValidationResult], getData);

module.exports = { identifyRoute: router };
