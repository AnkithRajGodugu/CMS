import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  BarChart3,
  Folder,
  Calendar,
  CreditCard,
  Package,
  Truck,
  Heart,
  GraduationCap,
  ShoppingCart,
  Factory,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

/**
 * SectorSidebar - Collapsible navigation sidebar with sector-specific menu items
 * Features: responsive design, active state highlighting, icon support
 */
const SectorSidebar = ({ sector, collapsed, onToggle }) => {
  
  // Get sector-specific menu items
  const getSectorMenuItems = (sectorCode) => {
    const menuItems = {
        banking: [
            { path: '/dashboard/banking', label: 'Dashboard', icon: LayoutDashboard },
            { path: '/dashboard/banking/accounts', label: 'Accounts', icon: CreditCard },
            { path: '/dashboard/banking/transactions', label: 'Transactions', icon: FileText },
            { path: '/dashboard/banking/compliance', label: 'Compliance', icon: Settings },
            { path: '/dashboard/banking/risk', label: 'Risk Assessment', icon: BarChart3 },
        ],
      healthcare: [
        { path: '/dashboard/healthcare', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/healthcare/PatientRecordsPage', label: 'Patient Records', icon: Users },
        { path: '/healthcare/AppointmentSchedulingPage', label: 'Appointments', icon: Calendar },
        { path: '/healthcare/MedicalHistoryPage', label: 'Medical History', icon: FileText },
        { path: '/healthcare/InsuranceManagementPage', label: 'Insurance', icon: CreditCard },
      ],
      logistics: [
        { path: '/dashboard/logistics', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/logistics-&-supply/LogisticsShipmentTrackingPage', label: 'Shipment Tracking', icon: Package },
        { path: '/logistics-&-supply/LogisticsInventoryManagementPage', label: 'Inventory', icon: Folder },
        { path: '/logistics-&-supply/LogisticsRouteOptimizationPage', label: 'Route Optimization', icon: Truck },
        { path: '/logistics-&-supply/LogisticsVendorRelationsPage', label: 'Vendor Relations', icon: Users },
        { path: '/logistics-&-supply/LogisticsWarehouseManagementPage', label: 'Warehouse', icon: Factory },
        { path: '/logistics-&-supply/LogisticsFleetManagementPage', label: 'Fleet Management', icon: Truck },
      ],
      content: [
        { path: '/dashboard/content', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/content-creation/ProjectManagementPage', label: 'Projects', icon: Folder },
        { path: '/content-creation/ClientPortalPage', label: 'Clients', icon: Users },
        { path: '/content-creation/ContentCalendarPage', label: 'Calendar', icon: Calendar },
        { path: '/content-creation/CollaborationToolsPage', label: 'Collaboration', icon: Users },
        { path: '/content-creation/AssetManagementPage', label: 'Assets', icon: Package },
        { path: '/content-creation/TimeTrackingPage', label: 'Time Tracking', icon: BarChart3 },
      ],
      education: [
        { path: '/dashboard/education', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/education/courses', label: 'Courses', icon: GraduationCap },
        { path: '/education/students', label: 'Students', icon: Users },
        { path: '/education/assignments', label: 'Assignments', icon: FileText },
        { path: '/education/grades', label: 'Grades', icon: BarChart3 },
      ],
      retail: [
        { path: '/dashboard/retail', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/retail/products', label: 'Products', icon: Package },
        { path: '/retail/orders', label: 'Orders', icon: ShoppingCart },
        { path: '/retail/customers', label: 'Customers', icon: Users },
        { path: '/retail/analytics', label: 'Analytics', icon: BarChart3 },
      ],
      manufacturing: [
        { path: '/dashboard/manufacturing', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/manufacturing/production', label: 'Production', icon: Factory },
        { path: '/manufacturing/inventory', label: 'Inventory', icon: Package },
        { path: '/manufacturing/quality', label: 'Quality Control', icon: Settings },
        { path: '/manufacturing/analytics', label: 'Analytics', icon: BarChart3 },
      ],
    };

    return menuItems[sectorCode?.toLowerCase()] || [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/content', label: 'Content', icon: FileText },
      { path: '/settings', label: 'Settings', icon: Settings },
    ];
  };

  const menuItems = getSectorMenuItems(sector?.code);

  return (
    <>
      {/* Mobile Overlay */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] z-40
          bg-base-100 shadow-lg transition-all duration-300 ease-in-out
          ${collapsed ? '-translate-x-full md:translate-x-0 md:w-16' : 'translate-x-0 w-64'}
        `}
        role="navigation"
        aria-label="Sector navigation"
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-base-300">
            {!collapsed && (
              <h2 className="font-semibold text-lg">Navigation</h2>
            )}
            <button
              onClick={onToggle}
              className="btn btn-ghost btn-sm btn-circle hidden md:flex"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-2">
            <ul className="menu menu-sm md:menu-md">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={index}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 ${
                          isActive ? 'active bg-primary text-primary-content' : ''
                        }`
                      }
                      title={collapsed ? item.label : ''}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && (
                        <span className="flex-1">{item.label}</span>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-base-300">
            <NavLink
              to="/settings"
              className="flex items-center gap-3 btn btn-ghost btn-sm w-full justify-start"
              title={collapsed ? 'Settings' : ''}
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>Settings</span>}
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SectorSidebar;
