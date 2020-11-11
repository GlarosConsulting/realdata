import 'dotenv/config';

interface IContaAzulConfig {
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
      url: 'https://login.contaazul.com/#/',
    },
  },

  testing: {
    account: {
      email: process.env.CONTA_AZUL_TESTING_ACCOUNT_EMAIL,
      password: process.env.CONTA_AZUL_TESTING_ACCOUNT_PASSWORD,
    },
  },
} as IContaAzulConfig;
