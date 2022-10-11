import React, { Fragment, useState } from "react";
import axios from "axios";

// Must have the semicolon, don't know why
const IPCSData = () => {
  const [description, setDescription] = useState("");

  // Set up the time string for query data
  let dayAgo_t = Date.now() - 86400000 + 28800000; 
  let today_t = Date.now() + 28800000;
  const [dayAgo] = new Date(dayAgo_t).toISOString().split('T'); // split iso date string with delimiter 'T'
  const [today] = new Date(today_t).toISOString().split('T');
  const [startDate, setStartDate] = useState(dayAgo);
  const [endDate, setEndDate] = useState(today);

  const query = async (e) => {
    e.preventDefault();
    try {
      // await axios.get(`http://scplus.df.r.appspot.com/v1/getData/dateRange?serial_id=device_COOKAS&startDate=${startDate}&endDate=${endDate}`).then(response => {
      //   console.log(response.data);
      // });
      const body = { description };
      const response = await fetch('http://localhost:5000/ipcs')
        .then(res => res.json())
        .then(res => console.log(res));
      
      console.log(JSON.stringify(response));
      // window.location = "/";  // Refresh the window when the component is rendered
    } catch (err) {
      // console.log(err.message);
    }
  };

  return (
    <Fragment> 
      <h1 className="text-center mt-5">Query for IPCS API data</h1>
      <form className="d-flex" onSubmit={ query }>
        <input 
          type="text" 
          className="form-control" 
          value={ startDate } 
          onChange={ e => setStartDate(e.target.value) }
        />
        <input 
          type="text" 
          className="form-control" 
          value={ endDate } 
          onChange={ e => setEndDate(e.target.value) }
        />
        <button className="btn btn-success">Send Request</button>
      </form>
      <table className="table mt-5 text-center">
        <thead>
          <tr>
            <th>device_id</th>
            <th>hum</th>
            <th>kpa</th>
            <th>rad</th>
            <th>rain</th>
            <th>temp</th>
            <th>timestamp</th>
            <th>wd</th>
            <th>ws</th>
          </tr>
        </thead>
        {/* <tbody>
          {result.map(des => (
            <tr>
              <td>{des.dayAgo_t.device_id}</td>
            </tr>
          ))}
        </tbody> */}
      </table>
    </Fragment>
  )
};

export default IPCSData;