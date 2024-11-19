import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css"; // Import custom CSS
import { useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css"; // Import custom CSS

function Link() {
  const history = useHistory();
  const [surveyID, setSurveyID] = useState("");
  const [PID, setPID] = useState("");
  const [IP, setIP] = useState({});
  const [error, setError] = useState("");
  const [Link, setLink] = useState("");

  useEffect(() => {
    async function getIPAddress() {
      try {
        try {
          const response = await axios.get('https://geolocation-db.com/json/');
          setIP(response?.data);
        } catch (error) {
          console.error('Error:', error.response?.data || error.message);
        }
      } catch (err) {
        setError("Error fetching IP details");
      }
    }
    getIPAddress();
  }, []);

  useEffect(() => {
    async function getPID() {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      // Generate a string of 18 random characters
      for (let i = 0; i < 18; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
      }
      // Add a hyphen after every 6 characters
      const formattedResult = result.replace(/(.{6})(?=.)/g, "$1-");
      setPID(formattedResult);
    }
    getPID();
  }, []);

  const _generateLink = async () => {
    let obj = {
      survey_id: surveyID,
      IpAddress: IP?.IPv4,
      TransactionId: PID,
    };
    const response = await axios.get(`https://zamplia-api.onrender.com/api/link`, {
      params: obj,
    });
    setLink(response?.data?.result?.data[0]?.LiveLink);
  };

  return (
    <div className="login-container">
      <div className="card login-card">
        <div className="card-body">
          <form>
            <div className="form-group">
              <input
                type="number"
                className="form-control"
                id="surveyID"
                placeholder="Survey ID"
                value={surveyID}
                onChange={(e) => setSurveyID(e.target.value)}
              />
            </div>
            <div className="form-group mt-3">
              <input
                type="text"
                className="form-control"
                id="PID"
                placeholder="PID"
                value={PID}
                disabled={true}
              />
            </div>

            {/* IP Details Section */}
            <div className="ip-details mt-4">
              <h5 className="text-center">IP Details</h5>
              <div className="text-center mt-3">
                <a style={{ color: "red", textDecoration: "none" }}>{error}</a>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      className="form-control"
                      value={IP?.country_name || "Loading..."}
                      disabled={true}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      className="form-control"
                      value={IP?.city || "Loading..."}
                      disabled={true}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      className="form-control"
                      value={IP?.state || "Loading..."}
                      disabled={true}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Postal Code</label>
                    <input
                      type="text"
                      className="form-control"
                      value={IP?.postal || "Loading..."}
                      disabled={true}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Latitude</label>
                    <input
                      type="text"
                      className="form-control"
                      value={IP?.latitude || "Loading..."}
                      disabled={true}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Longitude</label>
                    <input
                      type="text"
                      className="form-control"
                      value={IP?.longitude || "Loading..."}
                      disabled={true}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group mt-3">
              <input
                type="text"
                className="form-control"
                id="number"
                placeholder="IP Address"
                value={IP?.IPv4}
                disabled={true}
                prefix="IP Address: "
              />
            </div>

            <button
              type="button"
              className="btn btn-primary mt-4 w-100"
              style={{ backgroundColor: "#9D00FF", borderColor: "#9D00FF" }}
              onClick={() => _generateLink()}
            >
              Generate URL
            </button>
            <button
              type="button"
              className="btn btn-primary mt-4 w-100"
              style={{ backgroundColor: "#9D00FF", borderColor: "#9D00FF" }}
              onClick={() => history.replace("/")}
            >
              Back to login
            </button>
          </form>
          <div className="text-center mt-3">
            <a
              href={Link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#9D00FF", textDecoration: "none" }}
            >
              {Link}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Link;
