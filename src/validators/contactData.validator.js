const { body } = require("express-validator");

exports.validateContactData = [
    body("email").notEmpty().withMessage("This field is required. Thank you!"),
    body("email")
        .isEmail()
        .withMessage("Please enter a valid email address. Thank you!"),
    body("phoneNumber")
        .notEmpty()
        .withMessage("This field is required. Thank you!"),
    body("phoneNumber")
        .isMobilePhone("en-IN")
        .withMessage("Please enter a valid phone number. Thank you!"),
];
