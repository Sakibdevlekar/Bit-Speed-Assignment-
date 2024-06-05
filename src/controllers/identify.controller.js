const Contact = require("../models/contact.model");
const { asyncHandler, sendResponse } = require("../utils/helper.utils");
const {Op} = require('sequelize')

exports.contactData = asyncHandler(async (req, res) => {
    const { email, phoneNumber } = req.body;

    let primaryContact = null;
    let secondaryContacts = [];

    // Find existing contacts
    const existingContacts = await Contact.findAll({
        where: {
            [Op.or]: [{ email }, { phoneNumber }],
        },
    });

    // Identify primary and secondary contacts
    existingContacts.forEach((contact) => {
        if (contact.linkPrecedence === "primary") {
            primaryContact = contact;
        } else {
            secondaryContacts.push(contact);
        }
    });

    // If no primary contact found, create a new one
    if (!primaryContact) {
        primaryContact = await Contact.create({
            email,
            phoneNumber,
            linkPrecedence: "primary",
        });
    } else {
        // Check if a new secondary contact needs to be created
        if (
            (email && primaryContact.email !== email) ||
            (phoneNumber && primaryContact.phoneNumber !== phoneNumber)
        ) {
            const newSecondary = await Contact.create({
                email,
                phoneNumber,
                linkedId: primaryContact.id,
                linkPrecedence: "secondary",
            });
            secondaryContacts.push(newSecondary);
        }
    }

    // Collect all emails and phone numbers
    const emails = [
        primaryContact.email,
        ...secondaryContacts.map((contact) => contact.email).filter(Boolean),
    ];
    const phoneNumbers = [
        primaryContact.phoneNumber,
        ...secondaryContacts
            .map((contact) => contact.phoneNumber)
            .filter(Boolean),
    ];

    // Send response
    sendResponse(res, 200, {
        primaryContactId: primaryContact.id,
        emails,
        phoneNumbers,
        secondaryContactIds: secondaryContacts.map((contact) => contact.id),
    });
});
