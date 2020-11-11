import 'dotenv/config';

interface IRobotIXCConfig {
  pages: {
    login: {
      url: string;
    };
  };

  testing: {
    account: {
      email: string;
      password: string;
    };
    customers: Array<{
      id: string;
      name: string;
    }>;
  };
}

export default {
  pages: {
    login: {
      url: 'https://central.realdata.com.br/login.php',
    },
  },

  testing: {
    account: {
      email: process.env.IXC_TESTING_ACCOUNT_EMAIL,
      password: process.env.IXC_TESTING_ACCOUNT_PASSWORD,
    },
    customers: [
      {
        id: '13892',
        name: 'Regiane Ferreira Sampaio',
      },
      {
        id: '12636',
        name: 'Karla Angelina Morares Vieira',
      },
    ],
  },
} as IRobotIXCConfig;
