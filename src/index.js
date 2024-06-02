import moment from "moment-timezone";

import "dotenv/config";
import "./Server.js";
import "./AppRouter.js";

import logger from "./util/logger.js";

moment.tz.setDefault("Asia/Singapore");

// Run logs sweeper
logger.sweeper();
