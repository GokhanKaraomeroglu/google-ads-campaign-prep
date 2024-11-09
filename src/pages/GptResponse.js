// import React from 'react';
// import { saveAs } from 'file-saver';
// import { jsPDF } from 'jspdf';

// const GptResponse = ({ gptResponse, setResponseGpt }) => {
//   const clearResponse = () => {
//     setResponseGpt("");
//   };

//   const saveAsPdf = () => {
//     const doc = new jsPDF();
//     doc.text(gptResponse || "Response from ChatGpt will appear here.", 10, 10);
//     doc.save("ChatGpt_Response.pdf");
//   };

//   const saveAsWord = () => {
//     const blob = new Blob(
//       [gptResponse || "Response from ChatGpt will appear here."],
//       { type: "application/msword" }
//     );
//     saveAs(blob, "ChatGpt_Response.doc");
//   };

//   return (
//     <div className="col-md-4 d-flex">
//       <div
//         className="shadow-lg p-4 bg-light rounded flex-fill d-flex flex-column"
//         style={{ minHeight: "100%", width: "100%" }}
//       >
//         <h4>Response ChatGpt</h4>
//         <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", flex: 1 }}>
//           {gptResponse || "Response from ChatGpt will appear here."}
//         </pre>
        
//         <div className="d-flex justify-content-center">
//           <button
//             type="button"
//             className="btn btn-dark m-3"
//             onClick={clearResponse}
//           >
//             Clear Response
//           </button>
//           <button
//             type="button"
//             className="btn btn-primary m-3"
//             onClick={saveAsPdf}
//           >
//             Save as PDF
//           </button>
//           <button
//             type="button"
//             className="btn btn-primary m-3"
//             onClick={saveAsWord}
//           >
//             Save as Word
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GptResponse;


import React from 'react';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';

const GptResponse = ({ gptResponse, setResponseGpt }) => {
  const clearResponse = () => {
    setResponseGpt("");
  };

  const saveAsPdf = () => {
    const doc = new jsPDF({
      unit: "cm",
      format: "a4",
      orientation: "portrait",
    });

    // Ayarlar
    const marginLeft = 2;
    const marginRight = 2;
    const marginTop = 3;
    const marginBottom = 2;
    const fontSize = 12;
    const lineHeight = 1.5;

    doc.setFont("Arial", "normal");
    doc.setFontSize(fontSize);
    doc.setLineHeightFactor(lineHeight);

    // İçerik paragraf şeklinde ekleniyor
    const text = gptResponse ||  "Can't get the response. Try again please.";
    const pageWidth = doc.internal.pageSize.getWidth() - marginLeft - marginRight;
    
    doc.text(text, marginLeft, marginTop, {
      maxWidth: pageWidth,
      align: "left",
    });
    
    doc.save("ChatGpt_Response.pdf");
  };

  const saveAsWord = () => {
    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><style>
        body { font-family: Arial; font-size: 12pt; margin-top: 3nk; margin-bottom: 2nk; line-height: 1.5; }
        p { margin: 3pt; padding: 3pt; margin-bottom: 6pt; }
      </style></head><body>
    `;

    const footer = "</body></html>";
    const content = header + `<p>${(gptResponse || "Can't get the response. Try again please.").replace(/\n/g, "</p><p>")}</p>` + footer;
    const blob = new Blob([content], { type: "application/msword" });

    saveAs(blob, "ChatGpt_Response.doc");
  };

  return (
    <div className="col-md-4 d-flex">
      <div
        className="shadow-lg p-4 bg-light rounded flex-fill d-flex flex-column"
        style={{ minHeight: "100%", width: "100%" }}
      >
        <h4>Response ChatGpt</h4>
        <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", flex: 1 }}>
          {gptResponse || "Response from ChatGpt will appear here."}
        </pre>
        
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
            className="btn btn-secondary m-3"
            onClick={saveAsWord}
          >
            Save as Word
          </button>
        </div>
      </div>
    </div>
  );
};

export default GptResponse;
