import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
// import CaseStudies from './components/CaseStudies';
import About from './components/About';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Book from './components/Book';
import BookPage from './components/BookPage';
import PaymentPage from './components/PaymentPage';
import PaymentSuccess from './components/PaymentSuccess';
import Speaking from './components/Speaking';
import Podcast from './components/Podcast';
import HomeSummary from './components/HomeSummary';
import ScrollToTop from './components/ScrollToTop';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <HomeSummary />
              <Book />
              <Services />
              {/* <CaseStudies /> */}
            </>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/podcast" element={<Podcast />} />
          <Route path="/book" element={<BookPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/speaking" element={<Speaking />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
        <ScrollToTop />
      </div>
    </Router>
  );
}

export default App;