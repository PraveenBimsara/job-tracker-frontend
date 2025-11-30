import Navbar from '../components/layout/Navbar';
import { useJobs } from '../hooks/useJobs';
import Loader from '../components/common/Loader';
import { BarChart3, TrendingUp, Calendar, Target } from 'lucide-react';

const Analytics = () => {
  const { jobs, analytics, loading } = useJobs();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  const totalJobs = analytics?.total || 0;
  const statusData = analytics?.byStatus || {};
  const priorityData = analytics?.byPriority || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics & Insights</h1>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Target className="text-primary-600" size={20} />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Total Applications</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalJobs}</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-blue-600" size={20} />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Applied</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{statusData['Applied'] || 0}</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Calendar className="text-yellow-600" size={20} />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Interviews</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{statusData['Interview'] || 0}</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="text-green-600" size={20} />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Offers</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{statusData['Offer'] || 0}</p>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications by Status</h3>
            <div className="space-y-3">
              {Object.entries(statusData).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-gray-700">{status}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${totalJobs > 0 ? (count / totalJobs) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-900 font-semibold w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
              {Object.keys(statusData).length === 0 && (
                <p className="text-gray-500 text-center py-4">No data yet</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
            <div className="space-y-3">
              {Object.entries(priorityData).map(([priority, count]) => (
                <div key={priority} className="flex items-center justify-between">
                  <span className="text-gray-700">{priority} Priority</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          priority === 'High'
                            ? 'bg-red-600'
                            : priority === 'Medium'
                            ? 'bg-yellow-600'
                            : 'bg-gray-600'
                        }`}
                        style={{ width: `${totalJobs > 0 ? (count / totalJobs) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-900 font-semibold w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
              {Object.keys(priorityData).length === 0 && (
                <p className="text-gray-500 text-center py-4">No data yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          {analytics?.recentActivity?.length > 0 ? (
            <div className="space-y-3">
              {analytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{activity.company}</p>
                    <p className="text-sm text-gray-600">{activity.position}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{activity.status}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;