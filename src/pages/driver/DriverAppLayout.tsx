import { Outlet } from 'react-router-dom';
import { DriverAppProvider } from './DriverAppContext';

export default function DriverAppLayout() {
  return (
    <DriverAppProvider>
      <Outlet />
    </DriverAppProvider>
  );
}