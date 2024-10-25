import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const CampaignForm = () => {
  const [companyInfo, setCompanyInfo] = useState({ name: '', url: '' });
  const [campaignInfo, setCampaignInfo] = useState({ name: '', finalUrl: '', goal: '', audience: '', focusPoints: '' });
  const [products, setProducts] = useState([{ name: '', data: '', url: '' }]);
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
    setCompanyInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleCampaignChange = (e) => {
    const { name, value } = e.target;
    setCampaignInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = [...products];
    updatedProducts[index][name] = value;
    setProducts(updatedProducts);
  };

  const addProduct = () => {
    setProducts([...products, { name: '', data: '', url: '' }]);
  };

  const handleDemandChange = (e) => {
    const { name, value, checked, type } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setDemands(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const requestData = {
      company: companyInfo,
      campaign: campaignInfo,
      products,
      demands,
    };

    // ChatGPT API ayarı
    try {
      const apiResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
        messages: [{ role: 'user', content: JSON.stringify(requestData) }]
      }, {
        headers: {
          'Authorization': `Bearer YOUR_API_KEY`,
          'Content-Type': 'application/json'
        }
      });

      setResponse(apiResponse.data.choices[0].message.content);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h2>Google Ads Campaign Preparation Form</h2>
      <form onSubmit={handleSubmit}>
        {/* Part-1: Company Info */}
        <h4 className="mb-3" >Company Info</h4>
        <input className="form-control mb-3" name="name" placeholder="Company Name" value={companyInfo.name} onChange={handleInputChange} required />
        <input className="form-control mb-3" name="url" placeholder="Company URL" value={companyInfo.url} onChange={handleInputChange} required />

        {/* Part-2: Campaign Info */}
        <h4 className="mb-3">Campaign Info</h4>
        <input className="form-control mb-3" name="name" placeholder="Campaign Name" value={campaignInfo.name} onChange={handleCampaignChange} required />
        <input className="form-control mb-3" name="finalUrl" placeholder="Final URL" value={campaignInfo.finalUrl} onChange={handleCampaignChange} required />
        <input className="form-control mb-3" name="goal" placeholder="Campaign Goal" value={campaignInfo.goal} onChange={handleCampaignChange} required />
        <input className="form-control mb-3" name="audience" placeholder="Target Audience" value={campaignInfo.audience} onChange={handleCampaignChange} required />
        <input className="form-control mb-3" name="focusPoints" placeholder="Focus Points" value={campaignInfo.focusPoints} onChange={handleCampaignChange} required />

        {/* Part-3: Products Info */}
        <h4 className="mb-3">Products Info</h4>
        {products.map((product, index) => (
          <div key={index}>
            <input className="form-control mb-3" name="name" placeholder="Product Name" value={product.name} onChange={(e) => handleProductChange(index, e)} required />
            <textarea className="form-control mb-3" name="data" placeholder="Product Data" value={product.data} onChange={(e) => handleProductChange(index, e)} required />
            <input className="form-control mb-3" name="url" placeholder="Product URL" value={product.url} onChange={(e) => handleProductChange(index, e)} required />
          </div>
        ))}
        <button type="button" className="btn btn-secondary" onClick={addProduct}>+</button>

        {/* Part-4: Demand */}

        <h4 className="mb-3">Demand</h4>
       
        <input type="checkbox" name="headlines30" checked={demands.headlines30 > 0} onChange={handleDemandChange} /> Number of 30 Character Headlines: <input type="number" name="headlines30" value={demands.headlines30} onChange={handleDemandChange} min="0" />
    
        <input type="checkbox" name="headlines90" checked={demands.headlines90 > 0} onChange={handleDemandChange} /> Number of 90 Character Long Headlines: <input type="number" name="headlines90" value={demands.headlines90} onChange={handleDemandChange} min="0" />

        <input type="checkbox" name="descriptions60" checked={demands.descriptions60 > 0} onChange={handleDemandChange} /> Number of 60 Character Descriptions: <input type="number" name="descriptions60" value={demands.descriptions60} onChange={handleDemandChange} min="0" />
        
        <input type="checkbox" name="descriptions90" checked={demands.descriptions90 > 0} onChange={handleDemandChange} /> Number of 90 Character Descriptions: <input type="number" name="descriptions90" value={demands.descriptions90} onChange={handleDemandChange} min="0" />
        
        <input type="checkbox" name="searchTerms" checked={demands.searchTerms > 0} onChange={handleDemandChange} /> Number of Search Terms: <input type="number" name="searchTerms" value={demands.searchTerms} onChange={handleDemandChange} min="0" />

        <input type="checkbox" name="visualRequest" checked={demands.visualRequest} onChange={handleDemandChange} /> Visual Request Document

        <button type="submit" className="btn btn-primary mt-3">Submit</button>
      </form>

      {response && (
        <div className="mt-3">
          <h4>Response</h4>
          <pre>{response}</pre>
        </div>
      )}
    </div>
  );
};

export default CampaignForm;