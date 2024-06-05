require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const app = express();
const { identifyRoute } = require("./routes/identify.routes");
const { errorHandler } = require("./middlewares/errorHandler.middleware");
const morganMiddleware = require("./loggers/morgan.logger");
const { apiRateLimiter } = require("./utils/apiRateLimiter");
app.use(bodyParser.json());
app.use(helmet())
app.use(
    cors({
        origin: ["*", String(process.env.CLIENT_URL)], // Add Frontend url
        credentials: true,
    }),
);
/* Api Logger*/
app.use(morganMiddleware);

/*Api rate limiter*/
app.use(apiRateLimiter);

app.use("/identify", identifyRoute);

// /*Error handler*/
app.use(errorHandler);

module.exports = { app };
