import React from 'react';

const FeatureList = ({ sector }) => {
  // Define features for each sector
  const sectorFeatures = {
    'BANKING': [
      { icon: '💳', title: 'Account Management', description: 'Comprehensive account tracking and management' },
      { icon: '💰', title: 'Transaction Processing', description: 'Real-time transaction processing and monitoring' },
      { icon: '📊', title: 'Financial Analytics', description: 'Advanced analytics and reporting tools' },
      { icon: '🔒', title: 'Security & Compliance', description: 'Bank-grade security with regulatory compliance' },
      { icon: '📱', title: 'Mobile Banking', description: 'Full-featured mobile banking experience' },
      { icon: '🤝', title: 'Customer Portal', description: 'Self-service portal for customers' }
    ],
    'HEALTHCARE': [
      { icon: '👨‍⚕️', title: 'Patient Records', description: 'Electronic health records management' },
      { icon: '📅', title: 'Appointment Scheduling', description: 'Automated scheduling and reminders' },
      { icon: '💊', title: 'Prescription Management', description: 'Digital prescription tracking' },
      { icon: '🏥', title: 'Care Coordination', description: 'Seamless care team collaboration' },
      { icon: '📋', title: 'Medical History', description: 'Complete patient history tracking' },
      { icon: '🔐', title: 'HIPAA Compliance', description: 'Full HIPAA compliance and security' }
    ],
    'EDUCATION': [
      { icon: '📚', title: 'Course Management', description: 'Create and manage courses easily' },
      { icon: '👨‍🎓', title: 'Student Portal', description: 'Comprehensive student dashboard' },
      { icon: '📝', title: 'Assignment Tracking', description: 'Track and grade assignments' },
      { icon: '📊', title: 'Grade Management', description: 'Automated grading and reporting' },
      { icon: '💬', title: 'Communication Tools', description: 'Built-in messaging and announcements' },
      { icon: '📈', title: 'Progress Analytics', description: 'Track student progress and performance' }
    ],
    'RETAIL': [
      { icon: '🛒', title: 'Inventory Management', description: 'Real-time inventory tracking' },
      { icon: '💳', title: 'POS Integration', description: 'Seamless point-of-sale integration' },
      { icon: '📦', title: 'Order Management', description: 'End-to-end order processing' },
      { icon: '👥', title: 'Customer Management', description: 'CRM and loyalty programs' },
      { icon: '📊', title: 'Sales Analytics', description: 'Comprehensive sales reporting' },
      { icon: '🚚', title: 'Shipping Integration', description: 'Multi-carrier shipping support' }
    ],
    'MANUFACTURING': [
      { icon: '🏭', title: 'Production Planning', description: 'Optimize production schedules' },
      { icon: '📦', title: 'Inventory Control', description: 'Raw materials and finished goods tracking' },
      { icon: '✅', title: 'Quality Assurance', description: 'Quality control and testing workflows' },
      { icon: '🔧', title: 'Equipment Management', description: 'Maintenance and asset tracking' },
      { icon: '📊', title: 'Production Analytics', description: 'Real-time production metrics' },
      { icon: '🔗', title: 'Supply Chain', description: 'Supplier and vendor management' }
    ],
    'LOGISTICS': [
      { icon: '🚚', title: 'Shipment Tracking', description: 'Real-time shipment visibility' },
      { icon: '📍', title: 'Route Optimization', description: 'AI-powered route planning' },
      { icon: '📦', title: 'Warehouse Management', description: 'Inventory and warehouse operations' },
      { icon: '🚛', title: 'Fleet Management', description: 'Vehicle tracking and maintenance' },
      { icon: '📊', title: 'Logistics Analytics', description: 'Performance metrics and KPIs' },
      { icon: '🤝', title: 'Carrier Integration', description: 'Multi-carrier support' }
    ],
    'CONTENT': [
      { icon: '📝', title: 'Content Creation', description: 'Rich content editor and tools' },
      { icon: '📁', title: 'Asset Management', description: 'Digital asset library' },
      { icon: '👥', title: 'Collaboration', description: 'Team collaboration features' },
      { icon: '📅', title: 'Content Calendar', description: 'Editorial calendar and scheduling' },
      { icon: '🔄', title: 'Workflow Management', description: 'Approval workflows' },
      { icon: '📊', title: 'Analytics', description: 'Content performance tracking' }
    ]
  };

  const features = sectorFeatures[sector.code] || sectorFeatures['BANKING'];

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-gray-800">Key Features</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl flex-shrink-0">{feature.icon}</div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureList;
