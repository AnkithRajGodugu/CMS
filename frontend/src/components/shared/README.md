# Shared UI Component Library

This directory contains reusable UI components for the sector architecture framework. These components provide consistent design, accessibility, and functionality across all sector modules.

## Components

### 1. SectorLayout

A responsive layout component that provides the main structure for sector-specific pages.

**Features:**
- Responsive header with sector branding
- Collapsible sidebar navigation
- Main content area with proper spacing
- Sector-specific theming support
- Accessibility compliant (ARIA labels, keyboard navigation)

**Usage:**
```jsx
import { SectorLayout } from '../components/shared';

const MyPage = () => {
  const sector = {
    code: 'banking',
    name: 'Banking & Finance',
    description: 'Financial services'
  };

  return (
    <SectorLayout sector={sector}>
      <h1>My Page Content</h1>
    </SectorLayout>
  );
};
```

### 2. SectorHeader

Header component with sector branding, user profile, and notifications.

**Features:**
- Sector icon and name display
- User profile dropdown with logout
- Notification bell with badge
- Sidebar toggle button
- Responsive design

**Props:**
- `sector` - Sector object with code, name, description
- `onToggleSidebar` - Function to toggle sidebar
- `sidebarCollapsed` - Boolean for sidebar state

### 3. SectorSidebar

Collapsible navigation sidebar with sector-specific menu items.

**Features:**
- Sector-specific navigation menus
- Active route highlighting
- Collapsible/expandable
- Icon support for menu items
- Mobile-friendly with overlay

**Props:**
- `sector` - Sector object
- `collapsed` - Boolean for collapsed state
- `onToggle` - Function to toggle sidebar

### 4. DataTable

Reusable table component with sorting, filtering, and pagination.

**Features:**
- Column sorting (ascending/descending)
- Search/filter functionality
- Pagination with page controls
- Custom cell rendering
- Responsive design

**Usage:**
```jsx
import { DataTable } from '../components/shared';

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { 
    key: 'status', 
    label: 'Status',
    render: (value) => <span className="badge">{value}</span>
  }
];

const data = [
  { id: 1, name: 'John', status: 'Active' },
  { id: 2, name: 'Jane', status: 'Inactive' }
];

<DataTable 
  data={data} 
  columns={columns} 
  pageSize={10}
  searchable={true}
/>
```

### 5. StatCard

Display metric cards with optional trend indicators.

**Features:**
- Large value display
- Trend indicators (up/down/neutral)
- Icon support
- Color variants (primary, success, warning, error, info)
- Subtitle support

**Usage:**
```jsx
import { StatCard } from '../components/shared';
import { Users } from 'lucide-react';

<StatCard
  title="Total Users"
  value="1,234"
  subtitle="Active users this month"
  trend={{ value: '+12%', direction: 'up' }}
  icon={Users}
  variant="primary"
/>
```

### 6. ChartWidget

Reusable chart component using Chart.js.

**Features:**
- Multiple chart types (line, bar, pie, doughnut)
- Responsive and interactive
- Customizable options
- Pre-configured color palettes
- Title and subtitle support

**Usage:**
```jsx
import { ChartWidget, chartColors } from '../components/shared';

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [{
    label: 'Revenue',
    data: [12, 19, 15, 25, 22, 30],
    borderColor: chartColors.primary[0],
    backgroundColor: chartColors.primary[0].replace('0.8', '0.2'),
  }]
};

<ChartWidget
  type="line"
  data={data}
  title="Revenue Trend"
  subtitle="Monthly revenue"
  height="300px"
/>
```

**Available Chart Types:**
- `line` - Line chart
- `bar` - Bar chart
- `pie` - Pie chart
- `doughnut` - Doughnut chart

**Color Palettes:**
- `chartColors.primary` - Blue shades
- `chartColors.success` - Green shades
- `chartColors.warning` - Orange shades
- `chartColors.error` - Red shades
- `chartColors.mixed` - Multi-color palette

### 7. FormBuilder

Dynamic form component with validation using react-hook-form.

**Features:**
- Multiple field types (text, email, password, textarea, select, checkbox, radio, date)
- Built-in validation
- Error messages
- Reset functionality
- Loading states

**Usage:**
```jsx
import { FormBuilder } from '../components/shared';

const fields = [
  {
    name: 'username',
    label: 'Username',
    type: 'text',
    placeholder: 'Enter username',
    required: true,
    validation: {
      minLength: { value: 3, message: 'Min 3 characters' }
    }
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true
  },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    options: [
      { value: 'user', label: 'User' },
      { value: 'admin', label: 'Admin' }
    ]
  }
];

const handleSubmit = (data) => {
  console.log('Form data:', data);
};

<FormBuilder
  fields={fields}
  onSubmit={handleSubmit}
  submitLabel="Create User"
/>
```

**Field Types:**
- `text` - Text input
- `email` - Email input with validation
- `password` - Password input
- `number` - Number input
- `textarea` - Multi-line text
- `select` - Dropdown select
- `checkbox` - Single checkbox
- `radio` - Radio button group
- `date` - Date picker

## Theming

All components support sector-specific theming through DaisyUI themes. The theme is automatically applied based on the sector code:

- `banking` - Blue theme
- `healthcare` - Green theme
- `logistics` - Orange theme
- `content` - Purple theme
- `education` - Violet theme
- `retail` - Red theme
- `manufacturing` - Slate theme

## Accessibility

All components follow accessibility best practices:
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader friendly
- Color contrast compliance

## Dependencies

- React 19
- React Router DOM
- React Hook Form
- Chart.js & react-chartjs-2
- Lucide React (icons)
- DaisyUI & Tailwind CSS

## Example Implementation

See `frontend/src/pages/ComponentShowcase.jsx` for a complete example of all components in action.

See `frontend/src/components/sectors/BankingModule.jsx` for an example of using SectorLayout in a real sector module.
