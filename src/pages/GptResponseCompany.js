import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { JsonToWord } from '../utils/jsontoword';

const GptResponseCompany = ({ gptResponse, setResponseGpt }) => {
  const clearResponse = () => {
    setResponseGpt("");
  };

  console.log("gptResponse: ", gptResponse);

  const renderCompanyInfo = () => {
    if (!gptResponse || !gptResponse.company) {
      return (
        <div>
          <h5>1. Company Information:</h5>
          <p>No company information available.</p>
        </div>
      );
    }

    const { name, based_in, website } = gptResponse.company;
    return (
      <div>
        <h5>1. Company Information:</h5>
        <p><strong>Company Name:</strong> {name}</p>
        <p><strong>Location:</strong> {based_in}</p>
        <p><strong>Website:</strong> {website}</p>
      </div>
    );
  };

  const renderGoals = () => {
    if (!gptResponse || !gptResponse.goals) {
      return (
        <div>
          <h5>2. Goals:</h5>
          <p>No Goals information available.</p>
        </div>
      );
    }

    return (
      <div>
        <h5>2. Goals:</h5>
        <ul>
          {gptResponse.goals.map((goal, index) => (
            <li key={index}><strong>{goal.goals} :</strong>  {goal.description}</li>
          ))}
        </ul>
      </div>
    );
  };

  const renderTargetAudience = () => {
    if (!gptResponse || !gptResponse.target_audience) {
      return (
        <div>
          <h5>3. Target Audience:</h5>
          <p>No target audience information available.</p>
        </div>
      );
    }

    const { location, occupation, age_range, gender_distribution, interests } = gptResponse.target_audience;
    return (
      <div>
        <h5>3. Target Audience:</h5>
        <p><strong>Location:</strong> {location}</p>
        <p><strong>Occupation:</strong> {occupation.join(", ")}</p>
        <p><strong>Age Range:</strong> {age_range}</p>
        <p><strong>Gender Distribution:</strong> Male: {gender_distribution.male}%, Female: {gender_distribution.female}%</p>
        <p><strong>Interests:</strong> {interests.join(", ")}</p>
      </div>
    );
  };

  const renderBudget = () => {
    if (!gptResponse || !gptResponse.budget) {
      return (
        <div>
          <h5>4. Budget:</h5>
          <p>No budget information available.</p>
        </div>
      );
    }

    const { conversion_rate, cpc_range, initial_budget, convertion_rate_industry_benchmark } = gptResponse.budget;
    return (
      <div>
        <h5>4. Budget:</h5>
        <p><strong>Conversion Rate:</strong> {conversion_rate}</p>
        <p><strong>CPC Range:</strong> {cpc_range}</p>
        <p><strong>Initial Budget:</strong> {initial_budget}</p>
        <h6><strong>Conversion Rate Industry Benchmark:</strong></h6>
        <ul>
          {convertion_rate_industry_benchmark.map((benchmark, index) => (
            <li key={index}><strong>{benchmark.title}:</strong>  {benchmark.description}</li>
          ))}
        </ul>
      </div>
    );
  };

  const renderBudgetTable = () => {
    if (!gptResponse || !gptResponse.budget_table) {
      return "No budget table information available.";
    }
  
    return (
      <div>
        <h5>Estimated Budget:</h5>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Monthly Budget</th>
              <th>Daily Budget</th>
              <th>Estimated CPC</th>
              <th>Estimated Clicks Per Day</th>
              <th>Estimated Leads Per Month</th>
              <th>Estimated Local Store Visits Per Month</th>
              <th>Estimated Phone Calls Per Month</th>
            </tr>
          </thead>
          <tbody>
            {gptResponse.budget_table.map((row, index) => (
              <tr key={index}>
                <td>{row.monthlyBudget}</td>
                <td>{row.dailyBudget}</td>
                <td>{row.estimatedCPC}</td>
                <td>{row.estimatedClicksPerDay}</td>
                <td>{row.estimatedLeadsPerMonth}</td>
                <td>{row.estimatedLocalStoreVisitsPerMonth}</td>
                <td>{row.estimatedPhoneCallsPerMonth}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h5 className="text-center"><strong>Table : </strong>Estimated Conversions Based on Budget</h5>
      </div>
    );
  };

  const renderStrategy = () => {
    if (!gptResponse || !gptResponse.ads_strategy) {
      return (
        <div>
          <h5>5. Google Ads Strategy:</h5>
          <p>No Google Ads strategy information available.</p>
        </div>
      );
    }
    const { strategy, types_of_campaigns} = gptResponse.ads_strategy;
    return (
      <div>
        <h5>5. Google Ads Strategy:</h5>
        <p>{strategy}</p>
        <ul>
          {types_of_campaigns.map((campaign, index) => (
            <li key={index}><strong>{campaign.campaign_type} :</strong> {campaign.description}</li>
          ))}
        </ul>
      </div>
    );
  };

  const renderKeywords = () => {
    if (!gptResponse || !gptResponse.keywords) {
      return (
        <div>
          <h5>6. Keywords:</h5>
          <p>No keywords information available.</p>
        </div>
      );
    }

    return (
      <div>
        <h5>6. Keywords:</h5>
        <ul>
          {gptResponse.keywords.map((keyword, index) => (
            <li key={index}>{keyword}</li>
          ))}
        </ul>
      </div>
    );
  };

  const renderLongTailKeywords = () => {
    if (!gptResponse || !gptResponse.longtailkeywords) {
      return (
        <div>
          <h5>7. Long Tail Keywords:</h5>
          <p>No long tail keywords information available.</p>
        </div>
      );
    }

    return (
      <div>
        <h5>7. Long Tail Keywords:</h5>
        <ul>
          {gptResponse.longtailkeywords.map((keyword, index) => (
            <li key={index}>{keyword}</li>
          ))}
        </ul>
      </div>
    );
  };

  const renderCallToActions = () => {
    if (!gptResponse || !gptResponse.call_to_actions) {
      return (
        <div>
          <h5>8. Call to Actions:</h5>
          <p>No CTA information available.</p>
        </div>
      );
    }

    return (
      <div>
        <h5>8. Call to Actions:</h5>
        <ul>
          {gptResponse.call_to_actions.map((cta, index) => (
            <li key={index}>{cta}</li>
          ))}
        </ul>
      </div>
    );
  };

  const renderCompetitorAnalysis = () => {
    if (!gptResponse || !gptResponse.competitor_analysis) {
      return (
        <div>
          <h5>9. Competitor Analysis:</h5>
          <p>No competitor information available.</p>
        </div>
      );
    }

    return (
      <div>
        <h5>9. Competitor Analysis:</h5>
        <ul>
          {gptResponse.competitor_analysis.map((competitor, index) => (
            <li key={index}><strong>{competitor.name}:</strong> {competitor.strategy}</li>
          ))}
        </ul>
      </div>
    );
  };

  // const renderVisualRecommendations = () => {
  //   if (!gptResponse || !gptResponse.visual_recommendations) {
  //     return (
  //       <div>
  //         <h5>9. Visual Recommendations:</h5>
  //         <p>No visual recommendations available.</p>
  //       </div>
  //     );
  //   }

  //   const { visual_content, video_content } = gptResponse.visual_recommendations;
  //   return (
  //     <div>
  //       <h5>9. Visual Recommendations:</h5>
  //       <p><strong>Visual Content:</strong> {visual_content}</p>
  //       <p><strong>Video Content:</strong> {video_content}</p>
  //     </div>
  //   );
  // };

  const renderConclusion = () => {
    if (!gptResponse || !gptResponse.conclusion) {
      return (
        <div>
          <h5>10. Conclusion:</h5>
          <p>No conclusion available.</p>
        </div>
      );
    }

    return (
      <div>
        <h5>10. Conclusion:</h5>
        <p>{gptResponse.conclusion}</p>
      </div>
    );
  };

  const saveAsPdf = () => {
    const doc = new jsPDF({
      unit: "cm",
      format: "a4",
      orientation: "portrait",
    });

    const content = document.getElementById("gpt-response-content");
    html2canvas(content).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 21;
      const pageHeight = 29.7;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      doc.save("ChatGpt_Response.pdf");
    });
  };

  const saveAsWord = () => {
    JsonToWord(gptResponse);
  };
  

  return (
    <div className="col-md-8 d-flex">
      <div
        className="shadow-lg p-4 bg-light rounded flex-fill d-flex flex-column"
        style={{ minHeight: "100%", width: "100%" }}
      >
        <h4>Response From ChatGpt</h4>
        <div id="gpt-response-content" style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", flex: 1 }}>
          {renderCompanyInfo() || "No company information available. \n"}
          {renderGoals() || "No goals information available. \n"}
          {renderTargetAudience() || "No target audience information available. \n"}
          {renderBudget()  || "No budget information available. \n"}
          {renderBudgetTable()  || "No budget table information available. \n"}
          {renderStrategy()  || "No Google Ads strategy information available. \n"}
          {renderKeywords() || "No keywords information available. \n"}
          {renderLongTailKeywords() || "No lohg tail keywords information available. \n"}
          {renderCallToActions()  || "No call to actions information available. \n"}
          {renderCompetitorAnalysis() || "No competitor analysis information available. \n"}
          {/* {renderVisualRecommendations() || "No visual recommendations information available. \n"} */}
          {renderConclusion() || "No conclusion information available. \n"}
        </div>
        
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-dark m-3"
            onClick={clearResponse}
          >
            Clear Response
          </button>
          <button
            type="button"
            className="btn btn-primary m-3"
            onClick={saveAsPdf}
          >
            Save as PDF
          </button>
          <button
            type="button"
            className="btn btn-primary m-3"
            onClick={saveAsWord}
          >
            Save as Word
          </button>
        </div>
      </div>
    </div>
  );
};

export default GptResponseCompany;