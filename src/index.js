require("dotenv").config();
const { app } = require("./app");
const sequelize = require("./config/database.config");
const PORT = process.env.PORT || 3000;



app.listen(PORT, async () => {
    console.log(`1. Server live @PORT: ${PORT}  ...✅ 
----------------------------------------------------------------`);
    await sequelize.sync()
    //connecting to sql
    await sequelize
        .authenticate()
        .then((result) => {
            console.log(`2. Server connected to SQL db...✅
----------------------------------------------------------------`);
        })
        .catch((err) => {
            console.log(`❌ ERROR while connecting SQL db:${err}
----------------------------------------------------------------`);
        });
});
