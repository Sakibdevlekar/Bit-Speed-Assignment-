const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.config");

const Contact = sequelize.define(
    "Contact",
    {
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        linkedId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        linkPrecedence: {
            type: DataTypes.ENUM("primary", "secondary"),
            allowNull: false,
        },
    },
    {
        timestamps: true,
        paranoid: true, //  deletedAt column for soft deletes
    },
);

module.exports = Contact;
