// import React from 'react';
// import CampaignForm from './CampaignForm003';

// function App() {
//   return (
//     <div className="App">
//       <CampaignForm />
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavbar from './components/Navbar';
import Footer from './components/Footer';
import GoogleAds from './pages/GoogleAds';
import SEO from './pages/SEO';
import SocialAds from './pages/SocialAds';
// import CampaignForm from './components/CampaignForm';

function App() {
  return (
    <Router>
      <div>
        <AppNavbar />
        <main className="container my-5">
          <Routes>
            <Route path="/" element={<GoogleAds />} />
            <Route path="/google-ads" element={<GoogleAds />} />
            <Route path="/seo" element={<SEO />} />
            <Route path="/social-ads" element={<SocialAds />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
