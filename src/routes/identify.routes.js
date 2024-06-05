const router = require("express").Router();
const { contactData } = require("../controllers/identify.controller");
const { validateContactData } = require("../validators/contactData.validator");
const { dataValidationResult } = require("../validators/validationResult");

router.post("/", [validateContactData, dataValidationResult], contactData);

module.exports = { identifyRoute: router };
