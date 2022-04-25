const sql = require('../db');

const Ticket = function createTicket(ticket) {
    this.ticket_id = ticket.ticket_id;
    this.airline_name = ticket.airline_name;
    this.flight_number = ticket.flight_number;
    this.departure_date = ticket.departure_date;
    this.departure_time = ticket.departure_time;
    this.travel_class = ticket.travel_class;
    this.sold_price = ticket.sold_price;
    this.card_type = ticket.card_type;
    this.card_number = ticket.card_number;
    this.card_expiration = ticket.card_expiration;
    this.name_on_card = ticket.name_on_card;
    this.purchase_date = ticket.purchase_date;
    this.purchase_time = ticket.purchase_time;
    this.email_address = ticket.email_address;
};

//make ticket_id auto increment
Ticket.purchaseTicket = (ticket, result) => {
    sql.query('INSERT INTO Ticket VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
    [ticket.ticket_id, ticket.airline_name, ticket.flight_number, ticket.departure_date,
    ticket.departure_time, ticket.travel_class, ticket.sold_price, ticket.card_type,
    ticket.card_number, ticket.card_expiration, ticket.name_on_card, ticket.purchase_date,
    ticket.purchase_time, ticket.email_address], (err,res) => {
        if (err) {
            console.log("Error: ", err);
            result(null,err);
            return;
        }
        console.log("New Purchase: " + res);
        result(null,res);
    });
};

Ticket.searchFutureFlights = (email_address, result) => {
    sql.query('SELECT * FROM Flight WHERE flight_number IN (SELECT flight_number FROM Ticket WHERE email_address = ? AND ((departure_date > (SELECT CURDATE())) OR (departure_date = (SELECT CURDATE()) and departure_time > (SELECT NOW()))))',
    [email_address], (err,res) => {
        if (err) {
            console.log("Error: ", err);
            result(null,err);
            return;
        }
        console.log("Customer Flights: " + res);
        result(null,res);
    });
};

Ticket.searchCustomerFlights = (email_address, source_city, dest_city, dateA, dateB, result) => {
    sql.query('SELECT * FROM Flight WHERE flight_number IN (SELECT flight_number FROM Ticket WHERE email_address = ?) AND departure_airport_code = ? AND arrival_airport_code = ? AND (departure_date BETWEEN ? AND ?)', 
    [email_address, source_city, dest_city, dateA, dateB], (err,res) => {
        if (err) {
            console.log("Error: This is where the error is!", err);
            result(null,err);
            return;
        }
        console.log("Searched Customer Flights: " + res);
        result(null,res);
    });
};

Ticket.searchPreviousFlights = (email_address, result) => {
    sql.query('SELECT * FROM Flight WHERE flight_number IN (SELECT flight_number FROM Ticket WHERE email_address = ? AND ((departure_date < (SELECT CURDATE())) OR (departure_date = (SELECT CURDATE()) and arrival_time < (SELECT NOW()))))',
    [email_address], (err,res) => {
        if (err) {
            console.log("Error: ", err);
            result(null,err);
            return;
        }
        console.log("Previous Customer Flights: " + res);
        result(null,res);
    });
};

Ticket.cancelTicket = (ticket_id, result) => {
    sql.query('DELETE FROM Ticket WHERE ticket_id = ?', [ticket_id], (err,res) =>{
        if (err) {
            console.log("Error: ", err);
            result(null,err);
            return;
        }
        console.log("Canceled Ticket: " + res);
        result(null,res);
    });
};

Ticket.addReview = (email_address, ticket_id, rating, comment, result) => {
    sql.query('INSERT INTO Reviews VALUES (?, ?, ?, ?)', [email_address, ticket_id,
    rating, comment], (err,res) => {
        if (err) {
            console.log("Error: ", err);
            result(null,err);
            return;
        }
        console.log("New Review: " + res);
        result(null,res);
    });
};

//check this query in phpMyAdmin
Ticket.pastYearSpent = (email_address, result) => {
    sql.query('SELECT SUM(sold_price) FROM Ticket WHERE email_address = ? AND purchase_date  BETWEEN DATE_ADD(CURRENT_DATE(), INTERVAL -1 YEAR) AND CURRENT_DATE()', 
    [email_address], (err,res) => {
        if (err) {
            console.log("Error: ", err);
            result(null,err);
            return;
        }
        console.log("Total Spent Past Year: " + res);
        result(null,res);
    });
};

Ticket.lastSixMonthsSpent = (email_address, result) => {
    sql.query('SELECT SUM(sold_price) FROM Ticket WHERE email_address = ? AND purchase_date BETWEEN DATE_ADD(CURRENT_DATE(), INTERVAL -6 MONTH) AND CURRENT_DATE()', 
    [email_address], (err,res) => {
        if (err) {
            console.log("Error: ", err);
            result(null,err);
            return;
        }
        console.log("Total Spent Past 6 Months: " + res);
        result(null,res);
    });
};

Ticket.rangeSpent = (email_address, dateA, dateB,result) => {
    sql.query('SELECT SUM(sold_price) FROM Ticket WHERE email_address = ? AND purchase_date BETWEEN ? AND ?', 
    [email_address, dateA, dateB], (err,res) => {
        if (err) {
            console.log("Error: ", err);
            result(null,err);
            return;
        }
        console.log("Total Spent In Range: " + res);
        result(null,res);
    });
};

Ticket.viewFlightRatings = (airline_name, result) => {
    sql.query('SELECT flight_number, AVG(rating), email_address, rating, comment FROM Ticket NATURAL JOIN Reviews WHERE airline_name = ? GROUP BY flight_number', [airline_name], (err,res) => {
        if (err) {
            console.log("Error: ", err);
            result(null,err);
            return;
        }
        console.log("Flight Ratings: " + res);
        result(null,res);
    });
};

Ticket.pastYearSold = (airline_name, result) => {
    sql.query('SELECT SUM(sold_price) FROM Ticket WHERE airline_name = ? AND purchase_date BETWEEN DATE_ADD(CURRENT_DATE(), INTERVAL -1 YEAR) AND CURRENT_DATE()', 
    [airline_name], (err,res) => {
        if (err) {
            console.log("Error: ", err);
            result(null,err);
            return;
        }
        console.log("Total Sold Past Year: " + res);
        result(null,res);
    });
};

Ticket.lastSixMonthsSold = (airline_name, result) => {
    sql.query('SELECT SUM(sold_price) FROM Ticket WHERE airline_name = ? AND purchase_date BETWEEN DATE_ADD(CURRENT_DATE(), INTERVAL -6 MONTH) AND CURRENT_DATE()', 
    [airline_name], (err,res) => {
        if (err) {
            console.log("Error: ", err);
            result(null,err);
            return;
        }
        console.log("Total Sold Past 6 Months: " + res);
        result(null,res);
    });
};

Ticket.rangeSold = (airline_name, dateA, dateB,result) => {
    sql.query('SELECT SUM(sold_price) FROM Ticket WHERE airline_name = ? AND purchase_date BETWEEN ? AND ?', 
    [airline_name, dateA, dateB], (err,res) => {
        if (err) {
            console.log("Error: ", err);
            result(null,err);
            return;
        }
        console.log("Total Sold In Range: " + res);
        result(null,res);
    });
};

Ticket.pastYearSoldTravelClass = (airline_name, result) => {
    sql.query('SELECT travel_class, SUM(sold_price) FROM Ticket WHERE airline_name = ? AND purchase_date BETWEEN DATE_ADD(CURRENT_DATE(), INTERVAL -1 YEAR) AND CURRENT_DATE() GROUP BY travel_class', 
    [airline_name], (err,res) => {
        if (err) {
            console.log("Error: ", err);
            result(null,err);
            return;
        }
        console.log("Total Sold Travel Class Past Year: " + res);
        result(null,res);
    });
};

module.exports = { Ticket }

//Still have to do 7,11




