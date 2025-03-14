import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

import GptResponse from "./GptResponse.js";
import GeminiResponse from "./GeminiResponse.js";
import Anthropic from "./Anthropic.js";

const GoogleAds = () => {
  const [companyInfo, setCompanyInfo] = useState({ name: "", url: "" });
  const [campaignInfo, setCampaignInfo] = useState({
    name: "",
    type: "",
    finalUrl: "",
    goal: "",
    audience: "",
    focusPoints: "",
    additionalInfo: "",
    textlanguage: "",
  });
  const [products, setProducts] = useState([{ name: "", data: "", url: "" }]);
  const [demands, setDemands] = useState({
    headlines30: 15,
    headlines90: 5,
    descriptions60: 1,
    descriptions90: 4,
    searchTerms: 25,
    visualRequest: false,
  });
  const [imageDemandReq, setImageDemandReq] = useState(false);
  const [responseGpt, setResponseGpt] = useState(
    "Response from ChatGpt will appear here."
  );
  const [responseGemini, setResponseGemini] = useState(
    "Response from Gemini will appear here."
  );
  const [responseAnth, setResponseAnth] = useState(
    "Response from Anthropic will appear here."
  );

  const [isLoading, setIsLoading] = useState(false);

  const campaignTypes = [
    { label: "Performance Max", value: "Performance Max" },
    { label: "Search", value: "Search" },
    { label: "Discovery", value: "Discovery" },
    { label: "Display", value: "Display" },
    { label: "Shopping", value: "Shopping" },
    { label: "App", value: "App" },
    { label: "Video", value: "Video" },
  ];
  const campaignObjectives = [
    { label: "Sales", value: "Sales" },
    { label: "Leads", value: "Leads" },
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

  const handleCampaignChange = (e) => {
    const { name, value } = e.target;
    setCampaignInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = [...products];
    updatedProducts[index][name] = value;
    setProducts(updatedProducts);
  };

  const addProduct = () => {
    setProducts([...products, { name: "", data: "", url: "" }]);
  };

  const removeProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  const handleDemandChange = (e) => {
    const { name, value, checked, type } = e.target;
    const val = type === "checkbox" ? checked : value;
    setDemands((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e, model) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const systemContent =
        `You are an expert in Google Ads, knowledgeable about the different types of Google Ads campaigns and how to create the necessary content for them. You possess the expertise to select keywords effectively and generate creative solutions using relevant keywords for campaigns. You can produce suitable written assets and visuals for advertising campaigns. You are a friendly and helpful assistant with a strong command of the ${campaignInfo.textlanguage} language and literature.`;

      // Visual Request Document formatı
      let visualRequestDocument = "";
      if (demands.visualRequest) {
        visualRequestDocument += "1. General Definitions\n";
        visualRequestDocument += `a. Company: ${companyInfo.name}\n`;
        visualRequestDocument += `b. Campaign Name: ${campaignInfo.name}\n`;
        visualRequestDocument += `c. Final URL: ${campaignInfo.finalUrl}\n`;
        visualRequestDocument += `d. Goals: ${campaignInfo.goal}\n`;
        visualRequestDocument += `e. Target Audience: ${campaignInfo.audience}\n`;
        visualRequestDocument += `f. Focus Points: ${campaignInfo.focusPoints}\n`;

        visualRequestDocument += "g. Products:\n";
        products.forEach((product, index) => {
          visualRequestDocument += `(1) Product-${index + 1}: ${
            product.name
          }\n`;
          visualRequestDocument += `   (a) URL: ${product.url}\n`;
          //   visualRequestDocument += `   (b) Data: ${product.data}\n`;
        });

        visualRequestDocument += "2. Key Features to Highlight (at least 5)\n";
        visualRequestDocument += "3. Visual Requests\n";
        visualRequestDocument += "a. General Images\n";
        visualRequestDocument += "(1). Quantity: \n";
        visualRequestDocument += "(2). Messages: \n";
        visualRequestDocument += "(3). Notes: \n";

        products.forEach((product, index) => {
          visualRequestDocument += `b. Product Images (for Product-${
            index + 1
          })\n`;
          visualRequestDocument += `(1) Product-${index + 1}\n`;
          visualRequestDocument += `   (a) Quantity: \n`;
          visualRequestDocument += `   (b) Messages: \n`;
          visualRequestDocument += `   (c) Notes: \n`;
        });

        visualRequestDocument += "c. Video Requests (2 Duration, 3 Ratio)\n";
        visualRequestDocument += "(1). Quantity: \n";
        visualRequestDocument += "(2). Duration: (Seconds): \n";
        visualRequestDocument += "(3). Messages: \n";
        visualRequestDocument += "(4). Notes: \n";
      }

      const requestData = {
        request: `You are preparing a Google Ads advertisement for the ${companyInfo.name} company. You will prepare a Google Ads ${campaignInfo.type} campaign called ${campaignInfo.name}. The Campaign Information is below.`,
        campaignInfo: `a. Company: ${companyInfo.name}, b. Campaign Name: ${campaignInfo.name}, c. Campaign Type: ${campaignInfo.type}, d. Objectives: ${campaignInfo.goal}, e. Final URL: ${campaignInfo.finalUrl}, f. Target Audience: ${campaignInfo.audience}, g. Focus Points: ${campaignInfo.focusPoints}, g. Campaign Language: ${campaignInfo.textlanguage}`,
        additionalInfo: `Additional Info: ${campaignInfo.additionalInfo}`,
        productsInfo: `Information about the products to be used in the campaign:
        ${products.map((product, index) =>
          `${index + 1}. Name: ${product.name || "N/A"}, 
          Data: ${product.data || "N/A"}, 
          URL: ${product.url || "N/A"}`)
          .join("\n")}`,
        textdemands: `To prepare the campaign text assets, please generate the following in ${
          campaignInfo.textlanguage ? campaignInfo.textlanguage : "English"
        }:  ${demands.headlines30} headlines (up to 30 characters each),  ${
          demands.headlines90
        } long headlines (up to 90 characters each), ${
          demands.descriptions60
        } description (up to 60 characters),  ${
          demands.descriptions90
        } descriptions (up to 90 characters each), and ${
          demands.searchTerms
        } search terms (up to 80 characters each). Adhere strictly to the character limits for each type of asset. Ensure that the texts are clear, compelling, and thematically relevant, and avoid using exclamation marks.`,
        ...(imageDemandReq && {
          imagedemands: `To create the visual assets in the campaign, you need to prepare a Visual Request Document. The Format of the document is below. You must fill in all fields of the document as required. You should generate the messages as texts on the images. Messages are the most important part of the Visual Request Document. You should write at least 5 messages per messages part. \n ${visualRequestDocument}`,
        }),
      };
      // console.log("Request Data :", JSON.stringify(requestData));
      const plainTextRequestData = `
  ${requestData.request}
  ${requestData.campaignInfo}
  ${requestData.additionalInfo}
  ${requestData.productsInfo || ""}
  ${requestData.textdemands}
  ${requestData.imagedemands || ""}
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
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const system = JSON.stringify(systemContent);
        const request = JSON.stringify(plainTextRequestData);
        const prompt = ` ${system} \n ${request}`;
        console.log("Prompt: ", prompt);

        const result = await model.generateContent(prompt);
        // console.log(result.response.text());

        const cleanResponse = result.response
          .text()
          .replace(/[*#]+/g, "")
          .replace(/\n+/g, "\n")
          .trim();
        setResponseGemini(cleanResponse);
      } else if (model === "anthropic") {
        // Anthropic API entegrasyonu
        const apiResponse = await axios.post(
          "https://api.anthropic.com/v1/messages",
          {
            model: "claude-3-haiku-20240307",
            messages: [
              {
                role: "user",
                // content: JSON.stringify(requestData),
                content: requestData,
              },
            ],
            max_tokens: 4096,
            temperature: 1.0,
            system: systemContent,
          },
          {
            headers: {
              // "x-api-key": `${process.env.REACT_APP_ANTHROPIC_API_KEY}`,
              "Authorization": `Bearer ${process.env.REACT_APP_ANTHROPIC_API_KEY}`,
              "anthropic-version": "2023-06-01",
              "Content-Type": "application/json",
            },
          }
        );

        const cleanResponse = apiResponse.content[0].text
          .replace(/[*#]+/g, "")
          .replace(/\n+/g, "\n")
          .trim();
        setResponseAnth(cleanResponse);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setCompanyInfo({ name: "", url: "" });
    setCampaignInfo({
      name: "",
      type: "",
      finalUrl: "",
      goal: "",
      audience: "",
      focusPoints: "",
      additionalInfo: "",
      textlanguage: "",
    });
    setProducts([{ name: "", data: "", url: "" }]);
    setDemands({
      headlines30: 15,
      headlines90: 5,
      descriptions60: 1,
      descriptions90: 4,
      searchTerms: 25,
      visualRequest: false,
    });
  };
  const clearAll = () => {
    setCompanyInfo({ name: "", url: "" });
    setCampaignInfo({
      name: "",
      type: "",
      finalUrl: "",
      goal: "",
      audience: "",
      focusPoints: "",
      additionalInfo: "",
      textlanguage: "",
    });
    setProducts([{ name: "", data: "", url: "" }]);
    setDemands({
      headlines30: 15,
      headlines90: 5,
      descriptions60: 1,
      descriptions90: 4,
      searchTerms: 25,
      visualRequest: false,
    });
    setResponseGpt("");
    setResponseGemini("");
  };

  useEffect(() => {
    setImageDemandReq(demands.visualRequest);
  }, [demands.visualRequest]);

  // console.log("Response Gemini: ", responseGemini);
  // console.log("Response ChatGpt : ", responseGpt);
  // console.log("Type :", campaignInfo.type);
  // console.log("name :", campaignInfo.name);
  // console.log("lang :", campaignInfo.textlanguage);
  console.log(
    "Company Info :",
    companyInfo,
    "\nCampaign Info:",
    campaignInfo,
    "\nDemands:",
    demands
  );

  return (
    <div className="container-fluid mt-5" style={{ width: "100%" }}>
      <div>
        <h1 className="container-sm shadow-lg text-center p-4 mb-4">
          Google Ads Campaign Planner
        </h1>
      </div>
      <div className="row mt-5">
        <div className="col-md-4">
          <form
            onSubmit={handleSubmit}
            className="shadow-lg p-4 bg-light rounded"
          >
            {/* Part-1: Company Info */}
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

            {/* Part-2: Campaign Info */}
            <h4 className="mb-3">Campaign Info</h4>
            <input
              className="form-control mb-3"
              name="name"
              placeholder="Campaign Name"
              value={campaignInfo.name}
              onChange={handleCampaignChange}
              required
            />
            <select
              className="form-control mb-3"
              name="type"
              value={campaignInfo.type}
              onChange={handleCampaignChange}
              required
            >
              <option value="" disabled>
                Select Campaign Type
              </option>
              {campaignTypes.map(function (type) {
                // console.log(type.value);
                return (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                );
              })}
            </select>
            <select
              className="form-control mb-3"
              name="goal"
              value={campaignInfo.goal}
              onChange={handleCampaignChange}
              required
            >
              <option value="" disabled>
                Select Campaign Objective
              </option>
              {campaignObjectives.map(function (obj) {
                // console.log(obj.value);
                return (
                  <option key={obj.value} value={obj.value}>
                    {obj.label}
                  </option>
                );
              })}
            </select>
            <select
              className="form-control mb-3"
              name="textlanguage"
              value={campaignInfo.textlanguage}
              onChange={handleCampaignChange}
              required
            >
              <option value="" disabled>
                Select Campaign Language
              </option>
              {textLang.map(function (lang) {
                // console.log(lang.value);
                return (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                );
              })}
            </select>
            <input
              className="form-control mb-3"
              name="finalUrl"
              placeholder="Final URL"
              value={campaignInfo.finalUrl}
              onChange={handleCampaignChange}
              required
            />
            <input
              className="form-control mb-3"
              name="audience"
              placeholder="Target Audience"
              value={campaignInfo.audience}
              onChange={handleCampaignChange}
              required
            />
            <input
              className="form-control mb-3"
              name="focusPoints"
              placeholder="Focus Points"
              value={campaignInfo.focusPoints}
              onChange={handleCampaignChange}
              required
            />
            <h4 className="mb-3">Additional Info</h4>
            <textarea
              className="form-control mb-3"
              name="additionalInfo"
              placeholder="Additional Info"
              value={campaignInfo.additionalInfo}
              onChange={handleCampaignChange}
              required
              style={{ height: "100px" }}
            />

            {/* Part-3: Products Info */}
            <h4 className="mb-3">Products Info</h4>
            {products.map((product, index) => (
              <div key={index} className="mb-3">
                <input
                  className="form-control"
                  name="name"
                  placeholder="Product Name"
                  value={product.name}
                  onChange={(e) => handleProductChange(index, e)}
                  required
                />
                <textarea
                  className="form-control mt-1"
                  name="data"
                  placeholder="Product Data"
                  value={product.data}
                  onChange={(e) => handleProductChange(index, e)}
                  required
                  style={{ height: "100px" }}
                />
                <input
                  className="form-control mt-1"
                  name="url"
                  placeholder="Product URL"
                  value={product.url}
                  onChange={(e) => handleProductChange(index, e)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-danger mt-2"
                  onClick={() => removeProduct(index)}
                >
                  Delete
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary mb-4"
              onClick={addProduct}
            >
              + New Product
            </button>

            {/* Part-4: Demand */}
            <h4 className="mb-3">Demand</h4>

            <div className="mb-3 row align-items-center">
              <div className="col-auto">
                <input
                  type="checkbox"
                  name="headlines30"
                  checked={demands.headlines30 > 0}
                  onChange={handleDemandChange}
                  className="me-2"
                />
              </div>
              <label className="col-form-label col-auto">
                30 Character Headlines:
              </label>
              <div className="col-sm">
                <input
                  type="number"
                  name="headlines30"
                  value={demands.headlines30}
                  onChange={handleDemandChange}
                  min="0"
                  className="form-control"
                />
              </div>
            </div>

            <div className="mb-3 row align-items-center">
              <div className="col-auto">
                <input
                  type="checkbox"
                  name="headlines90"
                  checked={demands.headlines90 > 0}
                  onChange={handleDemandChange}
                  className="me-2"
                />
              </div>
              <label className="col-form-label col-auto">
                90 Character Long Headlines:
              </label>
              <div className="col-sm">
                <input
                  type="number"
                  name="headlines90"
                  value={demands.headlines90}
                  onChange={handleDemandChange}
                  min="0"
                  className="form-control"
                />
              </div>
            </div>

            <div className="mb-3 row align-items-center">
              <div className="col-auto">
                <input
                  type="checkbox"
                  name="descriptions60"
                  checked={demands.descriptions60 > 0}
                  onChange={handleDemandChange}
                  className="me-2"
                />
              </div>
              <label className="col-form-label col-auto">
                60 Character Descriptions:
              </label>
              <div className="col-sm">
                <input
                  type="number"
                  name="descriptions60"
                  value={demands.descriptions60}
                  onChange={handleDemandChange}
                  min="0"
                  className="form-control"
                />
              </div>
            </div>

            <div className="mb-3 row align-items-center">
              <div className="col-auto">
                <input
                  type="checkbox"
                  name="descriptions90"
                  checked={demands.descriptions90 > 0}
                  onChange={handleDemandChange}
                  className="me-2"
                />
              </div>
              <label className="col-form-label col-auto">
                90 Character Descriptions:
              </label>
              <div className="col-sm">
                <input
                  type="number"
                  name="descriptions90"
                  value={demands.descriptions90}
                  onChange={handleDemandChange}
                  min="0"
                  className="form-control"
                />
              </div>
            </div>

            <div className="mb-3 row align-items-center">
              <div className="col-auto">
                <input
                  type="checkbox"
                  name="searchTerms"
                  checked={demands.searchTerms > 0}
                  onChange={handleDemandChange}
                  className="me-2"
                />
              </div>
              <label className="col-form-label col-auto">
                Number of Search Terms:
              </label>
              <div className="col-sm">
                <input
                  type="number"
                  name="searchTerms"
                  value={demands.searchTerms}
                  onChange={handleDemandChange}
                  min="0"
                  className="form-control"
                />
              </div>
            </div>
            <div className="mb-3 row align-items-center">
              <div className="col-auto">
                <input
                  type="checkbox"
                  name="visualRequest"
                  checked={demands.visualRequest}
                  onChange={handleDemandChange}
                  className="me-2"
                />
              </div>
              <label className="col-form-label col-auto">
                Visual Request Document
              </label>
            </div>
            <div className="d-flex justify-content-left">
              <button
                type="button"
                className="btn btn-primary m-3"
                onClick={(e) => handleSubmit(e, "chatgpt")} // ChatGPT için tıklama işlevi
                disabled={isLoading}
              >
                {" "}
                Chat Gpt
              </button>
              <button
                type="button"
                className="btn btn-primary m-3"
                onClick={(e) => handleSubmit(e, "gemini")} // Gemini için tıklama işlevi
                disabled={isLoading}
              >
                {" "}
                Gemini
              </button>
              {/* <button
                type="button"
                className="btn btn-primary m-3"
                onClick={(e) => handleSubmit(e, "anthropic")} // anthropic için tıklama işlevi
                disabled={isLoading}
              >
                {" "}
                Anthropic
              </button> */}
              <button
                type="button"
                className="btn btn-danger m-3" // Kırmızı buton rengi
                onClick={clearForm} // Formu temizleyen işlev
              >
                Clear Form
              </button>
              <button
                type="button"
                className="btn btn-dark m-3" // Kırmızı buton rengi
                onClick={clearAll} // Formu temizleyen işlev
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
        {/* <Anthropic anthResponse={responseAnth} setResponseAnth={setResponseAnth}/> */}
      </div>
    </div>
  );
};

export default GoogleAds;
