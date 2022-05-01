import React from "react";
import axios from "axios";
import { useEffect, useState } from "react"; 
import { Formik, Form, Field, ErrorMessage } from "formik";
import '../styles/App.css';


function StaffHome() {
  const [listOfFlights, setListOfFlights] = useState([]);
  const [customerList, setCustomerList] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3001/staff/viewAirlineFlights`,
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      }
    ).then((response) => {
      if (response.data.error) {
        console.log(response.data.error);
      } else {
        setListOfFlights(response.data);
      }
    });
  }, []);

  const viewCustomers = (flight_num, dep_date, dep_time) => {
    const data = {flight_number: flight_num, departure_date: dep_date, departure_time: dep_time};
    axios.post("http://localhost:3001/staff/viewFlightCustomers", data, 
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      }
    ).then((response)=> {
      if (response.data.error) {
        console.log(response.data.error);
      } else {
        setCustomerList(response.data);
        const div = document.getElementsByClassName("customersOnFlight")[0];

        console.log(div)
        div.classList.remove("hidden");
      }
    })
  }

  const onSubmit = (data) => {
    console.log('data\n',data)
    axios.post("http://localhost:3001/staff/createFlight", data, 
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        }
      }
    ).then((response)=> {
      console.log("Data will be inserted into flight table");
      window.location.reload(false);
    })
  }

  const initialValues = {
    airline_name: null,
    flight_number: null,
    departure_date: null,
    departure_time: null,
    departure_airport_code: null,
    arrival_date: null,
    arrival_time: null,
    arrival_airport_code: null,
    airplane_id: null,
    base_price: null,
    status: null
  }

  let flight_num, dep_date, dep_time, new_status;

  const statusUpdateSubmit = (event) => {
    event.preventDefault();
    const data = {flight_num, dep_date, dep_time, new_status};
    axios.post("http://localhost:3001/staff/changeFlightStatus", data, 
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        }
      }
    ).then((response)=> {
      console.log("Data will be updated in flight table");
      window.location.reload(false);  
    });
  }

  return (
    <section className="staffHome">
      <div className="staffViewFlights">
        <h3>View Flights</h3>
        <table class="table">
          <thead>
            <th>Airline Name</th>
            <th>Flight Num</th>
            <th>Departure Date</th>
            <th>Departure Time</th>
            <th>Departure Airport Code</th>
            <th>Arrival Date</th>
            <th>Arrival Time</th>
            <th>Arrival Airport Code</th>
            <th>Airplane ID</th>
            <th>Base Price</th>
            <th>Status</th>
            <th>View Customers</th>
          </thead>
          <tbody>
          {listOfFlights.map((value,key) => {
            return ( 
              <tr> 
                <td> {value.airline_name} </td> 
                <td> {value.flight_number} </td> 
                <td> {value.departure_date.substr(0,10)} </td> 
                <td> {value.departure_time} </td>
                <td> {value.departure_airport_code} </td>
                <td> {value.arrival_date.substr(0,10)} </td> 
                <td> {value.arrival_time} </td>
                <td> {value.arrival_airport_code} </td>
                <td> {value.airplane_id} </td>
                <td> {value.base_price} </td>
                <td> {value.status} </td>
                <td><button onClick={
                  ()=>viewCustomers(value.flight_number, value.departure_date.substr(0,10), value.departure_time)}>View Customers
                </button></td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div> 
      <div class="customersOnFlight hidden">
        <h4>Customers on flight</h4>
        {customerList.map(value=> {
          return (
            <div>{value.email_address}</div>
          )
        })}
      </div>
      <div id="createFlightContainer">
        <h3>Create New Flight</h3>
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          <Form className="createFlight">
            <label>Flight Number:</label>
            <Field 
                autocomplete="off"
                id="inputCreateFlight" 
                name="flight_number" 
            />
            <label>Departure Date:</label>
            <Field 
                autocomplete="off"
                id="inputCreateFlight" 
                name="departure_date" 
            />
            <label>Departure Time:</label>
            <Field 
                autocomplete="off"
                id="inputCreateFlight" 
                name="departure_time" 
            />
            <label>Departure Airport Code:</label>
            <Field 
                autocomplete="off"
                id="inputCreateFlight" 
                name="departure_airport_code" 
            />
            <label>Arrival Date:</label>
            <Field 
                autocomplete="off"
                id="inputCreateFlight" 
                name="arrival_date" 
            />
            <label>Arrival Time:</label>
            <Field 
                autocomplete="off"
                id="inputCreateFlight" 
                name="arrival_time" 
            />
            <label>Arrival Airport Code:</label>
            <Field 
                autocomplete="off"
                id="inputCreateFlight" 
                name="arrival_airport_code" 
            />
            <label>Airplane ID:</label>
            <Field 
                autocomplete="off"
                id="inputCreateFlight" 
                name="airplane_id" 
            />
            <label>Base Price:</label>
            <Field 
                autocomplete="off"
                id="inputCreateFlight" 
                name="base_price" 
            />
            <label>Status:</label>
            <Field 
                autocomplete="off"
                id="inputCreateFlight" 
                name="status" 
            />
            <button type="submit">Submit</button>
          </Form>
        </Formik>
      </div>
      <div className="changeStatusContainer">
        <h3>Change Flight Status</h3>
        <form onSubmit={statusUpdateSubmit}>
          <label>Flight Number: </label>
          <input type="text" onChange={(e)=>flight_num=e.target.value}/>
          <label>Departure Date: </label>
          <input type="text" onChange={(e)=>dep_date=e.target.value} />
          <label>Departure Time: </label>
          <input type="text" onChange={(e)=>dep_time=e.target.value} />
          <label>New Status: </label>
          <input type="text" onChange={(e)=>new_status=e.target.value} />
          <input type="submit"></input>
        </form>
      </div>
      
    </section>
  )
}

export default StaffHome;