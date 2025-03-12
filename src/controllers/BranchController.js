import Logger from "../util/logger.js";
import Validator from "../util/validator.js";

import DatabaseService from "../services/DatabaseService.js";

export default {
  /**
   * List branches without pagination
   * @param {*} req
   * @param {*} res
   */
  all: (req, res) => {
    MysqlService.select(`SELECT * FROM branches WHERE deleted_at IS NULL`)
      .then((response) => {
        let message = Logger.message(req, res, 200, "branches", response);
        Logger.out([JSON.stringify(message)]);
        return res.json(message);
      })
      .catch((error) => {
        let message = Logger.message(req, res, 500, "error", error);
        Logger.error([JSON.stringify(message)]);
        return res.json(message);
      });
  },

  /**
   * List branches
   * @param {*} req
   * @param {*} res
   * @returns
   */
  list: (req, res) => {
    let validation = Validator.check([
      Validator.required(req.query, "direction"),
      Validator.required(req.query, "last"),
      Validator.required(req.query, "show"),
    ]);

    if (!validation.pass) {
      let message = Logger.message(req, res, 422, "error", validation.result);
      Logger.error([JSON.stringify(message)]);
      return res.json(message);
    }

    const { last, show } = req.query;
    let name = req.query.name || "";
    let find = req.query.find || "";
    let direction = req.query.direction === "next" ? "<" : ">";

    let query = `
      SELECT
        *
      FROM branches
      WHERE deleted_at IS NULL
      AND name LIKE "%${name}%" 
      AND 
        (
          name LIKE "%${find}%" OR
          opening LIKE "%${find}%" OR
          closing LIKE "%${find}%" OR
          address_line_1 LIKE "%${find}%" OR
          address_line_2 LIKE "%${find}%" OR
          city LIKE "%${find}%" OR
          state LIKE "%${find}%"
        )
      AND created_at_order ${direction} ${last}
      ORDER BY created_at_order DESC
      LIMIT ${show}
    `;

    MysqlService.select(query)
      .then((response) => {
        let message = Logger.message(req, res, 200, "branches", response);
        Logger.out([JSON.stringify(message)]);
        return res.json(message);
      })
      .catch((error) => {
        let message = Logger.message(req, res, 500, "error", error);
        Logger.error([JSON.stringify(message)]);
        return res.json(message);
      });
  },

  /**
   * Create branch
   * @param {*} req
   * @param {*} res
   * @returns
   */
  create: (req, res) => {
    let message, validation;

    validation = Validator.check([
      Validator.required(req.body, "name"),
      Validator.required(req.body, "zip_code"),
      Validator.required(req.body, "city"),
      Validator.required(req.body, "state"),
      Validator.required(req.body, "opening"),
      Validator.required(req.body, "closing"),
    ]);

    if (!validation.pass) {
      message = Logger.message(req, res, 422, "error", validation.result);
      Logger.error([JSON.stringify(message)]);
      return res.json(message);
    }

    DatabaseService.create({ table: "branches", data: req.body })
      .then((response) => {
        let message = Logger.message(req, res, 200, "branch", response.data.result.insertId);
        Logger.out([JSON.stringify(message)]);
        return res.json(message);
      })
      .catch((error) => {
        let message = Logger.message(req, res, 500, "error", error);
        Logger.error([JSON.stringify(message)]);
        return res.json(message);
      });
  },
};
