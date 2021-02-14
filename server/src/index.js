import express from "express";
import http from "http";
import https from "https";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import config from "./config.js";
import setRoutes from "./routes.js"
import { startSession } from "./utils/session.js";

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
setRoutes(app);

startSession("https://www.instagram.com/accounts/login/");

const protocol = config.protocol === 'http' ? http : https;
const server = protocol.createServer(app);

const init = async () => {
    server.listen(config.port, () => {console.log(`Instagram-clone is online at port ${config.port}`);});

    // const page = await startSession("https://www.instagram.com/accounts/login/");
    // process.exit(1);
};

init();