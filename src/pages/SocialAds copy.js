import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const SocialAds = () => {
  const [companyInfo, setCompanyInfo] = useState({ name: "", url: "" });
  const [campaignInfo, setCampaignInfo] = useState({
    name: "",
    type: "",
    finalUrl: "",
    goal: "",
    audience: "",
    adjectives: "",
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
      // request: `You are preparing Facebook Ads for ${companyInfo.name} company. You will prepare a Facebook Ads ${campaignInfo.type} campaign called ${campaignInfo.name} Campaign Information is below.`,
      campaign: campaignInfo,
      products,
      textdemands: `Write the copy for ${demands.adcopies} Facebook ad variations for my target audience using this copy template ${demands.headlines} 40-character Headlines,  ${demands.descriptions} 30-character Descriptions, ${demands.primarytext} 125 to 300 character Primary text `,
      // imagedemands: `To create the visual assets in the campaign, you need to prepare a Visual Request Document. The Format of the document is below. You must fill in all fields of the document as required. You should generate the messages as texts on the images. Messages are the most important part of the Visual Request Document. You should write at least 5 messages per messages part.`,
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

        //   setResponse(apiResponse.data.choices[0].message.content);
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
        // const prompt = "Write a story about a magic backpack.";

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
  console.log("Response : ", responseGemini);
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Social Media Campaign Planner</h1>
      <div className="row mt-5">
        <div className="col-md-6">
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

            {/* <div className="mb-3 row align-items-center">
              <div className="col-auto">
                <input
                  type="checkbox"
                  name="headlines"
                  checked={demands.headlines > 0}
                  onChange={handleDemandChange}
                  className="me-2"
                />
              </div>
              <label className="col-form-label col-auto">
                Number of Headlines:
              </label>
              <div className="col-auto">
                <input
                  type="number"
                  name="headlines"
                  value={demands.headlines}
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
                  name="descriptions"
                  checked={demands.descriptions > 0}
                  onChange={handleDemandChange}
                  className="me-2"
                />
              </div>
              <label className="col-form-label col-auto">
                Number of Descriptions:
              </label>
              <div className="col-auto">
                <input
                  type="number"
                  name="descriptions"
                  value={demands.descriptions}
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
                  name="primarytext"
                  checked={demands.primarytext > 0}
                  onChange={handleDemandChange}
                  className="me-2"
                />
              </div>
              <label className="col-form-label col-auto">
                Number of Primary Texts:
              </label>
              <div className="col-auto">
                <input
                  type="number"
                  name="primarytext"
                  value={demands.primarytext}
                  onChange={handleDemandChange}
                  min="0"
                  className="form-control"
                />
              </div>
            </div> */}

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
                // disabled={isLoading}
              >
                {" "}
                Chat Gpt
                {/* <img
                  src={ChatGptLogo}
                  alt="ChatGPT Logo"
                  height="100"
                />{" "} */}
                {/* ChatGPT logosunu ekleyin */}
              </button>
              <button
                type="button"
                className="btn btn-primary m-3"
                onClick={(e) => handleSubmit(e, "gemini")} // Gemini için tıklama işlevi
                // disabled={isLoading}
              >
                {" "}
                Gemini
                {/* <img
                  src={GeminiLogo}
                  alt="Gemini Logo"
                  height="30"
                />{" "} */}
                {/* Gemini logosunu ekleyin */}
              </button>
            </div>
          </form>
        </div>
        <div className="col-md-4 d-flex">
          <div
            className="shadow-lg p-4 bg-light rounded flex-fill"
            style={{ minHeight: "100%", width: "100%" }}
          >
            <h4>Response ChatGpt</h4>
            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
              {responseGpt || "Response from ChatGpt will appear here."}
            </pre>
          </div>
        </div>
        <div className="col-md-4 d-flex">
          <div
            className="shadow-lg p-4 bg-light rounded flex-fill"
            style={{ minHeight: "100%", width: "100%" }}
          >
            <h4>Response Gemini </h4>
            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
              {responseGemini || "Response from Gemini will appear here."}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialAds;
