import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import schema from "../data/companyreportschema.json";

import GptResponseCompany from "./GptResponseCompany.js";
// import GeminiResponse from "./GeminiResponse.js";

console.log("SCHEMA: ", schema);
const CompanyReport = () => {
  const [companyInfo, setCompanyInfo] = useState({
    name: "",
    url: "",
    goal: [],
    focusPoints: "",
    additionalInfo: "",
    textlanguage: "",
    currency: "",
  });

  const [responseGpt, setResponseGpt] = useState(
    "Response from ChatGpt will appear here."
  );
  const [responseGemini, setResponseGemini] = useState(
    "Response from Gemini will appear here."
  );
  const [isLoading, setIsLoading] = useState(false);

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
  const currency = [
    { label: "Dolar", value: "Dolar" },
    { label: "Euro", value: "FreEuronch" },
    { label: "Turkish Lira", value: "Turkish Lira" },
    { label: "Local", value: "Local" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setCompanyInfo((prev) => {
      const goals = checked
        ? [...prev.goal, value]
        : prev.goal.filter((goal) => goal !== value);
      return { ...prev, goal: goals };
    });
  };

  const handleSubmit = async (e, model) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const systemContent =
        "You are an AI-powered digital marketing assistant specialized in creating reports for potential clients of a advertising agency. Your primary function is to analyze data from Google Ads and other relevant sources to generate comprehensive and insightful reports that showcase the potential benefits of partnering with the agency. These reports should highlight key performance indicators (KPIs), identify target audiences, keywords and budget and propose effective digital advertising strategies tailored to each client's specific needs and goals.";

      const requestData = {
        request: `You are preparing a Company Report for the ${companyInfo.name} company. The report should include potential keywords, ad copy suggestions, and a proposed budget for a Google Ads campaign. The Campaign Information is below.`,
        companyInfo: `a. Company: ${companyInfo.name}, b. URL: ${companyInfo.url}, c. Objectives: ${companyInfo.goal}, d. Focus Points: ${companyInfo.focusPoints}, e. Budget Currency: ${companyInfo.currency}`,
        additionalInfo: `Additional Info: ${companyInfo.additionalInfo}`,
        reportLanguage: `Report Language:  ${companyInfo.textlanguage}`,
      };
  const plainTextRequestData = `
  ${requestData.request}
  ${requestData.companyInfo}
  ${requestData.additionalInfo}
  ${requestData.reportLanguage}
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
            response_format: {
              type: "json_schema",
              json_schema: schema,
            },
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

        const jsonResponse = apiResponse.data.choices[0].message.content
        setResponseGpt(JSON.parse(jsonResponse));
      } else if (model === "gemini") {
        const { GoogleGenerativeAI } = require("@google/generative-ai");

        const genAI = new GoogleGenerativeAI(
          process.env.REACT_APP_GEMINI_API_KEY
        );
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const system = JSON.stringify(systemContent);
        const request = JSON.stringify(plainTextRequestData);
        const prompt = ` ${system} \n ${request}`;
        console.log("Prompt: ", prompt);

        const result = await model.generateContent(prompt);

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
      goal: [],
      focusPoints: "",
      additionalInfo: "",
      textlanguage: "",
      currency: "",
    });
  };
  const clearAll = () => {
    setCompanyInfo({
      name: "",
      url: "",
      goal: [],
      focusPoints: "",
      additionalInfo: "",
      textlanguage: "",
      currency: "",
    });
    setResponseGpt("");
    setResponseGemini("");
  };

  console.log("Company Info :", companyInfo);
  console.log("Schema :", schema);

  return (
    <div className="container-fluid mt-5" style={{ width: "100%" }}>
      <div>
        <h1 className="container-sm shadow-lg text-center p-4 mb-4">
          Prismoon Google Ads Plan
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
                    onChange={handleCheckboxChange}
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
              <select
              className="form-control mb-3"
              name="currency"
              value={companyInfo.currency}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                Select Currency
              </option>
              {currency.map(function (cur) {
                return (
                  <option key={cur.value} value={cur.value}>
                    {cur.label}
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
                Chat Gpt
              </button>
              {/* <button
                type="button"
                className="btn btn-primary m-3"
                onClick={(e) => handleSubmit(e, "gemini")}
                disabled={isLoading}
              >
                Gemini
              </button> */}
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
        <GptResponseCompany
          gptResponse={responseGpt}
          setResponseGpt={setResponseGpt}
        />
        {/* <GeminiResponse
          geminiResponse={responseGemini}
          setResponseGemini={setResponseGemini}
        /> */}
      </div>
    </div>
  );
};

export default CompanyReport;