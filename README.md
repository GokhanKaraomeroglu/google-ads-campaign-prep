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
