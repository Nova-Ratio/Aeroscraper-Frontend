'use client';

import React, { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';

export type NotificationType = "Reedem"

export interface INotification {
  message?: string;
  status: 'success' | 'error';
  directLink?: string;
  type?: NotificationType,
  isRead?: boolean
}

interface INotificationContext {
  notification: INotification | null;
  addNotification: (notification: INotification) => void;
  clearNotification: () => void;
  processLoading: boolean;
  setProcessLoading: (arg: boolean) => void;
  setOnHover: (arg: boolean) => void;
}

const NotificationContext = createContext<INotificationContext>({
  notification: null,
  addNotification: () => { },
  clearNotification: () => { },
  processLoading: false,
  setProcessLoading: () => { },
  setOnHover: () => { }
});

const NotificationProvider: FC<PropsWithChildren> = ({ children }) => {
  const [notification, setNotification] = useState<INotification | null>(null);

  const [processLoading, setProcessLoading] = useState(false);
  const [onHover, setOnHover] = useState(false);

  const addNotification = (notification: INotification) => {
    setOnHover(false);
    setNotification(notification);

    let notiElement = {
      message: notification.message,
      status: notification.status,
      directLink: notification.directLink,
      type: notification.type,
      isRead: false
    };

    try {
      if (!notiElement.status) { return }

      let notiArray = JSON.parse(localStorage.getItem('notifications') ?? "");
      notiArray.push(notiElement);

      localStorage.setItem("notifications", JSON.stringify(notiArray));
    } catch (error) {
      localStorage.setItem("notifications", JSON.stringify([notiElement]));
    }

    if (!onHover) {
      setTimeout(() => { clearNotification() }, 4000);
    }
  }
  const clearNotification = useCallback(
    () => {
      if (!onHover) {
        console.log(onHover);
        
        setNotification(null);
      }
    },
    [onHover, notification, processLoading]);

  useEffect(() => {
    const timer = setTimeout(() => {
      clearNotification();
    }, 1000);

    return () => {
      clearTimeout(timer);
    }
  }, [onHover]);

  const providedValue = React.useMemo(() => ({
    notification,
    addNotification,
    clearNotification,
    processLoading,
    setProcessLoading,
    setOnHover
  }), [notification, processLoading, onHover]);


  return (
    <NotificationContext.Provider
      value={providedValue}
    >
      {children}
    </NotificationContext.Provider>
  );
};

const useNotification = () => useContext(NotificationContext);

export { NotificationProvider, useNotification };