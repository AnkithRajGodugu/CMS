import React, { useState } from 'react';
import {
  SectorLayout,
  DataTable,
  StatCard,
  ChartWidget,
  FormBuilder,
  chartColors
} from '../components/shared';
import { Users, DollarSign, TrendingUp, Package } from 'lucide-react';

/**
 * ComponentShowcase - Demo page to showcase shared UI components
 */
const ComponentShowcase = () => {
  const [formData, setFormData] = useState(null);

  // Mock sector data
  const sector = {
    code: 'banking',
    name: 'Banking & Finance',
    description: 'Financial services and banking solutions'
  };

  // Sample data for DataTable
  const tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'Manager', status: 'Active' },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'User', status: 'Active' },
  ];

  const tableColumns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`badge ${value === 'Active' ? 'badge-success' : 'badge-error'}`}>
          {value}
        </span>
      )
    },
  ];

  // Sample data for ChartWidget
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        borderColor: chartColors.primary[0],
        backgroundColor: chartColors.primary[0].replace('0.8', '0.2'),
        fill: true,
        tension: 0.4
      }
    ]
  };

  const barChartData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Sales',
        data: [65, 59, 80, 81],
        backgroundColor: chartColors.mixed
      }
    ]
  };

  const pieChartData = {
    labels: ['Banking', 'Healthcare', 'Logistics', 'Content'],
    datasets: [
      {
        data: [30, 25, 25, 20],
        backgroundColor: chartColors.mixed
      }
    ]
  };

  // Form fields configuration
  const formFields = [
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      placeholder: 'Enter username',
      required: true,
      validation: {
        minLength: { value: 3, message: 'Username must be at least 3 characters' }
      }
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter email',
      required: true,
      validation: {
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Invalid email address'
        }
      }
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      required: true,
      options: [
        { value: 'user', label: 'User' },
        { value: 'admin', label: 'Admin' },
        { value: 'manager', label: 'Manager' }
      ]
    },
    {
      name: 'bio',
      label: 'Bio',
      type: 'textarea',
      placeholder: 'Tell us about yourself',
      rows: 4
    },
    {
      name: 'notifications',
      label: 'Enable email notifications',
      type: 'checkbox'
    }
  ];

  const handleFormSubmit = (data) => {
    console.log('Form submitted:', data);
    setFormData(data);
    alert('Form submitted successfully! Check console for data.');
  };

  return (
    <SectorLayout sector={sector}>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-base-content mb-2">
            Component Showcase
          </h1>
          <p className="text-base-content/60">
            Demo of all shared UI components in the sector architecture framework
          </p>
        </div>

        {/* StatCards Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Stat Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Users"
              value="1,234"
              subtitle="Active users this month"
              trend={{ value: '+12%', direction: 'up' }}
              icon={Users}
              variant="primary"
            />
            <StatCard
              title="Revenue"
              value="$45.2K"
              subtitle="Total revenue"
              trend={{ value: '+8%', direction: 'up' }}
              icon={DollarSign}
              variant="success"
            />
            <StatCard
              title="Growth Rate"
              value="23%"
              subtitle="Year over year"
              trend={{ value: '-3%', direction: 'down' }}
              icon={TrendingUp}
              variant="warning"
            />
            <StatCard
              title="Products"
              value="567"
              subtitle="In inventory"
              trend={{ value: '0%', direction: 'neutral' }}
              icon={Package}
              variant="info"
            />
          </div>
        </section>

        {/* Charts Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Charts</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartWidget
              type="line"
              data={lineChartData}
              title="Revenue Trend"
              subtitle="Monthly revenue over time"
              height="300px"
            />
            <ChartWidget
              type="bar"
              data={barChartData}
              title="Quarterly Sales"
              subtitle="Sales performance by quarter"
              height="300px"
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <ChartWidget
              type="pie"
              data={pieChartData}
              title="Sector Distribution"
              subtitle="Users by sector"
              height="300px"
            />
            <ChartWidget
              type="doughnut"
              data={pieChartData}
              title="Market Share"
              subtitle="Distribution across sectors"
              height="300px"
            />
          </div>
        </section>

        {/* DataTable Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Data Table</h2>
          <DataTable
            data={tableData}
            columns={tableColumns}
            pageSize={3}
            searchable={true}
          />
        </section>

        {/* FormBuilder Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Form Builder</h2>
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <FormBuilder
                fields={formFields}
                onSubmit={handleFormSubmit}
                submitLabel="Create User"
              />
              {formData && (
                <div className="mt-4 p-4 bg-success/10 rounded-lg">
                  <h3 className="font-bold text-success mb-2">Form Data:</h3>
                  <pre className="text-sm">{JSON.stringify(formData, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </SectorLayout>
  );
};

export default ComponentShowcase;
