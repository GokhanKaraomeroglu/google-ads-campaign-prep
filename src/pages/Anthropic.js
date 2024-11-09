import React from 'react';

const Anthropic = ({ anthResponse, setResponseAnth }) => {
  const clearResponse = () => {
    setResponseAnth("");
  };

  return (
    <div className="col-md-4 mt-5 d-flex">
      <div
        className="shadow-lg p-4 bg-light rounded flex-fill d-flex flex-column"
        style={{ minHeight: "100%", width: "100%" }}
      >
        <h4>Response From Anthropic AI</h4>
        <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", flex: 1 }}>
          {anthResponse || "Response from Anthropic AI will appear here."}
        </pre>
        
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-dark m-3"
            onClick={clearResponse}
          >
            Clear Response
          </button>
        </div>
      </div>
    </div>
  );
};

export default Anthropic;