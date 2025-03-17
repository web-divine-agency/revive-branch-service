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
    let message;

    DatabaseService.select({ query: `SELECT * FROM branches WHERE deleted_at IS NULL` })
      .then((response) => {
        message = Logger.message(req, res, 200, "branches", response.data.result);
        Logger.out([JSON.stringify(message)]);
        return res.json(message);
      })
      .catch((error) => {
        message = Logger.message(req, res, 500, "error", error);
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
    let message, validation, name, find, direction, query;

    validation = Validator.check([
      Validator.required(req.query, "direction"),
      Validator.required(req.query, "last"),
      Validator.required(req.query, "show"),
    ]);

    if (!validation.pass) {
      message = Logger.message(req, res, 422, "error", validation.result);
      Logger.error([JSON.stringify(message)]);
      return res.json(message);
    }

    const { last, show } = req.query;

    name = req.query.name || "";
    find = req.query.find || "";
    direction = req.query.direction === "next" ? "<" : ">";

    query = `
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

    DatabaseService.select({ query })
      .then((response) => {
        let message = Logger.message(req, res, 200, "branches", response.data.result);
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

  /**
   * Read branch
   * @param {*} req
   * @param {*} res
   * @returns
   */
  read: (req, res) => {
    let message, validation, query;

    validation = Validator.check([Validator.required(req.params, "branch_id")]);

    if (!validation.pass) {
      message = Logger.message(req, res, 422, "error", validation.result);
      Logger.error([JSON.stringify(message)]);
      return res.json(message);
    }

    const { branch_id } = req.params;

    query = `
      SELECT
        *
      FROM branches
      WHERE deleted_at IS NULL
      AND id = ${branch_id} 
    `;

    DatabaseService.select({ query })
      .then((response) => {
        let message = Logger.message(req, res, 200, "branch", response.data.result[0]);
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
   * Update branch
   * @param {*} req
   * @param {*} res
   * @returns
   */
  update: (req, res) => {
    let message, validation;

    validation = Validator.check([
      Validator.required(req.params, "branch_id"),
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

    const { branch_id } = req.params;

    DatabaseService.update({ table: "branches", data: req.body, params: { id: branch_id } })
      .then(() => {
        message = Logger.message(req, res, 200, "updated", true);
        Logger.error([JSON.stringify(message)]);
        return res.json(message);
      })
      .catch((error) => {
        message = Logger.message(req, res, 500, "error", error.stack);
        Logger.error([JSON.stringify(message)]);
        return res.json(message);
      });
  },

  delete: (req, res) => {
    let message, validation;

    validation = Validator.check([Validator.required(req.params, "branch_id")]);

    if (!validation.pass) {
      message = Logger.message(req, res, 422, "error", validation.result);
      Logger.error([JSON.stringify(message)]);
      return res.json(message);
    }

    const { branch_id } = req.params;

    DatabaseService.delete({
      table: "branches",
      params: {
        id: branch_id,
      },
    })
      .then(() => {
        message = Logger.message(req, res, 200, "deleted", true);
        Logger.out([JSON.stringify(message)]);
        return res.json(message);
      })
      .catch((error) => {
        message = Logger.message(req, res, 500, "error", error.stack);
        Logger.error([JSON.stringify(message)]);
        return res.json(message);
      });
  },
};
