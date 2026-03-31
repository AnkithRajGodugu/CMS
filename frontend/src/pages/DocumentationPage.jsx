import React, { useState } from 'react';
import { useTheme } from '../context/SectorThemeProvider';
import { useSector } from '../hooks/useSector';
import DynamicLogo from '../components/logos/DynamicLogo';

const DocumentationPage = () => {
  const { currentTheme, getAllSectors } = useTheme();
  const { getSectorDisplayName } = useSector();
  const [selectedSection, setSelectedSection] = useState('getting-started');
  const [selectedSector, setSelectedSector] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const documentationSections = {
    'getting-started': {
      title: 'Getting Started',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      content: {
        overview: `
# Getting Started with CMS Platform

Welcome to CMS Platform! This guide will help you get up and running quickly with our comprehensive customer management system.

## Quick Start

1. **Sign Up**: Create your account at [signup page](/signup)
2. **Choose Your Sector**: Select your industry (Banking, Healthcare, Logistics, or Content Creation)
3. **Import Data**: Upload your existing customer data or start fresh
4. **Customize**: Configure workflows and settings for your business
5. **Invite Team**: Add team members and set permissions

## System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- JavaScript enabled
- Minimum screen resolution: 1024x768

## First Steps

### 1. Account Setup
After signing up, you'll be guided through the initial setup process:
- Company information
- Sector selection
- Basic preferences
- Team member invitations

### 2. Data Import
You can import existing customer data from:
- CSV files
- Excel spreadsheets
- Other CRM systems via API
- Manual entry

### 3. Customization
Tailor the platform to your needs:
- Custom fields
- Workflow automation
- Notification preferences
- Dashboard layout
        `
      }
    },
    'user-guide': {
      title: 'User Guide',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      content: {
        overview: `
# User Guide

Complete guide to using CMS Platform effectively.

## Dashboard Overview

The dashboard is your central hub for managing customers and monitoring key metrics.

### Key Components:
- **Quick Stats**: Overview of customers, revenue, and activity
- **Recent Activity**: Latest customer interactions and updates
- **Task Management**: Pending tasks and follow-ups
- **Performance Metrics**: Charts and analytics

## Customer Management

### Adding Customers
1. Click "Add Customer" button
2. Fill in required information
3. Select customer type/category
4. Set preferences and tags
5. Save and assign to team member

### Customer Profiles
Each customer profile includes:
- Contact information
- Interaction history
- Documents and files
- Notes and comments
- Task assignments
- Communication preferences

### Bulk Operations
- Import/export customer data
- Bulk email campaigns
- Mass updates to customer fields
- Batch task assignments

## Communication Tools

### Email Integration
- Send emails directly from the platform
- Email templates for common scenarios
- Automated email sequences
- Email tracking and analytics

### Task Management
- Create and assign tasks
- Set due dates and priorities
- Track completion status
- Automated reminders

### Notes and Comments
- Add detailed notes to customer profiles
- Team collaboration through comments
- File attachments and links
- Search through historical notes
        `
      }
    },
    'api-reference': {
      title: 'API Reference',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      content: {
        overview: `
# API Reference

Complete reference for CMS Platform REST API.

## Authentication

All API requests require authentication using API keys.

\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" \\
     -H "Content-Type: application/json" \\
     https://api.cmsplatform.com/v1/customers
\`\`\`

## Base URL
\`https://api.cmsplatform.com/v1\`

## Rate Limits
- 1000 requests per hour for standard plans
- 5000 requests per hour for professional plans
- 10000 requests per hour for enterprise plans

## Customers API

### Get All Customers
\`\`\`http
GET /customers
\`\`\`

**Parameters:**
- \`page\` (integer): Page number (default: 1)
- \`limit\` (integer): Items per page (default: 50, max: 100)
- \`sector\` (string): Filter by sector
- \`status\` (string): Filter by status

**Response:**
\`\`\`json
{
  "data": [
    {
      "id": "cust_123",
      "name": "John Doe",
      "email": "john@example.com",
      "sector": "banking",
      "status": "active",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "pages": 3
  }
}
\`\`\`

### Create Customer
\`\`\`http
POST /customers
\`\`\`

**Request Body:**
\`\`\`json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "sector": "healthcare",
  "custom_fields": {
    "company": "ABC Corp",
    "role": "Manager"
  }
}
\`\`\`

### Update Customer
\`\`\`http
PUT /customers/{id}
\`\`\`

### Delete Customer
\`\`\`http
DELETE /customers/{id}
\`\`\`

## Webhooks

Configure webhooks to receive real-time notifications:

### Available Events:
- \`customer.created\`
- \`customer.updated\`
- \`customer.deleted\`
- \`task.completed\`
- \`email.sent\`

### Webhook Payload:
\`\`\`json
{
  "event": "customer.created",
  "data": {
    "id": "cust_123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
\`\`\`
        `
      }
    },
    'integrations': {
      title: 'Integrations',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      content: {
        overview: `
# Integrations

Connect CMS Platform with your existing tools and services.

## Popular Integrations

### Email Services
- **Gmail**: Sync emails and contacts
- **Outlook**: Calendar and email integration
- **Mailchimp**: Marketing automation
- **SendGrid**: Transactional emails

### CRM Systems
- **Salesforce**: Bi-directional sync
- **HubSpot**: Lead management
- **Pipedrive**: Sales pipeline
- **Zoho CRM**: Customer data sync

### Communication Tools
- **Slack**: Notifications and updates
- **Microsoft Teams**: Team collaboration
- **Discord**: Community management
- **Zoom**: Meeting scheduling

### Payment Processing
- **Stripe**: Payment handling
- **PayPal**: Transaction processing
- **Square**: Point of sale
- **Braintree**: Merchant services

## Setting Up Integrations

### 1. Access Integration Settings
Navigate to Settings > Integrations in your dashboard.

### 2. Choose Integration
Select the service you want to connect from the available options.

### 3. Authenticate
Follow the OAuth flow to grant necessary permissions.

### 4. Configure Sync
Set up data mapping and sync preferences.

### 5. Test Connection
Verify the integration is working correctly.

## Custom Integrations

### Zapier
Connect with 3000+ apps through Zapier:
1. Create a Zapier account
2. Search for "CMS Platform"
3. Set up triggers and actions
4. Test your automation

### API Integration
Build custom integrations using our REST API:
- Full CRUD operations
- Real-time webhooks
- Comprehensive documentation
- SDKs for popular languages

## Troubleshooting

### Common Issues:
- **Authentication Errors**: Check API keys and permissions
- **Sync Failures**: Verify data format and field mapping
- **Rate Limits**: Monitor API usage and upgrade if needed
- **Webhook Failures**: Check endpoint URL and SSL certificate
        `
      }
    },
    'troubleshooting': {
      title: 'Troubleshooting',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 11-9.75 9.75 9.75 9.75 0 019.75-9.75z" />
        </svg>
      ),
      content: {
        overview: `
# Troubleshooting Guide

Common issues and their solutions.

## Login Issues

### Can't Sign In
1. **Check Credentials**: Verify email and password
2. **Reset Password**: Use the "Forgot Password" link
3. **Clear Browser Cache**: Clear cookies and cache
4. **Try Incognito Mode**: Test in private browsing
5. **Contact Support**: If issues persist

### Two-Factor Authentication
- **Lost Device**: Contact support for account recovery
- **Backup Codes**: Use saved backup codes
- **New Device**: Re-setup 2FA in account settings

## Performance Issues

### Slow Loading
1. **Check Internet Connection**: Test connection speed
2. **Clear Browser Cache**: Remove stored data
3. **Disable Extensions**: Test with extensions disabled
4. **Update Browser**: Use latest browser version
5. **Try Different Browser**: Test compatibility

### Data Sync Issues
- **Check API Limits**: Monitor usage in settings
- **Verify Permissions**: Ensure proper access rights
- **Review Error Logs**: Check integration logs
- **Test Connection**: Use connection test tools

## Data Issues

### Missing Data
1. **Check Filters**: Verify search and filter settings
2. **Review Permissions**: Ensure access to data
3. **Check Import Status**: Verify import completion
4. **Contact Support**: For data recovery

### Incorrect Data
- **Review Import Mapping**: Check field mapping
- **Validate Source Data**: Verify original data
- **Check Sync Settings**: Review integration settings
- **Manual Correction**: Update data manually

## Integration Problems

### Failed Connections
1. **Re-authenticate**: Refresh OAuth tokens
2. **Check Permissions**: Verify granted permissions
3. **Update Credentials**: Refresh API keys
4. **Test Endpoints**: Verify service availability

### Sync Errors
- **Data Format**: Check data structure
- **Field Mapping**: Verify field relationships
- **Rate Limits**: Monitor API usage
- **Error Logs**: Review detailed error messages

## Getting Help

### Self-Service Resources
- **Knowledge Base**: Searchable help articles
- **Video Tutorials**: Step-by-step guides
- **Community Forum**: User discussions
- **Status Page**: Service status updates

### Contact Support
- **Email**: support@cmsplatform.com
- **Live Chat**: Available 24/7 for paid plans
- **Phone**: Enterprise customers only
- **Ticket System**: Track support requests

### Emergency Support
For critical issues affecting business operations:
- **Priority Support**: Available for Professional+ plans
- **Emergency Hotline**: 24/7 for Enterprise customers
- **Dedicated Account Manager**: Enterprise feature
        `
      }
    }
  };

  const sectorSpecificDocs = {
    banking: {
      title: 'Banking Documentation',
      sections: [
        'Account Management',
        'Transaction Tracking',
        'Compliance Tools',
        'Risk Assessment',
        'Regulatory Reporting'
      ]
    },
    healthcare: {
      title: 'Healthcare Documentation',
      sections: [
        'Patient Records',
        'HIPAA Compliance',
        'Appointment Scheduling',
        'Medical History',
        'Insurance Management'
      ]
    },
    logistics: {
      title: 'Logistics Documentation',
      sections: [
        'Shipment Tracking',
        'Inventory Management',
        'Route Optimization',
        'Fleet Management',
        'Vendor Relations'
      ]
    },
    content: {
      title: 'Content Creation Documentation',
      sections: [
        'Project Management',
        'Client Portal',
        'Asset Management',
        'Collaboration Tools',
        'Content Calendar'
      ]
    }
  };

  const filteredSections = Object.entries(documentationSections).filter(([, section]) => {
    if (searchQuery) {
      return section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             section.content.overview.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-base-100">
      
      <div 
        className="bg-gradient-to-r text-white py-16"
        style={{ 
          background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.accent})` 
        }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Documentation
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Everything you need to know about using CMS Platform effectively
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-8">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search documentation..."
                    className="input input-bordered w-full pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Sector Filter */}
              <div className="mb-6">
                <label className="label">
                  <span className="label-text font-semibold">Filter by Sector</span>
                </label>
                <select 
                  className="select select-bordered w-full"
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                >
                  <option value="all">All Sectors</option>
                  {getAllSectors().map(sector => (
                    <option key={sector} value={sector}>
                      {getSectorDisplayName(sector)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Navigation */}
              <div className="space-y-2">
                <h3 className="font-semibold text-lg mb-4">General Documentation</h3>
                {filteredSections.map(([key, section]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedSection(key)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                      selectedSection === key 
                        ? 'bg-primary text-primary-content' 
                        : 'hover:bg-base-200'
                    }`}
                  >
                    {section.icon}
                    {section.title}
                  </button>
                ))}

                {/* Sector-specific docs */}
                {selectedSector !== 'all' && sectorSpecificDocs[selectedSector] && (
                  <div className="mt-8">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <DynamicLogo size={20} sector={selectedSector} animated={false} />
                      {sectorSpecificDocs[selectedSector].title}
                    </h3>
                    <div className="space-y-2">
                      {sectorSpecificDocs[selectedSector].sections.map((section, index) => (
                        <button
                          key={index}
                          className="w-full text-left p-2 rounded hover:bg-base-200 transition-colors text-sm"
                        >
                          {section}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-base-100 rounded-lg shadow-lg p-8">
              {/* Breadcrumb */}
              <div className="breadcrumbs text-sm mb-6">
                <ul>
                  <li><a>Documentation</a></li>
                  <li>{documentationSections[selectedSection]?.title}</li>
                </ul>
              </div>

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                <div 
                  className="markdown-content"
                  dangerouslySetInnerHTML={{ 
                    __html: documentationSections[selectedSection]?.content.overview
                      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-base-200 p-4 rounded-lg overflow-x-auto"><code>$2</code></pre>')
                      .replace(/`([^`]+)`/g, '<code class="bg-base-200 px-2 py-1 rounded">$1</code>')
                      .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mb-4 text-primary">$1</h1>')
                      .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mb-3 mt-6">$1</h2>')
                      .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold mb-2 mt-4">$1</h3>')
                      .replace(/^\- (.+)$/gm, '<li class="ml-4">$1</li>')
                      .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4">$2</li>')
                      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\n\n/g, '</p><p class="mb-4">')
                      .replace(/^(.+)$/gm, '<p class="mb-4">$1</p>')
                  }}
                />
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-12 pt-8 border-t border-base-300">
                <div className="text-sm text-base-content/60">
                  Last updated: January 15, 2025
                </div>
                <div className="flex gap-4">
                  <button className="btn btn-outline btn-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Page
                  </button>
                  <button className="btn btn-outline btn-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    Share
                  </button>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-8 bg-base-200 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Need More Help?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{ backgroundColor: `${currentTheme.colors.primary}15`, color: currentTheme.colors.primary }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold mb-2">Live Chat</h4>
                  <p className="text-sm text-base-content/70">Get instant help from our support team</p>
                </div>
                <div className="text-center">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{ backgroundColor: `${currentTheme.colors.primary}15`, color: currentTheme.colors.primary }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold mb-2">Community</h4>
                  <p className="text-sm text-base-content/70">Connect with other users and experts</p>
                </div>
                <div className="text-center">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{ backgroundColor: `${currentTheme.colors.primary}15`, color: currentTheme.colors.primary }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold mb-2">Email Support</h4>
                  <p className="text-sm text-base-content/70">Send us a detailed message</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
