import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useAuthentication } from '@/hooks/authentication';
import ICustomerIXC from '@/interfaces/customers_ixc/ICustomerIXC';
import fetch from '@/lib/fetch';
import api from '@/services/api';

type ICustomersIXCResponse = ICustomerIXC[];

interface ICreateCustomerIXCDTO {
  ixc_id: string;
  ixc_name: string;
  conta_azul_name: string;
  status: boolean;
}

interface ICustomersIXCContextData {
  customersIxc: ICustomerIXC[];
  createCustomerIxc(data: ICreateCustomerIXCDTO): Promise<ICustomerIXC>;
}

const CustomersIXCContext = createContext<ICustomersIXCContextData>(
  {} as ICustomersIXCContextData,
);

const CustomersIXCProvider: React.FC = ({ children }) => {
  const { isLoggedIn } = useAuthentication();

  if (!isLoggedIn()) {
    return <>{children}</>;
  }

  const [customersIxc, setCustomersIxc] = useState<ICustomerIXC[]>([]);

  useEffect(() => {
    async function loadCustomersIxc() {
      const response = await fetch<ICustomersIXCResponse>('/customers-ixc');

      setCustomersIxc(response.data);
    }

    loadCustomersIxc();
  }, []);

  const createCustomerIxc = useCallback(
    async (data: ICreateCustomerIXCDTO): Promise<ICustomerIXC> => {
      const response = await api.post<ICustomerIXC>('/customers-ixc', data);

      const customerIxc = response.data;

      setCustomersIxc([...customersIxc, customerIxc]);

      return customerIxc;
    },
    [customersIxc],
  );

  return (
    <CustomersIXCContext.Provider value={{ customersIxc, createCustomerIxc }}>
      {children}
    </CustomersIXCContext.Provider>
  );
};

function useCustomersIxc(): ICustomersIXCContextData {
  const context = useContext(CustomersIXCContext);

  if (!context) {
    throw new Error(
      "'useCustomersIxc' must be used within an 'CustomersIXCProvider'",
    );
  }

  return context;
}

export { CustomersIXCProvider, useCustomersIxc };
