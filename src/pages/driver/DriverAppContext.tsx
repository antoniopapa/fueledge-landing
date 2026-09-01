import { createContext, useContext, type ReactNode } from 'react';
import {
  driverProfile,
  type DriverRun,
  type DriverProfile,
  type DriverNotification,
  type IssueSeverity,
  type IssueKind,
} from '@/mocks/driver';
import {
  useDriverRuns,
  useDriverNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  markRunNotificationsSeen,
  startRun,
  undoStartRun,
  navigateToStop,
  arriveAtStop,
  markLoadCompleted,
  markDeliveryCompleted,
  completePickup,
  completeDelivery,
  reportIssue,
  reportUnableToComplete,
  resolveIssue,
  type PickupProductResult,
  type DeliveryProductResult,
} from '@/pages/driver/driverStore';

interface DriverAppContextValue {
  driver: DriverProfile;
  runs: DriverRun[];
  notifications: DriverNotification[];
  unreadCount: number;
  newRunCount: number;
  newRunIds: string[];
  startRun: (id: string) => void;
  undoStartRun: (id: string) => void;
  navigateToStop: (runId: string, stopId: string) => void;
  arriveAtStop: (runId: string, stopId: string) => void;
  markLoadCompleted: (runId: string, stopId: string) => void;
  markDeliveryCompleted: (runId: string, stopId: string) => void;
  completePickup: (
    runId: string,
    stopId: string,
    data: {
      actualQuantity: string;
      bol: string;
      discrepancy: string;
      loadingNumber?: string | null;
      grossQuantity?: string | null;
      netQuantity?: string | null;
      products?: PickupProductResult[];
    },
  ) => void;
  completeDelivery: (
    runId: string,
    stopId: string,
    data: {
      actualQuantity: string;
      notes: string;
      pod: string;
      discrepancy: string;
      deliveryTicket?: string | null;
      tank?: { initialVolume: number | null; finalVolume: number | null; waterInTank: number | null } | null;
      products?: DeliveryProductResult[];
    },
  ) => void;
  reportIssue: (
    runId: string,
    stopId: string,
    stopLabel: string,
    category: string,
    note: string,
    severity: IssueSeverity,
    kind: IssueKind,
  ) => void;
  reportUnableToComplete: (runId: string, stopId: string, stopLabel: string, reason: string, note?: string) => void;
  resolveIssue: (runId: string, issueId: string) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  markRunSeen: (runId: string) => void;
}

const DriverAppContext = createContext<DriverAppContextValue | null>(null);

export function DriverAppProvider({ children }: { children: ReactNode }) {
  const runs = useDriverRuns();
  const notifications = useDriverNotifications();

  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const newRunCount = notifications.filter(
    (notification) => !notification.read && notification.kind === 'assignment',
  ).length;
  const newRunIds = notifications
    .filter((notification) => !notification.read && notification.kind === 'assignment' && notification.runId)
    .map((notification) => notification.runId as string);

  const value: DriverAppContextValue = {
    driver: driverProfile,
    runs,
    notifications,
    unreadCount,
    newRunCount,
    newRunIds,
    startRun,
    undoStartRun,
    navigateToStop,
    arriveAtStop,
    markLoadCompleted,
    markDeliveryCompleted,
    completePickup,
    completeDelivery,
    reportIssue,
    reportUnableToComplete,
    resolveIssue,
    markRead: markNotificationRead,
    markAllRead: markAllNotificationsRead,
    markRunSeen: markRunNotificationsSeen,
  };

  return <DriverAppContext.Provider value={value}>{children}</DriverAppContext.Provider>;
}

export function useDriverApp() {
  const context = useContext(DriverAppContext);
  if (!context) {
    throw new Error('useDriverApp must be used within a DriverAppProvider');
  }
  return context;
}