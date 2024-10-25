# AdvertiseAI App for Google Ads

This React app is designed to create text assets required for ad preparation. The app allows users to input campaign information, product details, and specific requirements for various ad text components such as headlines, descriptions, and search terms. The form also provides the option to request a visual document for the campaign, which includes detailed product information and customizable sections for campaign visuals.

## Features

- **Company and Campaign Information**: Input fields for company details and campaign specifications.
- **Product Information**: Ability to add multiple products, each with its name, data, and URL.
- **Demand Specifications**: Allows selection of specific ad text requirements like character length for headlines, descriptions, and search terms.
- **Visual Request Document**: Generate a document specifying product images, key campaign messages, and other visual requests.

## Technologies

- **React**: For building the user interface and managing state.
- **Bootstrap**: For styling and layout.
- **Axios**: For API communication to generate content via OpenAI's API.

## Setup

### Prerequisites

Ensure that you have the following installed on your machine:
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/GokhanKaraomeroglu/google-ads-campaign-prep.git
    cd google-ads-campaign-prep
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:

   Create a `.env` file in the root directory with the following variable:
   ```plaintext
   REACT_APP_GPT_API_KEY=your_openai_api_key

4. Start the application:
    npm start

5. Open http://localhost:3000 in your browser to view the app.

## Usage
**Fill out Company Info:** Enter the name and URL of the company.
**Provide Campaign Details:** Input campaign name, type, final URL, goal, target audience, and focus points.
**Add Products:** For each product, enter its name, relevant data, and URL. You can add multiple products and remove them as needed.
**Specify Demand Requirements:**
Check the boxes and specify the numbers for various ad text components such as:
    30-character headlines
    90-character long headlines
    60-character descriptions
    90-character descriptions
    Search terms
Check the "Visual Request Document" if you need a document outlining image and video requirements.
**Submit:** Press "Submit" to generate the ad content. The response will appear on the right side of the screen.

## Project Structure
src
├── components
│   └── CampaignForm.js   # Main component with the campaign preparation form
├── App.js                # Main application file
└── index.js              # ReactDOM render and application entry point

## Dependencies
**axios:** For making API requests to OpenAI's API.
**bootstrap:** For styling the form and layout.
**react-bootstrap:** For responsive design.
**dotenv:** To manage environment variables.

## License
This project is licensed under the MIT License.
