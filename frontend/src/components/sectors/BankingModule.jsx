import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SectorLayout, StatCard, ChartWidget, chartColors } from '../shared';
import { DollarSign, TrendingUp, Users, CreditCard } from 'lucide-react';

const BankingDashboard = () => {
  const sector = {
    code: 'banking',
    name: 'Banking & Finance',
    description: 'Financial services and banking solutions'
  };

  // Sample chart data
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Transactions',
        data: [1200, 1900, 1500, 2500, 2200, 3000],
        borderColor: chartColors.primary[0],
        backgroundColor: chartColors.primary[0].replace('0.8', '0.2'),
        fill: true,
        tension: 0.4
      }
    ]
  };

  return (
    <SectorLayout sector={sector}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Banking Dashboard</h1>
          <p className="text-base-content/60">
            Welcome to the Banking & Finance sector. Monitor your financial operations.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Balance"
            value="$125.4K"
            subtitle="Across all accounts"
            trend={{ value: '+12%', direction: 'up' }}
            icon={DollarSign}
            variant="primary"
          />
          <StatCard
            title="Transactions"
            value="3,456"
            subtitle="This month"
            trend={{ value: '+8%', direction: 'up' }}
            icon={TrendingUp}
            variant="success"
          />
          <StatCard
            title="Active Accounts"
            value="234"
            subtitle="Customer accounts"
            icon={Users}
            variant="info"
          />
          <StatCard
            title="Pending"
            value="12"
            subtitle="Awaiting approval"
            icon={CreditCard}
            variant="warning"
          />
        </div>

        {/* Chart */}
        <ChartWidget
          type="line"
          data={chartData}
          title="Transaction Volume"
          subtitle="Monthly transaction trends"
          height="350px"
        />
      </div>
    </SectorLayout>
  );
};

const BankingModule = () => {
  return (
    <Routes>
      <Route path="/" element={<BankingDashboard />} />
      <Route path="/dashboard" element={<BankingDashboard />} />
    </Routes>
  );
};

export default BankingModule;
