import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Calendar,
  BarChart3,
  PieChart
} from 'lucide-react';
import { apiClient } from '../../../utils/api';

interface AnalyticsData {
  revenue: {
    total: number;
    monthly: number[];
    growth: number;
  };
  orders: {
    total: number;
    monthly: number[];
    growth: number;
  };
  customers: {
    total: number;
    new: number;
    returning: number;
  };
  conversion: {
    rate: number;
    trend: number;
  };
}

const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    revenue: { total: 0, monthly: [], growth: 0 },
    orders: { total: 0, monthly: [], growth: 0 },
    customers: { total: 0, new: 0, returning: 0 },
    conversion: { rate: 0, trend: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('12months');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const data = await apiClient.getAnalytics(timeRange);
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Track performance and business metrics</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="3months">Last 3 Months</option>
          <option value="12months">Last 12 Months</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ₦{analytics.revenue.total.toLocaleString()}
              </p>
              <div className={`flex items-center mt-2 ${getGrowthColor(analytics.revenue.growth)}`}>
                {getGrowthIcon(analytics.revenue.growth)}
                <span className="ml-1 text-sm font-medium">
                  {Math.abs(analytics.revenue.growth).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-green-500">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {analytics.orders.total.toLocaleString()}
              </p>
              <div className={`flex items-center mt-2 ${getGrowthColor(analytics.orders.growth)}`}>
                {getGrowthIcon(analytics.orders.growth)}
                <span className="ml-1 text-sm font-medium">
                  {Math.abs(analytics.orders.growth).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-blue-500">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {analytics.customers.total.toLocaleString()}
              </p>
              <div className="flex items-center mt-2 text-blue-600">
                <Users className="h-4 w-4" />
                <span className="ml-1 text-sm font-medium">
                  {analytics.customers.new} new
                </span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-purple-500">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {analytics.conversion.rate.toFixed(1)}%
              </p>
              <div className={`flex items-center mt-2 ${getGrowthColor(analytics.conversion.trend)}`}>
                {getGrowthIcon(analytics.conversion.trend)}
                <span className="ml-1 text-sm font-medium">
                  {Math.abs(analytics.conversion.trend).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-yellow-500">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <BarChart3 className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue</h3>
          </div>
          <div className="space-y-3">
            {analytics.revenue.monthly.map((revenue, index) => {
              const maxRevenue = Math.max(...analytics.revenue.monthly);
              const percentage = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
              
              return (
                <div key={index} className="flex items-center">
                  <div className="w-12 text-sm text-gray-600">
                    {months[index]}
                  </div>
                  <div className="flex-1 mx-3">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-20 text-sm text-gray-900 text-right">
                    ₦{revenue.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <PieChart className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Monthly Orders</h3>
          </div>
          <div className="space-y-3">
            {analytics.orders.monthly.map((orders, index) => {
              const maxOrders = Math.max(...analytics.orders.monthly);
              const percentage = maxOrders > 0 ? (orders / maxOrders) * 100 : 0;
              
              return (
                <div key={index} className="flex items-center">
                  <div className="w-12 text-sm text-gray-600">
                    {months[index]}
                  </div>
                  <div className="flex-1 mx-3">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-16 text-sm text-gray-900 text-right">
                    {orders}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Customer Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <Users className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Customer Breakdown</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {analytics.customers.total}
            </div>
            <div className="text-sm text-gray-600">Total Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {analytics.customers.new}
            </div>
            <div className="text-sm text-gray-600">New Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {analytics.customers.returning}
            </div>
            <div className="text-sm text-gray-600">Returning Customers</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
