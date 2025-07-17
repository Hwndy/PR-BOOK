import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
// import Hero from './components/Hero';
import Services from './components/Services';
// import CaseStudies from './components/CaseStudies';
import About from './components/About';
import Resources from './components/Resources';
import ResourcePost from './components/ResourcePost';
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
import EbookReader from './components/EbookReader';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminRoute from './components/admin/AdminRoute';
import { AdminProvider } from './contexts/AdminContext';
import './index.css';

const App = () => {
  return (
    <HelmetProvider>
      <AdminProvider>
        <Router>
        <Routes>
          {/* Admin Routes - No Navbar/Footer */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />

          {/* E-book Reader - No Navbar/Footer */}
          <Route path="/read-book/:token" element={<EbookReader />} />

          {/* Main Website Routes - With Navbar/Footer */}
          <Route path="/*" element={
            <div className="min-h-screen">
              <Navbar />
              <Routes>
                <Route path="/" element={
                  <>
                    
                    <HomeSummary />
                    {/* <Hero /> */}
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
                <Route path="/resources" element={<Resources />} />
                <Route path="/resources/:id" element={<ResourcePost />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
              <Footer />
              <ScrollToTop />
            </div>
          } />
        </Routes>
      </Router>
    </AdminProvider>
    </HelmetProvider>
  );
};

export default App;