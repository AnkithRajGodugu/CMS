import React from 'react';
import { useTheme } from '../../../../context/SectorThemeProvider';
import { Card, CardHeader, CardTitle, CardContent } from '../Card';

const BankingDashboard = () => {
  const { currentTheme } = useTheme();

  const metrics = [
    { title: 'Total Accounts', value: '2,847', change: '+12%' },
    { title: 'Active Loans', value: '$2.4M', change: '+8%' },
    { title: 'Deposits', value: '$18.7M', change: '+15%' },
    { title: 'Risk Score', value: '94/100', change: '+2%' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: currentTheme.colors.primary }}>
                {metric.value}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{metric.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((_, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Transaction #{1000 + index}</p>
                    <p className="text-sm text-muted-foreground">Account: ****1234</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$1,250.00</p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>KYC Compliance</span>
                <span className="text-green-600 font-medium">98%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>AML Screening</span>
                <span className="text-green-600 font-medium">100%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Risk Assessment</span>
                <span className="text-yellow-600 font-medium">94%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Regulatory Reports</span>
                <span className="text-green-600 font-medium">Up to date</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BankingDashboard;