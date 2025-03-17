import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { app } from "./Server.js";

import { authAdmin, authenticated } from "./middleware/auth.js";

import Controller from "./controllers/Controller.js";
import BranchController from "./controllers/BranchController.js";

app.use(cors());

app.use(bodyParser.json());

const portal = express.Router();
const admin = express.Router();

/**
 * Portal routes
 */
app.use("/portal", portal);
portal.use(authenticated);

portal.get("/branches/all", BranchController.all);

portal.get("/branches", BranchController.list);
portal.get("/branches/:branch_id", BranchController.read);

/**
 * Admin routes
 */
app.use("/admin", admin);
admin.use(authAdmin);
admin.post("/branches", BranchController.create);
admin.put("/branches/:branch_id", BranchController.update);

/**
 * Base routes
 */
app.get("/", Controller.base);
