import React from 'react';

const UseCaseExamples = ({ sector }) => {
  // Define use cases for each sector
  const sectorUseCases = {
    'BANKING': [
      {
        title: 'Digital Banking Transformation',
        description: 'A regional bank modernized their customer experience with our platform, reducing transaction processing time by 60% and increasing customer satisfaction scores by 45%.',
        metrics: ['60% faster processing', '45% higher satisfaction', '2M+ transactions/month']
      },
      {
        title: 'Loan Management Automation',
        description: 'Streamlined loan application and approval process, cutting approval time from days to hours while maintaining compliance standards.',
        metrics: ['75% faster approvals', '90% automation rate', '99.9% compliance']
      },
      {
        title: 'Fraud Detection System',
        description: 'Implemented real-time fraud detection that reduced fraudulent transactions by 85% while minimizing false positives.',
        metrics: ['85% fraud reduction', '95% accuracy', 'Real-time alerts']
      }
    ],
    'HEALTHCARE': [
      {
        title: 'Hospital Patient Management',
        description: 'A 500-bed hospital improved patient care coordination and reduced wait times by 40% using our integrated patient management system.',
        metrics: ['40% reduced wait times', '500+ beds managed', '99.9% uptime']
      },
      {
        title: 'Telemedicine Platform',
        description: 'Enabled remote consultations for 10,000+ patients monthly, improving access to care in rural areas.',
        metrics: ['10K+ consultations/month', '95% patient satisfaction', 'HIPAA compliant']
      },
      {
        title: 'Medical Records Digitization',
        description: 'Digitized 1M+ patient records, improving data accessibility and reducing retrieval time from hours to seconds.',
        metrics: ['1M+ records digitized', 'Instant access', '100% secure']
      }
    ],
    'EDUCATION': [
      {
        title: 'University Learning Management',
        description: 'A major university manages 50,000+ students across 500+ courses with our platform, improving engagement by 55%.',
        metrics: ['50K+ students', '500+ courses', '55% more engagement']
      },
      {
        title: 'Online Course Platform',
        description: 'Educational startup scaled from 100 to 10,000 students in 6 months using our course management tools.',
        metrics: ['100x growth', '10K students', '95% completion rate']
      },
      {
        title: 'K-12 School District',
        description: 'School district improved parent-teacher communication and student performance tracking across 25 schools.',
        metrics: ['25 schools', '15K students', '80% parent engagement']
      }
    ],
    'RETAIL': [
      {
        title: 'Multi-Channel Retail',
        description: 'Fashion retailer unified online and offline operations, increasing sales by 35% and reducing inventory costs by 25%.',
        metrics: ['35% sales increase', '25% cost reduction', '100+ locations']
      },
      {
        title: 'E-commerce Growth',
        description: 'Online store scaled from 1,000 to 50,000 daily orders while maintaining 99.9% order accuracy.',
        metrics: ['50K orders/day', '99.9% accuracy', '50x growth']
      },
      {
        title: 'Inventory Optimization',
        description: 'Retail chain reduced stockouts by 70% and overstock by 40% using our AI-powered inventory management.',
        metrics: ['70% fewer stockouts', '40% less overstock', '$2M saved']
      }
    ],
    'MANUFACTURING': [
      {
        title: 'Smart Factory Implementation',
        description: 'Manufacturing plant increased production efficiency by 45% and reduced downtime by 60% with our IoT-integrated platform.',
        metrics: ['45% efficiency gain', '60% less downtime', '24/7 monitoring']
      },
      {
        title: 'Quality Control Automation',
        description: 'Automated quality inspection reduced defect rates by 80% while increasing inspection speed by 10x.',
        metrics: ['80% fewer defects', '10x faster inspection', '99.5% accuracy']
      },
      {
        title: 'Supply Chain Optimization',
        description: 'Optimized supply chain reduced lead times by 50% and inventory carrying costs by 30%.',
        metrics: ['50% faster delivery', '30% cost reduction', 'Real-time tracking']
      }
    ],
    'LOGISTICS': [
      {
        title: 'Last-Mile Delivery',
        description: 'Delivery company optimized routes and reduced delivery times by 35% while cutting fuel costs by 25%.',
        metrics: ['35% faster delivery', '25% fuel savings', '10K deliveries/day']
      },
      {
        title: 'Warehouse Automation',
        description: 'Distribution center increased throughput by 60% and reduced picking errors by 90% with our WMS.',
        metrics: ['60% more throughput', '90% fewer errors', '1M sq ft managed']
      },
      {
        title: 'Fleet Management',
        description: 'Transportation company reduced maintenance costs by 40% and improved vehicle utilization by 30%.',
        metrics: ['40% cost reduction', '30% better utilization', '500+ vehicles']
      }
    ],
    'CONTENT': [
      {
        title: 'Digital Publishing',
        description: 'Media company streamlined content production, publishing 3x more content with the same team size.',
        metrics: ['3x content output', '50% faster publishing', '100+ contributors']
      },
      {
        title: 'Marketing Agency',
        description: 'Agency improved client collaboration and reduced project turnaround time by 45%.',
        metrics: ['45% faster delivery', '50+ clients', '95% satisfaction']
      },
      {
        title: 'Corporate Communications',
        description: 'Enterprise managed internal and external content across 20 countries with centralized control.',
        metrics: ['20 countries', '10K+ assets', 'Multi-language support']
      }
    ]
  };

  const useCases = sectorUseCases[sector.code] || sectorUseCases['BANKING'];

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-gray-800">Real-World Use Cases</h3>
      <div className="space-y-4">
        {useCases.map((useCase, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100"
          >
            <h4 className="text-xl font-semibold text-gray-800 mb-3">{useCase.title}</h4>
            <p className="text-gray-700 mb-4">{useCase.description}</p>
            <div className="flex flex-wrap gap-3">
              {useCase.metrics.map((metric, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1 bg-white rounded-full text-sm font-medium text-blue-600 border border-blue-200"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {metric}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UseCaseExamples;
