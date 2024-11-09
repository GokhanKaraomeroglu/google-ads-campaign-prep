import React from 'react';

const GptResponse = ({ gptResponse }) => {
  return (
    <div className="col-md-4 d-flex">
      <div
        className="shadow-lg p-4 bg-light rounded flex-fill"
        style={{ minHeight: "100%", width: "100%" }}
      >
        <h4>Response ChatGpt</h4>
        <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
          {gptResponse || "Response from ChatGpt will appear here."}
        </pre>
      </div>
    </div>
  );
};

export default GptResponse;