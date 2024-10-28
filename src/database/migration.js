import mysql from "mysql";

var mysqlClient = mysql.createConnection({
  host: "localhost",
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

var exec = process.env.npm_config_exec;

var enums = {
  create_classes_table: 0,
  add_on_going_col: 1,
};

var statements = [
  // create users table
  `CREATE TABLE users (${[
    "id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY",
    "type VARCHAR(255) NOT NULL",
    "first_name VARCHAR(255) NOT NULL",
    "middle_name VARCHAR(255) NULL",
    "last_name VARCHAR(255) NOT NULL",
    "email VARCHAR(255) NOT NULL UNIQUE",
    "mobile VARCHAR(255) NULL",
    "password VARCHAR(255) NOT NULL",
    "verified_at TIMESTAMP NULL",
    "verified_at_order DOUBLE NULL",
    "created_at TIMESTAMP NULL",
    "created_at_order DOUBLE NULL",
    "updated_at TIMESTAMP NULL",
    "updated_at_order DOUBLE NULL",
    "deleted_at TIMESTAMP NULL",
    "deleted_at_order DOUBLE NULL",
  ]})`,
];

if (exec) {
  mysqlClient.query(statements[enums[exec]], function (err) {
    if (err) throw err;
    console.log("Success");
  });
} else {
  statements.forEach((statement) => {
    mysqlClient.query(statement, function (err) {
      if (err) throw err;
      console.log("Success");
    });
  });
}

