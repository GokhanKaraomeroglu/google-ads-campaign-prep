import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

import GptResponse from "./GptResponse.js";
import GeminiResponse from "./GeminiResponse.js";

const SocialAds = () => {
  const [companyInfo, setCompanyInfo] = useState({ name: "", url: "" });
  const [campaignInfo, setCampaignInfo] = useState({
    name: "",
    type: "",
    finalUrl: "",
    goal: "",
    audience: "",
    adjectives: "",
    additionalInfo: "",
  });
  const [products, setProducts] = useState([{ name: "", data: "", url: "" }]);
  const [demands, setDemands] = useState({
    headlines: 1,
    descriptions: 1,
    primarytext: 1,
    adcopies: 5,
    // searchTerms: 25,
    // visualRequest: false,
  });

  const [responseGpt, setResponseGpt] = useState(null);
  const [responseGemini, setResponseGemini] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
    try {
    const systemContent =
      "You are a Social Media & Facebook Ad Copy Expert, knowledgeable about the different types of Social Media campaigns and how to create the necessary content for them. You possess the expertise to select social media marketing strategies effectively and generate creative solutions using relevant campaign models. You can produce suitable written assets and creatives and videos for advertising campaigns. You are a friendly and helpful assistant with a strong command of the English language and literature.";

   
    const requestData = {
      request: `  ${companyInfo.name} company sells products below. I’m running a ${campaignInfo.type} campaign targeting ${campaignInfo.audience}. My brand voice is ${campaignInfo.adjectives}. Campaign Information is below`,
      campaign: campaignInfo,
      products,
      textdemands: `Write the copy for ${demands.adcopies} Facebook ad variations for my target audience using this copy template ${demands.headlines} 40-character Headlines,  ${demands.descriptions} 30-character Descriptions, ${demands.primarytext} 125 to 300 character Primary text `,
      };

    // ChatGPT API ayarı

      if (model === "chatgpt") {
        const apiResponse = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemContent },
              { role: "user", content: JSON.stringify(requestData) },
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

        const cleanResponse = apiResponse.data.choices[0].message.content
          .replace(/[*#]+/g, "")
          .replace(/\n+/g, "\n")
          .trim();
        setResponseGpt(cleanResponse);
      } else if (model === "gemini") {
        const {GoogleGenerativeAI} = require("@google/generative-ai");

        const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = JSON.stringify(requestData);

        const result = await model.generateContent(prompt);
        console.log(result.response.text());

        const cleanResponse = result.response.text()
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
    setCompanyInfo({ name: "", url: "" });
    setCampaignInfo({
      name: "",
      type: "",
      finalUrl: "",
      goal: "",
      audience: "",
      focusPoints: "",
      additionalInfo: "",
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
    // setResponseGpt("");
    // setResponseGemini("");
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
  console.log("Response : ", responseGemini);
  return (
<div className="container-fluid mt-5" style={{ width: "100%" }}>
      <div>
        <h1 className="container-sm shadow text-center p-4 mb-4">
        Social Media Campaign Planner
        </h1>
      </div>
      <div className="row mt-5">
        <div className="col-md-4">
        <form onSubmit={handleSubmit} className="shadow p-4 bg-light rounded">
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
            <input
              className="form-control mb-3"
              name="type"
              placeholder="Campaign Type"
              value={campaignInfo.type}
              onChange={handleCampaignChange}
              required
            />
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
              name="goal"
              placeholder="Campaign Goal"
              value={campaignInfo.goal}
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
              name="adjectives"
              placeholder="Adjectives"
              value={campaignInfo.adjectives}
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
                  name="adcopies"
                  checked={demands.adcopies > 0}
                  onChange={handleDemandChange}
                  className="me-2"
                />
              </div>
              <label className="col-form-label col-auto">
                Number of Ad Copies:
              </label>
              <div className="col-auto">
                <input
                  type="number"
                  name="adcopies"
                  value={demands.adcopies}
                  onChange={handleDemandChange}
                  min="0"
                  className="form-control"
                />
              </div>
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
        <GptResponse gptResponse={responseGpt}/>
        <GeminiResponse geminiResponse={responseGemini}/>
      </div>
    </div>
  );
};

export default SocialAds;
