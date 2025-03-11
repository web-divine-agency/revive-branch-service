import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { app } from "./Server.js";

import { authAdmin, authenticated } from "./middleware/auth.js";

import Controller from "./controllers/Controller.js";
import BranchController from "./controllers/BranchController.js";

if (process.env.APP_ENV === "dev") {
  app.use(cors());
}

app.use(bodyParser.json());

const portal = express.Router();
const admin = express.Router();

/**
 * Portal routes
 */
app.use("/portal", portal);
portal.use(authenticated);

/**
 * Admin routes
 */
app.use("/admin", admin);
admin.use(authAdmin);
admin.get("/branches", BranchController.list);
admin.post("/branches", BranchController.create);

admin.get("/fn/branches-all", BranchController.all);

/**
 * Base routes
 */
app.get("/", Controller.base);
