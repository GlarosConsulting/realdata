import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useAuthentication } from '@/hooks/authentication';
import ILog from '@/interfaces/logs/ILog';
import fetch from '@/lib/fetch';
import api from '@/services/api';

type ILogsResponse = ILog[];

interface IPerformDischargeDTO {
  log_id: string;
  discharge_performed: boolean;
}

interface ICustomersIXCContextData {
  logs: ILog[];
  performDischarge(log: ILog): Promise<void>;
}

const LogsContext = createContext<ICustomersIXCContextData>(
  {} as ICustomersIXCContextData,
);

const LogsProvider: React.FC = ({ children }) => {
  const { isLoggedIn } = useAuthentication();

  if (!isLoggedIn()) {
    return <>{children}</>;
  }

  const [logs, setLogs] = useState<ILog[]>([]);

  useEffect(() => {
    async function loadLogs() {
      const response = await fetch<ILogsResponse>('/logs');

      setLogs(response.data);
    }

    loadLogs();
  }, []);

  const performDischarge = useCallback(async (log: ILog): Promise<void> => {
    const response = await api.patch<ILog>(
      `/logs/${log.id}/discharge-performed`,
      {
        discharge_performed: !log.discharge_performed,
      },
    );

    const updatedLog = response.data;

    setLogs(state =>
      state.map(mapLog => (mapLog.id === log.id ? updatedLog : mapLog)),
    );
  }, []);

  return (
    <LogsContext.Provider value={{ logs, performDischarge }}>
      {children}
    </LogsContext.Provider>
  );
};

function useLogs(): ICustomersIXCContextData {
  const context = useContext(LogsContext);

  if (!context) {
    throw new Error("'useLogs' must be used within an 'LogsProvider'");
  }

  return context;
}

export { LogsProvider, useLogs };
