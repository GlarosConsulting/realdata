import 'dotenv/config';

interface IContaAzulConfig {
  pages: {
    login: {
      url: string;
    };
    customers: {
      url: string;
    };
    bills_to_receive: {
      url: string;
    };
  };

  testing: {
    account: {
      email: string;
      password: string;
    };
    customers: Array<{
      document: string;
      name: string;
    }>;
  };
}

export default {
  pages: {
    login: {
      url: 'https://login.contaazul.com/#/',
    },
    customers: {
      url: 'https://app.contaazul.com/#/ca/pessoas/clientes',
    },
    bills_to_receive: {
      url:
        'https://app.contaazul.com/#/financeiro/contas-a-receber?view=revenue&amp;source=Financeiro%20%3E%20Contas%20a%20Receber',
    },
  },

  testing: {
    account: {
      email: process.env.CONTA_AZUL_TESTING_ACCOUNT_EMAIL,
      password: process.env.CONTA_AZUL_TESTING_ACCOUNT_PASSWORD,
    },
    customers: [
      {
        document: '044.840.016-24',
        name: 'Karla Angelina Morares Vieira',
      },
      {
        document: '114.922.266-29',
        name: 'Regiane Ferreira Sampaio',
      },
    ],
  },
} as IContaAzulConfig;
