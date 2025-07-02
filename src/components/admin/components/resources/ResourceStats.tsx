import React from 'react';
import { 
  FileText, 
  RefreshCw, 
  Calendar, 
  TrendingUp, 
  Plus, 
  ExternalLink 
} from 'lucide-react';
import { ResourceStatsProps } from './types';

const ResourceStats: React.FC<ResourceStatsProps> = ({
  stats,
  loading,
  refreshing,
  onRefresh,
  onCreateNew
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading resource management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Resource Management</h2>
          <p className="text-gray-600">Create and manage PR resources and insights</p>
        </div>
        <button
          onClick={onCreateNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Resource
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Resources</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalPosts || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Engagement</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalEngagement || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Last Updated</p>
              <p className="text-sm font-bold text-gray-900">
                {stats?.lastUpdated ? new Date(stats.lastUpdated).toLocaleDateString() : 'Never'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* LinkedIn Connection Status */}
      {stats?.linkedinConnected && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ExternalLink className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  LinkedIn Connected
                </p>
                <p className="text-sm text-blue-700">
                  Syncing posts from {stats.profileName || 'LinkedIn profile'}
                </p>
              </div>
            </div>
            {stats.profileUrl && (
              <a
                href={stats.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View Profile
              </a>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceStats;
