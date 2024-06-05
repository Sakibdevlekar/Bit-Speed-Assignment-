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
const swaggerUi = require("swagger-ui-express");
const { fileURLToPath } = require("url");
const YAML = require("yaml");
const fs = require("fs");
const path = require("path");
app.use(helmet());
app.use(
    cors({
        origin: ["*", String(process.env.CLIENT_URL)], // Add Frontend url
        credentials: true,
    }),
);

//Swagger Documentation setup
const filePath = path.resolve(__dirname, "./swagger.yaml");
const fileContent = fs.readFileSync(filePath, "utf8");

const hostUrl = process.env.HOST_URL || "http://localhost:3000";
const replacedContent = fileContent?.replace(
    "- url: ${{server}}",
    `- url: ${hostUrl}`,
);

const swaggerDocument = YAML.parse(replacedContent);

/* Api Logger*/
app.use(morganMiddleware);

/*Api rate limiter*/
app.use(apiRateLimiter);

app.use("/identify", identifyRoute);

// * API DOCS
app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
        swaggerOptions: {
            docExpansion: "none", // keep all the sections collapsed by default
        },
        customSiteTitle: " BitSpeed API Docs",
    }),
);

// /*Error handler*/
app.use(errorHandler);

module.exports = { app };
