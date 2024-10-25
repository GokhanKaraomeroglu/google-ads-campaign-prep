import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const CampaignForm = () => {
  const [companyInfo, setCompanyInfo] = useState({ name: "", url: "" });
  const [campaignInfo, setCampaignInfo] = useState({
    name: "",
    type: "",
    finalUrl: "",
    goal: "",
    audience: "",
    focusPoints: "",
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

  const [response, setResponse] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const systemContent =
      "You are an expert in Google Ads, knowledgeable about the different types of Google Ads campaigns and how to create the necessary content for them. You possess the expertise to select keywords effectively and generate creative solutions using relevant keywords for campaigns. You can produce suitable written assets and visuals for advertising campaigns. You are a friendly and helpful assistant with a strong command of the English language and literature.";

    // Visual Request Document formatı
    let visualRequestDocument = "";

    // Eğer Visual Request Document seçilmişse, içeriği oluştur
    // if (demands.visualRequest) {
    //   visualRequestDocument += JSON.stringify({
    //     generalDefinitions: {
    //       company: companyInfo.name,
    //       campaignName: campaignInfo.name,
    //       finalUrl: campaignInfo.finalUrl,
    //       goals: campaignInfo.goal,
    //       targetAudience: campaignInfo.audience,
    //       focusPoints: campaignInfo.focusPoints,
    //       products: products.map((product) => ({
    //         name: product.name,
    //         url: product.url,
    //         // data: product.data
    //       }))
    //     },
    //     keyFeatures: "Key Features (fill in at least 5)",
    //     visualRequests: {
    //       generalImages: {
    //         quantity: " ",
    //         messages: " ",
    //         notes: " "
    //       },
    //       productImages: products.map((product, index) => ({
    //         product: `Product-${index + 1}`,
    //         quantity: " ",
    //         messages: " ",
    //         notes: " "
    //       })),
    //       videoRequests: {
    //         quantity: " ",
    //         duration: " ",
    //         messages: " ",
    //         notes: " "
    //       }
    //     }
    //   }, null, 2);
    // }

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
        visualRequestDocument += `(1) Product-${index + 1}: ${product.name}\n`;
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
      request: `You are preparing Google Ads ads for ${companyInfo.name} company. You will prepare a Google Ads ${campaignInfo.type} campaign called ${campaignInfo.name} Campaign Information is below.`,
      campaign: campaignInfo,
      products,
      textdemands: `To create the texts in the campaign, you need to prepare in English, ${demands.headlines30} 30-character Headlines, ${demands.headlines90} 90-character Long Headlines, ${demands.descriptions60} 60-character Descriptions, ${demands.descriptions90} 90-character Descriptions, ${demands.searchTerms} Search Terms, Don't use exclamation marks`,
      imagedemands: `To create the visual assets in the campaign, you need to prepare a Visual Request Document. The Format of the document is below. You must fill in all fields of the document as required. You should generate the messages as texts on the images. Messages are the most important part of the Visual Request Document. You should write at least 5 messages per messages part.  \n ${visualRequestDocument}`,
    };

    // ChatGPT API ayarı
    try {
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
      const cleanResponse = apiResponse.data.choices[0].message.content.replace(/[*#]+/g, "").replace(/\n+/g, "\n").trim();
      setResponse(cleanResponse); 
    } catch (error) {
      console.error(error);
    }
  };
  console.log("Response : ", response)
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Google Ads Campaign Preparation Form</h1>
      <div className="row">
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
              name="focusPoints"
              placeholder="Focus Points"
              value={campaignInfo.focusPoints}
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
                  Sil
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary mb-4"
              onClick={addProduct}
            >
              + Yeni Ürün Ekle
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
  <label className="col-form-label col-auto">Number of 30 Character Headlines:</label>
  <div className="col-auto">
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
  <label className="col-form-label col-auto">Number of 90 Character Long Headlines:</label>
  <div className="col-auto">
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
  <label className="col-form-label col-auto">Number of 60 Character Descriptions:</label>
  <div className="col-auto">
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
  <label className="col-form-label col-auto">Number of 90 Character Descriptions:</label>
  <div className="col-auto">
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
  <label className="col-form-label col-auto">Number of Search Terms:</label>
  <div className="col-auto">
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
  <label className="col-form-label col-auto">Visual Request Document</label>
</div>

            <button type="submit" className="btn btn-primary mt-3">
              Submit
            </button>
          </form>
        </div>
        <div className="col-md-6">
          <div className="shadow p-4 bg-light rounded">
            <h4>Response</h4>
            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
              {response}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignForm;
