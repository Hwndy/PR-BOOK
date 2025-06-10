import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Shield, 
  Users, 
  Clock, 
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Eye,
  Lock,
  Activity
} from 'lucide-react';

interface EbookStats {
  activeSessions: number;
  totalTokens: number;
  expiredTokens: number;
  validTokens: number;
}

const EbookManagement: React.FC = () => {
  const [stats, setStats] = useState<EbookStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [newTokenEmail, setNewTokenEmail] = useState('');
  const [newTokenReference, setNewTokenReference] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/ebook/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        // Fallback stats
        setStats({
          activeSessions: 0,
          totalTokens: 0,
          expiredTokens: 0,
          validTokens: 0
        });
      }
    } catch (error) {
      console.error('Error fetching e-book stats:', error);
      setStats({
        activeSessions: 0,
        totalTokens: 0,
        expiredTokens: 0,
        validTokens: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = async () => {
    try {
      setRefreshing(true);
      await fetchStats();
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setRefreshing(false);
    }
  };

  const generateReadingUrl = async () => {
    try {
      if (!newTokenEmail || !newTokenReference) {
        alert('Please enter both email and order reference');
        return;
      }

      const response = await fetch('http://localhost:5000/api/ebook/generate-reading-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: newTokenEmail,
          orderReference: newTokenReference,
          productName: 'The Science of Public Relations (Digital Edition)'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedUrl(data.readingUrl);
        setNewTokenEmail('');
        setNewTokenReference('');
        await fetchStats();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error generating reading URL:', error);
      alert('Failed to generate reading URL');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('URL copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">E-book Management</h2>
          <p className="text-gray-600">Manage secure e-book access and reading sessions</p>
        </div>
        <button
          onClick={refreshStats}
          disabled={refreshing}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Stats'}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Sessions</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats?.activeSessions || 0}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valid Tokens</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats?.validTokens || 0}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tokens</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.totalTokens || 0}</p>
            </div>
            <div className="p-3 rounded-full bg-gray-100">
              <BookOpen className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expired Tokens</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats?.expiredTokens || 0}</p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <Clock className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Generate Reading URL */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Reading URL</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Email
            </label>
            <input
              type="email"
              value={newTokenEmail}
              onChange={(e) => setNewTokenEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="customer@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Reference
            </label>
            <input
              type="text"
              value={newTokenReference}
              onChange={(e) => setNewTokenReference(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="PRE_ORDER_123456"
            />
          </div>
        </div>
        
        <button
          onClick={generateReadingUrl}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate Secure Reading URL
        </button>
        
        {generatedUrl && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Reading URL Generated!</h4>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={generatedUrl}
                readOnly
                className="flex-1 px-3 py-2 bg-white border border-green-300 rounded text-sm"
              />
              <button
                onClick={() => copyToClipboard(generatedUrl)}
                className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors"
              >
                Copy
              </button>
              <a
                href={generatedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Test
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Security Features */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Features</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Shield className="h-5 w-5 text-blue-600 mr-2" />
              Anti-Sharing Protection
            </h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Device fingerprinting prevents link sharing</li>
              <li>• Session validation on every access</li>
              <li>• Automatic session termination on device mismatch</li>
              <li>• Maximum 1 concurrent session per purchase</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Lock className="h-5 w-5 text-green-600 mr-2" />
              Content Protection
            </h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• PDF served with security headers</li>
              <li>• No download or copy functionality</li>
              <li>• Right-click and keyboard shortcuts disabled</li>
              <li>• Time-limited access (24 hours)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              E-book Access Instructions
            </h4>
            <div className="text-sm text-blue-700">
              <p className="mb-3">
                <strong>Automatic Process:</strong> Reading URLs are automatically generated and sent via email when customers purchase digital editions.
              </p>
              <p className="mb-2"><strong>Manual Generation:</strong> Use the form above to manually create reading URLs for customer support cases.</p>
              <p className="mb-2"><strong>Security:</strong> Each URL is unique, time-limited, and tied to the customer's device for maximum security.</p>
              <p><strong>Support:</strong> If customers report access issues, generate a new URL rather than troubleshooting the existing one.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={refreshStats}
            disabled={refreshing}
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-6 w-6 text-blue-600 mr-3 ${refreshing ? 'animate-spin' : ''}`} />
            <div className="text-left">
              <p className="font-medium text-blue-900">Refresh Statistics</p>
              <p className="text-sm text-blue-600">Update session and token counts</p>
            </div>
          </button>

          <a
            href="/orders"
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Users className="h-6 w-6 text-green-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-green-900">View Orders</p>
              <p className="text-sm text-green-600">Check e-book purchase history</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default EbookManagement;
