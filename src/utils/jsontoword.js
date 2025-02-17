import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  HeadingLevel,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";

export const JsonToWord = (gptResponse) => {
    const doc = new Document({
              sections: [{
          properties: {},
          children: [         
            new Paragraph({
              text: `${gptResponse.company.name} Google Ads Plan`,
              heading: HeadingLevel.HEADING_1,
              spacing: { after: 200 }
            })
          ]
        }]
      });

  console.log("doc:", doc);
  const children = [];

  // Company Information Section
  if (gptResponse.company) {
    const { name, based_in, website } = gptResponse.company;
    children.push(
      new Paragraph({
        text: "1. Company Information",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Company Name: ", bold: true }),
          new TextRun(name),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Location: ", bold: true }),
          new TextRun(based_in),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Website: ", bold: true }),
          new TextRun(website),
        ],
      })
    );
  }

  // Goals Section
  if (gptResponse.goals && gptResponse.goals.length > 0) {
    children.push(
      new Paragraph({
        text: "2. Goals",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      }),
      ...gptResponse.goals.map(
        (goal) =>
          new Paragraph({
            children: [
              new TextRun({ text: `${goal.goals}: `, bold: true }),
              new TextRun(goal.description),
            ],
            spacing: { before: 100 },
          })
      )
    );
  }

  // Target Audience Section
  if (gptResponse.target_audience) {
    const { location, occupation, age_range, gender_distribution, interests } =
      gptResponse.target_audience;
    children.push(
      new Paragraph({
        text: "3. Target Audience",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Location: ", bold: true }),
          new TextRun(location),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Occupation: ", bold: true }),
          new TextRun(occupation.join(", ")),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Age Range: ", bold: true }),
          new TextRun(age_range),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Gender Distribution: ", bold: true }),
          new TextRun(
            `Male: ${gender_distribution.male}%, Female: ${gender_distribution.female}%`
          ),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Interests: ", bold: true }),
          new TextRun(interests.join(", ")),
        ],
      })
    );
  }

// Budget Section
if (gptResponse.budget) {
  const { conversion_rate, cpc_range, initial_budget, convertion_rate_industry_benchmark } = gptResponse.budget;
  children.push(
    new Paragraph({
      text: "4. Budget",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 }
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Conversion Rate: ", bold: true }),
        new TextRun(conversion_rate)
      ],
      spacing: { before: 100 }
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "CPC Range: ", bold: true }),
        new TextRun(cpc_range)
      ],
      spacing: { before: 100 }
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Initial Budget: ", bold: true }),
        new TextRun(initial_budget)
      ],
      spacing: { before: 100 }
    }),
    new Paragraph({
      text: "Industry Benchmark Conversion Rates",
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 200, after: 100 }
    })
  );

  // Industry Benchmark verilerini paragraf olarak ekleme
  if (convertion_rate_industry_benchmark && convertion_rate_industry_benchmark.length > 0) {
    convertion_rate_industry_benchmark.forEach(benchmark => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${benchmark.title}: `, bold: true }),
            new TextRun(benchmark.description)
          ],
          spacing: { before: 100 }
        })
      );
    });
  }
}

  // Budget Table Section
  if (gptResponse.budget_table && gptResponse.budget_table.length > 0) {
    children.push(
      new Paragraph({
        text: "Estimared Budget",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      }),
      new Table({
        alignment: "center",
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
        borders: {
          top: { style: 'single', size: 1 },
          bottom: { style: 'single', size: 1 },
          left: { style: 'single', size: 1 },
          right: { style: 'single', size: 1 },
          insideHorizontal: { style: 'single', size: 1 },
          insideVertical: { style: 'single', size: 1 }
        },
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({ 
                width: { size: 15, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ text: "Monthly Budget", bold: true })]
              }),
              new TableCell({ 
                width: { size: 15, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ text: "Daily Budget", bold: true })]
              }),
              new TableCell({ 
                width: { size: 14, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ text: "Estimated CPC", bold: true })]
              }),
              new TableCell({ 
                width: { size: 14, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ text: "Estimated Clicks/Day", bold: true })]
              }),
              new TableCell({ 
                width: { size: 14, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ text: "Estimated Leads/Month", bold: true })]
              }),
              new TableCell({ 
                width: { size: 14, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ text: "Store Visits/Month", bold: true })]
              }),
              new TableCell({ 
                width: { size: 14, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ text: "Phone Calls/Month", bold: true })]
              })
            ]
          }),
          ...gptResponse.budget_table.map(row => 
            new TableRow({
              children: [
                new TableCell({ 
                  width: { size: 15, type: WidthType.PERCENTAGE },
                  children: [new Paragraph({ text: row.monthlyBudget.toString() })]
                }),
                new TableCell({ 
                  width: { size: 15, type: WidthType.PERCENTAGE },
                  children: [new Paragraph({ text: row.dailyBudget.toString() })]
                }),
                new TableCell({ 
                  width: { size: 14, type: WidthType.PERCENTAGE },
                  children: [new Paragraph({ text: row.estimatedCPC })]
                }),
                new TableCell({ 
                  width: { size: 14, type: WidthType.PERCENTAGE },
                  children: [new Paragraph({ text: row.estimatedClicksPerDay })]
                }),
                new TableCell({ 
                  width: { size: 14, type: WidthType.PERCENTAGE },
                  children: [new Paragraph({ text: row.estimatedLeadsPerMonth })]
                }),
                new TableCell({ 
                  width: { size: 14, type: WidthType.PERCENTAGE },
                  children: [new Paragraph({ text: row.estimatedLocalStoreVisitsPerMonth })]
                }),
                new TableCell({ 
                  width: { size: 14, type: WidthType.PERCENTAGE },
                  children: [new Paragraph({ text: row.estimatedPhoneCallsPerMonth })]
                })
              ]
            })
          )
        ]
      })
    );
  }

// Strategy Section
if (gptResponse.ads_strategy) {
  const { strategy, types_of_campaigns } = gptResponse.ads_strategy;
  children.push(
    new Paragraph({
      text: "5. Google Ads Strategy",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 }
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Conversion Rate: ", bold: true }),
        new TextRun(strategy)
      ],
      spacing: { before: 100 }
    }),
  );

  // Campaigns sub section
  if (types_of_campaigns && types_of_campaigns.length > 0) {
    types_of_campaigns.forEach(campaign => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${campaign.campaign_type}: `, bold: true }),
            new TextRun(campaign.description)
          ],
          spacing: { before: 100 }
        })
      );
    });
  }
}

  // Keywords Section
  if (gptResponse.keywords && gptResponse.keywords.length > 0) {
    children.push(
      new Paragraph({
        text: "6. Keywords",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      }),
      ...gptResponse.keywords.map(
        (keyword) =>
          new Paragraph({
            text: `• ${keyword}`,
            spacing: { before: 100 },
          })
      )
    );
  }

  // Long Tail Keywords Section
  if (gptResponse.longtailkeywords && gptResponse.longtailkeywords.length > 0) {
    children.push(
      new Paragraph({
        text: "7. Long Tail Keywords",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      }),
      ...gptResponse.longtailkeywords.map(
        (keyword) =>
          new Paragraph({
            text: `• ${keyword}`,
            spacing: { before: 100 },
          })
      )
    );
  }
  // Call To Action Section
  if (gptResponse.call_to_actions && gptResponse.call_to_actions.length > 0) {
    children.push(
      new Paragraph({
        text: "8. Call To Actions",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      }),
      ...gptResponse.call_to_actions.map(
        (cta) =>
          new Paragraph({
            text: `• ${cta}`,
            spacing: { before: 100 },
          })
      )
    );
  }
  // Competitor Analysis Section

  if (gptResponse.competitor_analysis && gptResponse.competitor_analysis > 0) {
    children.push(
      new Paragraph({
        text: "9. Competitor Analysis",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      }),
      ...gptResponse.competitor_analysis.map(
        (competitor) =>
          new Paragraph({
            text: `• ${competitor.name}, ${competitor.strategy}.`,
            spacing: { before: 100 },
          })
      )
    );
  }
  
  // Conclusion Section
  if (gptResponse.conclusion) {
    children.push(
      new Paragraph({
        text: "10. Conclusion",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      }),
      new Paragraph({
        text: gptResponse.conclusion,
        spacing: { before: 100 },
      })
    );
  }

// Tüm içeriği tek bir bölümde topluyoruz
  // doc.addSection({
  //   properties: {},
  //   children: children
  // });
doc.addSection({ children });

  return Packer.toBlob(doc).then((blob) => {
    saveAs(blob, "Google_Ads_Plan.docx");
  });
};

export default JsonToWord;
