import IAddressIXC from '@modules/ixc/customers/details/address/models/IAddressIXC';
import IContactIXC from '@modules/ixc/customers/details/contact/models/IContactIXC';
import IMainDetailsIXC from '@modules/ixc/customers/details/main/models/IMainDetailsIXC';

type ITestingCustomersConfig = Array<{
  document: string;
  name: string;
  ixc: {
    active: boolean;
    id: string;
    name: string;
    fantasy_name: string;
    document: string;
    identity: string;
    details: {
      main: IMainDetailsIXC;
      address: IAddressIXC;
      contact: IContactIXC;
    };
  };
}>;

export default [
  {
    document: '044.840.016-24',
    name: 'Karla Angelina Morares Vieira',
    ixc: {
      active: true,
      id: '12636',
      name: 'Karla Angelina Morares Vieira',
      fantasy_name: 'Centro Médico Barreiro',
      document: '044.840.016-24',
      identity: '10320054',
      details: {
        main: {
          birth_date: new Date('1980-04-03T03:00:00.000Z'),
        },
        address: {
          cep: '30640-000',
          address: 'Avenida Sinfrônio Brochado',
          number: '485',
          complement: '1o Andar',
          neighborhood: 'Barreiro',
          city: 'Belo Horizonte',
        },
        contact: {
          phone_mobile: '(31) 99839-0203',
          phone_home: '',
          phone_commercial: '(31) 3384-6936',
          whatsapp: '(31) 99839-0203',
          email: 'centromedicobarreiro2@yahoo.com.br',
        },
      },
    },
  },
  {
    document: '114.922.266-29',
    name: 'Regiane Ferreira Sampaio',
    ixc: {
      active: true,
      id: '13892',
      name: 'Regiane Ferreira Sampaio',
      fantasy_name: '',
      document: '114.922.266-29',
      identity: 'MG-16.131.178',
      details: {
        main: {
          birth_date: new Date('1993-08-13T03:00:00.000Z'),
        },
        address: {
          cep: '30640-000',
          address: 'Avenida Sinfrônio Brochado',
          number: '485',
          complement: '1o Andar',
          neighborhood: 'Barreiro',
          city: 'Belo Horizonte',
        },
        contact: {
          phone_mobile: '(31) 98484-7391',
          phone_home: '',
          phone_commercial: '(31) 3358-6711',
          whatsapp: '(31) 99988-7603',
          email: 'regianefsampaio13@gmail.com',
        },
      },
    },
  },
] as ITestingCustomersConfig;
