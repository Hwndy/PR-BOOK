import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import DashboardOverview from './components/DashboardOverview';
import OrdersManagement from './components/OrdersManagement';
import CustomersManagement from './components/CustomersManagement';
import ContentManagement from './components/ContentManagement';
import Analytics from './components/Analytics';
import PodcastManagement from './components/PodcastManagement';
import BlogManagement from './components/BlogManagement';
import EbookManagement from './components/EbookManagement';

const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Header */}
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* Page content */}
        <main className="flex-1 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="/orders" element={<OrdersManagement />} />
              <Route path="/customers" element={<CustomersManagement />} />
              <Route path="/content" element={<ContentManagement />} />
              <Route path="/blog" element={<BlogManagement />} />
              <Route path="/ebook" element={<EbookManagement />} />
              <Route path="/podcast" element={<PodcastManagement />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
