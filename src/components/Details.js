// src/Details.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Details.css"; // Import the CSS file
import "bootstrap/dist/css/bootstrap.min.css";
import {
  signOut
} from "firebase/auth";
import { auth } from "../firebase";
import { useHistory } from "react-router-dom"; 

const Details = () => {
  const history = useHistory(); 
  const [activeTab, setActiveTab] = useState("details");
  const [details, setDetails] = useState(
    JSON.parse(sessionStorage.getItem("details"))
  );
  const [stats, setStats] = useState({});
  const [qualification, setQualfication] = useState();
  const [allQualifications, setAllQualifications] = useState();
  const [quotaDetails, setQuotaDetails] = useState();
  useEffect(() => {
    async function getStats() {
      let survey_id = details.SurveyId;
      const response = await axios.get(`https://zamplia-api-backend.onrender.com0/api/stats`, {
        params: {
          survey_id: survey_id,
        },
      });
      setStats(response?.data?.result?.data);
    }
    getStats();
  }, []);

  useEffect(() => {
    async function getDemographic() {
      let LanguageId = details.LanguageId;
      const response = await axios.get(
        `https://zamplia-api-backend.onrender.com0/api/demographic`,
        {
          params: {
            LanguageId: LanguageId,
          },
        }
      );
      setAllQualifications(response?.data?.result?.data);
    }
    getDemographic();
  }, []);

  useEffect(() => {
    async function getQualification() {
      let survey_id = details.SurveyId;
      const response = await axios.get(
        `https://zamplia-api-backend.onrender.com0/api/qualification`,
        {
          params: {
            survey_id: survey_id,
          },
        }
      );
      if (allQualifications?.length > 0) {
        const result = getMatchingAnswers(
          allQualifications,
          response?.data?.result?.data
        );
        setQualfication(result);
      }
    }
    getQualification();
  }, [allQualifications]);

  useEffect(() => {
    async function getQuota() {
      let survey_id = details.SurveyId;
      const response = await axios.get(`https://zamplia-api-backend.onrender.com0/api/quota`, {
        params: {
          survey_id: survey_id,
        },
      });
      if (allQualifications?.length > 0) {
        const result = mapQualifications(
          allQualifications,
          response?.data?.result?.data
        );
        setQuotaDetails(result);
      }
    }
    getQuota();
  }, [allQualifications]);

  const mapQualifications = (qualifications, quotas) => {
    return quotas?.map((quota) => {
      const matchedQualifications = quota?.QuotaQualifications?.map((qQual) => {
        const question = qualifications?.find(
          (qual) => qual?.QuestionID === qQual?.QuestionId
        );

        if (question) {
          const answers = qQual?.AnswerCodes?.map((code) => {
            const answer = question?.AnswerCodes?.find(
              (a) => a?.AnswerCode?.toString() === code
            );
            return answer ? answer?.AnswerText : null;
          }).filter((text) => text); // Filter out nulls

          return {
            QuestionText: question?.QuestionText,
            Answers: answers,
          };
        }

        return null; // If no question match, return null
      }).filter((qual) => qual !== null); // Filter out null qualifications

      return {
        QuotaId: quota?.QuotaId,
        TotalQuotaCount: quota?.TotalQuotaCount,
        Qualifications: matchedQualifications,
      };
    });
  };

  const getMatchingAnswers = (qualifications, inputArray) => {
    return inputArray
      ?.map((input) => {
        const matchingQuestion = qualifications?.find(
          (q) => q?.QuestionID === input?.QuestionID
        );

        if (matchingQuestion) {
          const matchedAnswers = matchingQuestion?.AnswerCodes?.filter(
            (answer) => input?.AnswerCodes?.includes(answer?.AnswerCode)
          );

          return {
            QuestionText: matchingQuestion?.QuestionText,
            Answers: matchedAnswers?.map((answer) => answer?.AnswerText),
          };
        }
        return null; // If no matching question, return null
      })
      .filter((result) => result !== null); // Filter out null results
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "details":
        return (
          <div className="container mt-4">
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="card">
                  <div className="card-body text-center">
                    <div className="text-muted" style={{ fontSize: "0.85em" }}>
                      Survey ID
                    </div>
                    <div style={{ color: "#9D00FF", fontWeight: "bold" }}>
                      {details?.SurveyId + "-" + Math.ceil(details?.CPI)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <div className="card">
                  <div className="card-body text-center">
                    <div className="text-muted" style={{ fontSize: "0.85em" }}>
                      Name
                    </div>
                    <div style={{ color: "#9D00FF", fontWeight: "bold" }}>
                      {details?.Name}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <div className="card">
                  <div className="card-body text-center">
                    <div className="text-muted" style={{ fontSize: "0.85em" }}>
                      Country
                    </div>
                    <div style={{ color: "#9D00FF", fontWeight: "bold" }}>
                      {details?.country}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <div className="card">
                  <div className="card-body text-center">
                    <div className="text-muted" style={{ fontSize: "0.85em" }}>
                      Total Remaining
                    </div>
                    <div style={{ color: "#9D00FF", fontWeight: "bold" }}>
                      {details?.TotalCompleteRequired}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <div className="card">
                  <div className="card-body text-center">
                    <div className="text-muted" style={{ fontSize: "0.85em" }}>
                      LOI
                    </div>
                    <div style={{ color: "#9D00FF", fontWeight: "bold" }}>
                      {details?.LOI}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <div className="card">
                  <div className="card-body text-center">
                    <div className="text-muted" style={{ fontSize: "0.85em" }}>
                      IR
                    </div>
                    <div style={{ color: "#9D00FF", fontWeight: "bold" }}>
                      {details?.IR}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <div className="card">
                  <div className="card-body text-center">
                    <div className="text-muted" style={{ fontSize: "0.85em" }}>
                      Industry
                    </div>
                    <div style={{ color: "#9D00FF", fontWeight: "bold" }}>
                      {details?.industry}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <div className="card">
                  <div className="card-body text-center">
                    <div className="text-muted" style={{ fontSize: "0.85em" }}>
                      Device
                    </div>
                    <div style={{ color: "#9D00FF", fontWeight: "bold" }}>
                      {details?.Device}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "qualification":
        return (
          <div className="container mt-4">
            <div className="row">
              {qualification?.map((question, index) => (
                <div className="col-12 mb-3" key={index}>
                  {" "}
                  {/* Full width for each card */}
                  <div className="card">
                    <div className="card-body text-center">
                      {/* Display the question text */}
                      <div
                        className="text-muted"
                        style={{ fontSize: "1em", fontWeight: "bold" }}
                      >
                        {question.QuestionText}
                      </div>
                      <div
                        style={{
                          color: "#9D00FF",
                          fontWeight: "bold",
                          marginTop: "10px",
                        }}
                      >
                        {question.Answers.length > 0 ? (
                          question.Answers.map((option, idx) => (
                            <div key={idx}>{option}</div> // Display each answer in a new line
                          ))
                        ) : (
                          <div>Any Standard Answer</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "quota":
        return (
          <div className="container mt-4">
            <div className="row">
              {quotaDetails?.length > 0 ? (
                quotaDetails.map((quota, quotaIndex) =>
                  quota?.Qualifications?.map((qualification, qualIndex) => (
                    <div
                      className="col-12 mb-3"
                      key={`${quotaIndex}-${qualIndex}`}
                    >
                      {/* Full width for each card */}
                      <div className="card">
                        <div className="card-body text-center">
                          {/* Display the question text */}
                          <div
                            className="text-muted"
                            style={{
                              color: "#9D00FF",
                              fontWeight: "bold",
                              marginTop: "10px",
                            }}
                          >
                            {qualification?.QuestionText ||
                              "No Question Text Available"}
                          </div>
                          {/* Display the TotalQuotaCount */}
                          <div
                            style={{
                              color: "#9D00FF",
                              fontWeight: "bold",
                              marginTop: "10px",
                            }}
                          >
                            Total Quota Count: {quota?.TotalQuotaCount ?? "N/A"}
                          </div>
                          {/* Display the answers */}
                          <div
                            style={{
                              color: "#9D00FF",
                              fontWeight: "bold",
                              marginTop: "10px",
                            }}
                          >
                            {qualification?.Answers?.length > 0 ? (
                              qualification.Answers.map((option, idx) => (
                                <div key={idx}>
                                  {option || "No Answer Text Available"}
                                </div>
                              ))
                            ) : (
                              <div>Any Standard Answer</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )
              ) : (
                <div className="col-12 text-center">
                  <div
                    className="alert alert-warning"
                    style={{
                      fontSize: "1.2em",
                      fontWeight: "bold",
                      color: "#9D00FF",
                    }}
                  >
                    NO QUOTA AVAILABLE
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case "stats":
        return (
          <div className="container mt-4">
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="card">
                  <div className="card-body text-center">
                    <div className="text-muted" style={{ fontSize: "0.85em" }}>
                      SurveyId
                    </div>
                    <div style={{ color: "#9D00FF", fontWeight: "bold" }}>
                      {stats?.SurveyId}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <div className="card">
                  <div className="card-body text-center">
                    <div className="text-muted" style={{ fontSize: "0.85em" }}>
                      Completes
                    </div>
                    <div style={{ color: "#9D00FF", fontWeight: "bold" }}>
                      {stats?.completes}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <div className="card">
                  <div className="card-body text-center">
                    <div className="text-muted" style={{ fontSize: "0.85em" }}>
                      conversion
                    </div>
                    <div style={{ color: "#9D00FF", fontWeight: "bold" }}>
                      {stats?.conversion}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "logout":
        signOut(auth).then((e) => {
          history.replace("/")
        });;
          
      default:
        return null;
    }
  };

  return (
    <div className="tab-container">
      <div className="tabs">
        <button
          className={activeTab === "details" ? "active" : ""}
          onClick={() => setActiveTab("details")}
        >
          Details
        </button>
        <button
          className={activeTab === "qualification" ? "active" : ""}
          onClick={() => setActiveTab("qualification")}
        >
          Qualification
        </button>
        <button
          className={activeTab === "quota" ? "active" : ""}
          onClick={() => setActiveTab("quota")}
        >
          Quota
        </button>
        <button
          className={activeTab === "stats" ? "active" : ""}
          onClick={() => setActiveTab("stats")}
        >
          Stats
        </button>
        <button
          className={activeTab === "logout" ? "active" : ""}
          onClick={() => setActiveTab("logout")}
        >
          Logout
        </button>
      </div>
      <div className="content-area">{renderTabContent()}</div>
    </div>
  );
};

export default Details;
