// src/App.js
import React, { useState, useEffect } from "react";
import "../App.css"; // Import custom CSS
import { useHistory } from "react-router-dom"; 
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css"; // Import custom CSS

function Login() {
  const history = useHistory(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(null);
  const [error, setError] = useState("");

  const handleInactivityLogout = () => {
    if (timer) {
      clearTimeout(timer);
    }

    const newTimer = setTimeout(() => {
      signOut(auth);
    }, 300000);

    setTimer(newTimer); // Store the timer ID
  };

  useEffect(() => {
    // Firebase auth state observer
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        history.push('/SurveyList')
      } else {
        history.push('/')
      }
      setLoading(false); // Stop loading once we have the authentication status
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const events = ["mousemove", "keydown", "scroll", "click"];

    events.forEach((event) => {
      window.addEventListener(event, handleInactivityLogout);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleInactivityLogout);
      });
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      history.push('/SurveyList')
    } catch (err) {
      setError("Invalid credentials or an error occurred.");
    }
  };

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
        <div className="login-container">
          <div className="card login-card">
            <div className="card-body">
              <h3
                className="card-title text-center mb-4"
                style={{ color: "#9D00FF" }}
              >
                Login
              </h3>
              {error && <div className="alert alert-danger">{error}</div>}
              <form>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-primary mt-4 w-100"
                  style={{ backgroundColor: "#9D00FF", borderColor: "#9D00FF" }}
                  onClick={handleLogin}
                >
                  Login
                </button>
                <button
                  type="button"
                  className="btn btn-primary mt-4 w-100"
                  style={{ backgroundColor: "#9D00FF", borderColor: "#9D00FF" }}
                  onClick={() => history.push("/Link/")}
                >
                  Generate Link
                </button>
              </form>
            </div>
          </div>
        </div>
      
  );
}

export default Login;
