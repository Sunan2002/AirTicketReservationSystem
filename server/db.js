const mysql = require('mysql2');

let connection = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    database: "airticket_system",
    password: null,
    port: 3306,
});

connection.getConnection(function(err) {
    if (err) {
        console.error("Connection err: " + err.stack);
        return;
    }
    console.log("Connected: " + connection.threadId);
})

module.exports = conection;
