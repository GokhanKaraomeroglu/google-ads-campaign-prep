import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

import GptResponse from "./GptResponse.js";
import GeminiResponse from "./GeminiResponse.js";

const CompanyReport = () => {
  const [companyInfo, setCompanyInfo] = useState({
    name: "",
    url: "",
    goal: "",
    focusPoints: "",
    additionalInfo: "",
    textlanguage: "",
  });

  const [responseGpt, setResponseGpt] = useState(
    "Response from ChatGpt will appear here."
  );
  const [responseGemini, setResponseGemini] = useState(
    "Response from Gemini will appear here."
  );
  const [isLoading, setIsLoading] = useState(false);

  // const campaignTypes = [
  //   { label: "Performance Max", value: "Performance Max" },
  //   { label: "Search", value: "Search" },
  //   { label: "Discovery", value: "Discovery" },
  //   { label: "Display", value: "Display" },
  //   { label: "Shopping", value: "Shopping" },
  //   { label: "App", value: "App" },
  //   { label: "Video", value: "Video" },
  // ];
  const campaignObjectives = [
    { label: "Sales", value: "Sales" },
    { label: "Leads", value: "Leads" },
    { label: "Phone Calls", value: "Phone Calls" },
    { label: "Local Store Visit", value: "Local Store Visit" },
    { label: "Website Traffic", value: "Website Traffic" },
    {
      label: "Awareness and Consideration",
      value: "Awareness and Consideration",
    },
  ];
  const textLang = [
    { label: "English", value: "English" },
    { label: "French", value: "French" },
    { label: "German", value: "German" },
    { label: "Turkish", value: "Turkish" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e, model) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const systemContent =
        "You are an expert in Google Ads, knowledgeable about the different types of Google Ads campaigns and how to create the necessary content for them. You possess the expertise to select keywords effectively and generate creative solutions using relevant keywords for campaigns. You can produce suitable written assets and visuals for advertising campaigns. You are a friendly and helpful assistant with a strong command of the English language and literature.";

     const requestData = {
        request: `You are preparing a Google Ads advertisement for the ${companyInfo.name} company. You will prepare a Google Ads ${companyInfo.type} campaign called ${companyInfo.name}. The Campaign Information is below.`,
        companyInfo: `a. Company: ${companyInfo.name}, b. Campaign Name: ${companyInfo.name}, c. Campaign Type: ${companyInfo.type}, d. Objectives: ${companyInfo.goal}, e. Final URL: ${companyInfo.finalUrl}, f. Target Audience: ${companyInfo.audience}, g. Focus Points: ${companyInfo.focusPoints}, g. Campaign Language: ${companyInfo.textlanguage}`,
        additionalInfo: `Additional Info: ${companyInfo.additionalInfo}`,
      };
  const plainTextRequestData = `
  ${requestData.request}
  ${requestData.companyInfo}
  ${requestData.additionalInfo}
`.trim();
      console.log("Plain Text Request Data:", plainTextRequestData);
      if (model === "chatgpt") {
        const apiResponse = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemContent },
              { role: "user", content: plainTextRequestData },
            ],
            temperature: 1.0,
            max_tokens: 4096,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_GPT_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        //   setResponse(apiResponse.data.choices[0].message.content);
        const cleanResponse = apiResponse.data.choices[0].message.content
          .replace(/[*#]+/g, "")
          .replace(/\n+/g, "\n")
          .trim();
        setResponseGpt(cleanResponse);
      } else if (model === "gemini") {
        const { GoogleGenerativeAI } = require("@google/generative-ai");

        const genAI = new GoogleGenerativeAI(
          process.env.REACT_APP_GEMINI_API_KEY
        );
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = JSON.stringify(requestData);

        const result = await model.generateContent(prompt);
        // console.log(result.response.text());

        const cleanResponse = result.response
          .text()
          .replace(/[*#]+/g, "")
          .replace(/\n+/g, "\n")
          .trim();
        setResponseGemini(cleanResponse);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setCompanyInfo({
      name: "",
      url: "",
      goal: "",
      focusPoints: "",
      additionalInfo: "",
      textlanguage: "",
    });
  };
  const clearAll = () => {
    setCompanyInfo({
      name: "",
      url: "",
      goal: "",
      focusPoints: "",
      additionalInfo: "",
      textlanguage: "",
    });
    setResponseGpt("");
    setResponseGemini("");
  };

  console.log("Company Info :", companyInfo);

  return (
    <div className="container-fluid mt-5" style={{ width: "100%" }}>
      <div>
        <h1 className="container-sm shadow-lg text-center p-4 mb-4">
          Prismoon Company Report
        </h1>
      </div>
      <div className="row mt-5">
        <div className="col-md-4">
          <form
            onSubmit={handleSubmit}
            className="shadow-lg p-4 bg-light rounded"
          >
            <h4 className="mb-3">Company Info</h4>
            <input
              className="form-control mb-3"
              name="name"
              placeholder="Company Name"
              value={companyInfo.name}
              onChange={handleInputChange}
              required
            />
            <input
              className="form-control mb-3"
              name="url"
              placeholder="Company URL"
              value={companyInfo.url}
              onChange={handleInputChange}
              required
            />
            <h4 className="mb-3">Select Goals</h4>
            <div className="form-group mb-3 p-3 bg-white rounded shadow-sm">
              {campaignObjectives.map((obj) => (
                <div key={obj.value} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="goal"
                    value={obj.value}
                    checked={companyInfo.goal.includes(obj.value)}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label">{obj.label}</label>
                </div>
              ))}
            </div>
            <h4 className="mb-3">Additional Info</h4>
            <textarea
              className="form-control mb-3"
              name="focusPoints"
              placeholder="Focus Points"
              value={companyInfo.focusPoints}
              onChange={handleInputChange}
              required
              style={{ height: "100px" }}
            />
            
            <textarea
              className="form-control mb-3"
              name="additionalInfo"
              placeholder="Additional Info"
              value={companyInfo.additionalInfo}
              onChange={handleInputChange}
              required
              style={{ height: "100px" }}
            />
            <select
              className="form-control mb-3"
              name="textlanguage"
              value={companyInfo.textlanguage}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                Select Language
              </option>
              {textLang.map(function (lang) {
                return (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                );
              })}
            </select>
            <div className="d-flex justify-content-left">
              <button
                type="button"
                className="btn btn-primary m-3"
                onClick={(e) => handleSubmit(e, "chatgpt")}
                disabled={isLoading}
              >
                {" "}
                Chat Gpt
              </button>
              <button
                type="button"
                className="btn btn-primary m-3"
                onClick={(e) => handleSubmit(e, "gemini")}
                disabled={isLoading}
              >
                {" "}
                Gemini
              </button>
              <button
                type="button"
                className="btn btn-danger m-3"
                onClick={clearForm}
              >
                Clear Form
              </button>
              <button
                type="button"
                className="btn btn-dark m-3"
                onClick={clearAll}
              >
                Clear All
              </button>
            </div>
          </form>
        </div>
        <GptResponse
          gptResponse={responseGpt}
          setResponseGpt={setResponseGpt}
        />
        <GeminiResponse
          geminiResponse={responseGemini}
          setResponseGemini={setResponseGemini}
        />
      </div>
    </div>
  );
};

export default CompanyReport;
