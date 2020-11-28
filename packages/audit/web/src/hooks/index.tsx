import React from 'react';

import { AuthenticationProvider } from './authentication';
import { CustomersIXCProvider } from './customers_ixc';
import { LogsProvider } from './logs';

const AppProvider: React.FC = ({ children }) => (
  <AuthenticationProvider>
    <LogsProvider>
      <CustomersIXCProvider>{children}</CustomersIXCProvider>
    </LogsProvider>
  </AuthenticationProvider>
);

export default AppProvider;
