import React from 'react';

import { AuthenticationProvider } from './authentication';
import { CustomersIXCProvider } from './customers_ixc';

const AppProvider: React.FC = ({ children }) => (
  <AuthenticationProvider>
    <CustomersIXCProvider>{children}</CustomersIXCProvider>
  </AuthenticationProvider>
);

export default AppProvider;
