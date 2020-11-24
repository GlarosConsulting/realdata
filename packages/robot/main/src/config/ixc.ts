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
  },
} as IRobotIXCConfig;
