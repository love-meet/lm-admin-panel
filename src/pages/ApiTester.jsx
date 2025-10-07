import React, { useState, useEffect } from 'react';
import adminApi from '../api/admin';
import { toast } from 'sonner';

const ApiTester = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const testEndpoints = [
    // User endpoints
    { name: 'getAllUsers', method: () => adminApi.getAllUsers() },
    { name: 'getUserById', method: () => adminApi.getUserById('test-user-id'), skip: true }, // Needs valid ID
    { name: 'updateUser', method: () => adminApi.updateUser('test-user-id', { name: 'Test' }), skip: true },
    { name: 'deleteUser', method: () => adminApi.deleteUser('test-user-id'), skip: true },
    { name: 'disableUser', method: () => adminApi.disableUser('test-user-id'), skip: true },
    { name: 'enableUser', method: () => adminApi.enableUser('test-user-id'), skip: true },
    { name: 'verifyUser', method: () => adminApi.verifyUser('test-user-id'), skip: true },
    { name: 'unverifyUser', method: () => adminApi.unverifyUser('test-user-id'), skip: true },

    // Notification endpoints
    { name: 'getNotificationCount', method: () => adminApi.getNotificationCount('test-user-id'), skip: true },
    { name: 'getNotificationsList', method: () => adminApi.getNotificationsList('test-user-id'), skip: true },

    // Transaction endpoints
    { name: 'getTransactions', method: () => adminApi.getTransactions() },
    { name: 'getTransactionById', method: () => adminApi.getTransactionById('test-txn-id'), skip: true },
    { name: 'refundTransaction', method: () => adminApi.refundTransaction('test-txn-id'), skip: true },

    // Reports endpoints
    { name: 'getReports', method: () => adminApi.getReports() },

    // Posts endpoints
    { name: 'getAllPosts', method: () => adminApi.getAllPosts() },
    { name: 'getPostById', method: () => adminApi.getPostById('test-post-id'), skip: true },
    { name: 'moderatePost', method: () => adminApi.moderatePost('test-post-id', { action: 'test' }), skip: true },
    { name: 'deletePost', method: () => adminApi.deletePost('test-post-id'), skip: true },

    // Stats endpoints
    { name: 'getStats', method: () => adminApi.getStats() },
    { name: 'getStatsList', method: () => adminApi.getStatsList('users') },

    // Dashboard endpoints
    { name: 'getDashboardTotalUsers', method: () => adminApi.getDashboardTotalUsers() },
    { name: 'getDashboardPostsToday', method: () => adminApi.getDashboardPostsToday() },
    { name: 'getDashboardNewSignups', method: () => adminApi.getDashboardNewSignups() },
    { name: 'getDashboardUserGrowth', method: () => adminApi.getDashboardUserGrowth() },
    { name: 'getDashboardSummary', method: () => adminApi.getDashboardSummary() },
    { name: 'getDashboardSubscriptionRevenue', method: () => adminApi.getDashboardSubscriptionRevenue() },
    { name: 'getUserGrowth', method: () => adminApi.getUserGrowth() },
    { name: 'getSubscriptionRevenue', method: () => adminApi.getSubscriptionRevenue() },
    { name: 'getDashboardStatistics', method: () => adminApi.getDashboardStatistics() },
    { name: 'getDashboardReportsDaily', method: () => adminApi.getDashboardReportsDaily() },
    { name: 'getDashboardReportsMonthly', method: () => adminApi.getDashboardReportsMonthly() },
  ];

  const runAllTests = async () => {
    setLoading(true);
    setTestResults({});
    setProgress(0);

    const results = {};
    const executableEndpoints = testEndpoints.filter(endpoint => !endpoint.skip);
    const totalTests = executableEndpoints.length;

    for (let i = 0; i < executableEndpoints.length; i++) {
      const endpoint = executableEndpoints[i];
      setProgress(((i + 1) / totalTests) * 100);

      try {
        console.log(`Testing ${endpoint.name}...`);
        const startTime = Date.now();
        const response = await endpoint.method();
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        results[endpoint.name] = {
          status: 'success',
          responseTime: `${responseTime}ms`,
          data: response,
          timestamp: new Date().toISOString()
        };

        console.log(`✅ ${endpoint.name} succeeded:`, response);

        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        results[endpoint.name] = {
          status: 'error',
          error: error.message,
          response: error.response?.data,
          timestamp: new Date().toISOString()
        };
        console.error(`❌ ${endpoint.name} failed:`, error);
      }
    }

    setTestResults(results);
    setLoading(false);
    setProgress(0);

    // Calculate success rate
    const successfulTests = Object.values(results).filter(result => result.status === 'success').length;
    const successRate = (successfulTests / totalTests) * 100;

    toast.success(`API Tests Complete: ${successfulTests}/${totalTests} passed (${successRate.toFixed(1)}%)`);
  };

  const runSingleTest = async (endpointName) => {
    const endpoint = testEndpoints.find(ep => ep.name === endpointName);
    if (!endpoint) return;

    try {
      console.log(`Testing single endpoint: ${endpointName}`);
      const startTime = Date.now();
      const response = await endpoint.method();
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      setTestResults(prev => ({
        ...prev,
        [endpointName]: {
          status: 'success',
          responseTime: `${responseTime}ms`,
          data: response,
          timestamp: new Date().toISOString()
        }
      }));

      toast.success(`${endpointName} ✅ Success (${responseTime}ms)`);
      console.log(`✅ ${endpointName} succeeded:`, response);

    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [endpointName]: {
          status: 'error',
          error: error.message,
          response: error.response?.data,
          timestamp: new Date().toISOString()
        }
      }));

      toast.error(`${endpointName} ❌ Failed: ${error.message}`);
      console.error(`❌ ${endpointName} failed:`, error);
    }
  };

  const getStatusColor = (status) => {
    return status === 'success' ? 'text-green-500' : 'text-red-500';
  };

  const getStatusIcon = (status) => {
    return status === 'success' ? '✅' : '❌';
  };

  return (
    <div className="p-6 bg-[var(--color-bg-primary)] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
            API Endpoint Tester
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Test all your admin API endpoints in one place
          </p>
        </div>

        {/* Controls */}
        <div className="bg-[var(--color-bg-secondary)] rounded-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div>
              <button
                onClick={runAllTests}
                disabled={loading}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? `Running Tests... ${Math.round(progress)}%` : 'Run All Tests'}
              </button>
              <span className="ml-4 text-sm text-[var(--color-text-secondary)]">
                {testEndpoints.filter(ep => !ep.skip).length} testable endpoints
              </span>
            </div>

            {loading && (
              <div className="w-64 bg-[var(--color-bg-tertiary)] rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}

            <div className="text-sm text-[var(--color-text-secondary)]">
              {Object.values(testResults).filter(r => r.status === 'success').length} passed /{' '}
              {Object.values(testResults).filter(r => r.status === 'error').length} failed
            </div>
          </div>
        </div>

        {/* Progress Bar for individual tests */}
        {loading && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-[var(--color-text-secondary)] mb-1">
              <span>Testing endpoints...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-[var(--color-bg-tertiary)] rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="grid grid-cols-1 gap-4">
          {testEndpoints.map((endpoint) => (
            <div
              key={endpoint.name}
              className="bg-[var(--color-bg-secondary)] rounded-lg p-4 border border-[var(--color-bg-tertiary)]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={`text-lg ${getStatusColor(testResults[endpoint.name]?.status)}`}>
                    {testResults[endpoint.name] ? getStatusIcon(testResults[endpoint.name].status) : '⏳'}
                  </span>
                  <div>
                    <h3 className="font-semibold text-[var(--color-text-primary)]">
                      {endpoint.name}
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {endpoint.skip ? '🔒 Requires specific ID' : 'Click to test individually'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {testResults[endpoint.name] && (
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      {testResults[endpoint.name].responseTime}
                    </span>
                  )}

                  {!endpoint.skip && (
                    <button
                      onClick={() => runSingleTest(endpoint.name)}
                      disabled={loading}
                      className="px-3 py-1 bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] rounded text-sm hover:bg-[var(--color-bg-primary)] disabled:opacity-50"
                    >
                      Test
                    </button>
                  )}
                </div>
              </div>

              {/* Test Results */}
              {testResults[endpoint.name] && (
                <div className="mt-3 p-3 bg-[var(--color-bg-tertiary)] rounded text-sm">
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <strong>Status:</strong>{' '}
                      <span className={getStatusColor(testResults[endpoint.name].status)}>
                        {testResults[endpoint.name].status.toUpperCase()}
                      </span>
                    </div>

                    {testResults[endpoint.name].responseTime && (
                      <div>
                        <strong>Response Time:</strong> {testResults[endpoint.name].responseTime}
                      </div>
                    )}

                    {testResults[endpoint.name].error && (
                      <div>
                        <strong>Error:</strong>{' '}
                        <span className="text-red-500">{testResults[endpoint.name].error}</span>
                      </div>
                    )}

                    {testResults[endpoint.name].data && (
                      <div>
                        <strong>Response Preview:</strong>
                        <pre className="mt-1 p-2 bg-black/20 rounded overflow-x-auto text-xs">
                          {JSON.stringify(testResults[endpoint.name].data, null, 2)}
                        </pre>
                      </div>
                    )}

                    <div className="text-xs text-[var(--color-text-secondary)]">
                      {testResults[endpoint.name].timestamp}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary */}
        {Object.keys(testResults).length > 0 && (
          <div className="mt-8 bg-[var(--color-bg-secondary)] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
              Test Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-500/20 rounded-lg">
                <div className="text-2xl font-bold text-green-500">
                  {Object.values(testResults).filter(r => r.status === 'success').length}
                </div>
                <div className="text-sm text-[var(--color-text-secondary)]">Passed</div>
              </div>
              <div className="text-center p-4 bg-red-500/20 rounded-lg">
                <div className="text-2xl font-bold text-red-500">
                  {Object.values(testResults).filter(r => r.status === 'error').length}
                </div>
                <div className="text-sm text-[var(--color-text-secondary)]">Failed</div>
              </div>
              <div className="text-center p-4 bg-blue-500/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-500">
                  {testEndpoints.filter(ep => !ep.skip).length}
                </div>
                <div className="text-sm text-[var(--color-text-secondary)]">Testable</div>
              </div>
              <div className="text-center p-4 bg-yellow-500/20 rounded-lg">
                <div className="text-2xl font-bold text-yellow-500">
                  {testEndpoints.filter(ep => ep.skip).length}
                </div>
                <div className="text-sm text-[var(--color-text-secondary)]">Skipped</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiTester;