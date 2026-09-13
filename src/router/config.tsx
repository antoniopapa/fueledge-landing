import { Navigate, useParams } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import Home from '@/pages/home/page';
import OverviewPage from '@/pages/dashboard/overview/page';
import DriversPage from '@/pages/dashboard/drivers/page';
import DriverDetailPage from '@/pages/dashboard/drivers/detail/page';
import FleetPage from '@/pages/dashboard/fleet/page';
import TruckDetailPage from '@/pages/dashboard/fleet/detail/page';
import OrdersPage from '@/pages/dashboard/orders/page';
import OrderDetailPage from '@/pages/dashboard/orders/detail/page';
import TerminalsPage from '@/pages/dashboard/sourcing/terminals/page';
import TerminalDetailPage from '@/pages/dashboard/sourcing/terminals/detail/page';
import SuppliersPage from '@/pages/dashboard/sourcing/suppliers/page';
import ProductsPage from '@/pages/dashboard/products/page';
import UnassignedPage from '@/pages/dashboard/dispatch/unassigned/page';
import SchedulePage from '@/pages/dashboard/dispatch/schedule/page';
import DispatchMapPage from '@/pages/dashboard/dispatch/map/page';
import DispatchIssuesPage from '@/pages/dashboard/dispatch/issues/page';
import DispatchRunDetailPage from '@/pages/dashboard/dispatch/runs/detail/page';
import ActiveDeliveriesPage from '@/pages/dashboard/deliveries/page';
import CompletedDeliveriesPage from '@/pages/dashboard/deliveries/completed/page';
import ExceptionsDeliveriesPage from '@/pages/dashboard/deliveries/exceptions/page';
import DeliveryDetailPage from '@/pages/dashboard/deliveries/detail/page';
import AnalyticsOverviewPage from '@/pages/dashboard/analytics/overview/page';
import AnalyticsSourcingPage from '@/pages/dashboard/analytics/sourcing/page';
import AnalyticsOperationsPage from '@/pages/dashboard/analytics/operations/page';
import AnalyticsFinancialPage from '@/pages/dashboard/analytics/financial/page';
import AnalyticsTerminalsPage from '@/pages/dashboard/analytics/terminals/page';
import SettingsCompanyPage from '@/pages/dashboard/settings/company/page';
import SettingsUsersPage from '@/pages/dashboard/settings/users/page';
import SettingsIntegrationsPage from '@/pages/dashboard/settings/integrations/page';
import SettingsProductsPage from '@/pages/dashboard/settings/products/page';
import SettingsNotificationsPage from '@/pages/dashboard/settings/notifications/page';
import SettingsDataPage from '@/pages/dashboard/settings/data/page';
import CustomersPage from '@/pages/dashboard/customers/page';
import CustomerDetailPage from '@/pages/dashboard/customers/detail/page';
import CustomerLocationsPage from '@/pages/dashboard/customers/locations/page';
import CustomerLocationDetailPage from '@/pages/dashboard/customers/locations/detail/page';
import ReconciliationPage from '@/pages/dashboard/billing/reconciliation/page';
import ReadyToInvoicePage from '@/pages/dashboard/billing/ready-to-invoice/page';
import InvoicesPage from '@/pages/dashboard/billing/invoices/page';
import DriverAppLayout from '@/pages/driver/DriverAppLayout';
import DriverLoginPage from '@/pages/driver/login/page';
import DriverHomePage from '@/pages/driver/home/page';
import DriverStartPage from '@/pages/driver/start/page';
import DriverRunPreviewPage from '@/pages/driver/runs/preview/page';
import DriverSchedulePage from '@/pages/driver/schedule/page';
import DriverProfilePage from '@/pages/driver/profile/page';

function FleetToTrucksRedirect() {
  const { id } = useParams();
  return <Navigate to={id ? `/trucks/${id}` : '/trucks'} replace />;
}

function SourcingTerminalRedirect() {
  const { id } = useParams();
  return <Navigate to={id ? `/terminals/${id}` : '/terminals'} replace />;
}

const routes: RouteObject[] = [
  { path: '/', element: <Home /> },
  { path: '/overview', element: <OverviewPage /> },

  // Driver app
  {
    path: '/driver',
    element: <DriverAppLayout />,
    children: [
      { index: true, element: <DriverLoginPage /> },
      { path: 'home', element: <DriverHomePage /> },
      { path: 'start/:id', element: <DriverStartPage /> },
      { path: 'active', element: <Navigate to="/driver/home" replace /> },
      { path: 'runs/:id', element: <DriverRunPreviewPage /> },
      { path: 'runs', element: <Navigate to="/driver/home" replace /> },
      { path: 'schedule', element: <DriverSchedulePage /> },
      { path: 'activity', element: <Navigate to="/driver/profile" replace /> },
      { path: 'profile', element: <DriverProfilePage /> },
    ],
  },

  // Orders
  { path: '/orders', element: <OrdersPage /> },
  { path: '/orders/:id', element: <OrderDetailPage /> },

  // Resources
  { path: '/terminals', element: <TerminalsPage /> },
  { path: '/terminals/:id', element: <TerminalDetailPage /> },
  { path: '/suppliers', element: <SuppliersPage /> },
  { path: '/products', element: <ProductsPage /> },

  // Dispatch
  { path: '/dispatch', element: <SchedulePage /> },
  { path: '/dispatch/schedule', element: <Navigate to="/dispatch" replace /> },
  { path: '/dispatch/unassigned', element: <UnassignedPage /> },
  { path: '/dispatch/map', element: <DispatchMapPage /> },
  { path: '/dispatch/issues', element: <DispatchIssuesPage /> },
  { path: '/dispatch/runs/:id', element: <DispatchRunDetailPage /> },

  // Deliveries
  { path: '/deliveries', element: <ActiveDeliveriesPage /> },
  { path: '/deliveries/completed', element: <CompletedDeliveriesPage /> },
  { path: '/deliveries/exceptions', element: <ExceptionsDeliveriesPage /> },
  { path: '/deliveries/:id', element: <DeliveryDetailPage /> },

  // Trucks
  { path: '/trucks', element: <FleetPage /> },
  { path: '/trucks/:id', element: <TruckDetailPage /> },

  // Drivers
  { path: '/drivers', element: <DriversPage /> },
  { path: '/drivers/:id', element: <DriverDetailPage /> },

  // Customers
  { path: '/customers', element: <CustomersPage /> },
  { path: '/customers/locations', element: <CustomerLocationsPage /> },
  { path: '/customers/locations/:id', element: <CustomerLocationDetailPage /> },
  { path: '/customers/:id', element: <CustomerDetailPage /> },

  // Billing
  { path: '/billing', element: <Navigate to="/billing/reconciliation" replace /> },
  { path: '/billing/reconciliation', element: <ReconciliationPage /> },
  { path: '/billing/ready-to-invoice', element: <ReadyToInvoicePage /> },
  { path: '/billing/invoices', element: <InvoicesPage /> },

  // Analytics
  { path: '/analytics', element: <AnalyticsOverviewPage /> },
  { path: '/analytics/sourcing', element: <AnalyticsSourcingPage /> },
  { path: '/analytics/operations', element: <AnalyticsOperationsPage /> },
  { path: '/analytics/financial', element: <AnalyticsFinancialPage /> },
  { path: '/analytics/terminals', element: <AnalyticsTerminalsPage /> },

  // Settings
  { path: '/settings', element: <SettingsCompanyPage /> },
  { path: '/settings/users', element: <SettingsUsersPage /> },
  { path: '/settings/integrations', element: <SettingsIntegrationsPage /> },
  { path: '/settings/products', element: <SettingsProductsPage /> },
  { path: '/settings/notifications', element: <SettingsNotificationsPage /> },
  { path: '/settings/data', element: <SettingsDataPage /> },

  // Legacy redirects
  { path: '/fleet', element: <Navigate to="/trucks" replace /> },
  { path: '/fleet/:id', element: <FleetToTrucksRedirect /> },
  { path: '/fuel-sourcing', element: <Navigate to="/terminals" replace /> },
  { path: '/sourcing/terminals', element: <Navigate to="/terminals" replace /> },
  { path: '/sourcing/terminals/:id', element: <SourcingTerminalRedirect /> },
  { path: '/sourcing/suppliers', element: <Navigate to="/suppliers" replace /> },

  { path: '*', element: <NotFound /> },
];

export default routes;
