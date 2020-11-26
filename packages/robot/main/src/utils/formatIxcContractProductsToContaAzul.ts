import IContractProductItemContaAzul from '@modules/conta_azul/contracts/create/models/IContractProductItemContaAzul';
import { IContractProductItem } from '@modules/ixc/customers/details/contract/models/IContractProducts';

interface IFilterIXC {
  column: string;
  value: {
    equals?: string | string[];
    contains?: string | string[];
  };
}

interface IMappedProducts {
  ixc: IFilterIXC[][];
  conta_azul: {
    name: string;
  };
}

const MAPPED_PRODUCTS: IMappedProducts[] = [
  {
    ixc: [
      [
        {
          column: 'service',
          value: {
            equals: 'Contrato Suporte TI',
          },
        },
      ],
    ],
    conta_azul: {
      name: 'Contrato de Manutenção Corretiva e Preventiva em TI',
    },
  },
  {
    ixc: [
      [
        {
          column: 'plan',
          value: {
            equals: 'Servico_de_IP32',
          },
        },
      ],
    ],
    conta_azul: {
      name: 'Serviço IP Fixo',
    },
  },
  {
    ixc: [
      [
        {
          column: 'description',
          value: {
            contains: 'telef',
          },
        },
        {
          column: 'service',
          value: {
            equals: 'Telefone via Internet',
          },
        },
      ],
    ],
    conta_azul: {
      name: 'Telefone Fixo via Internet',
    },
  },
  {
    ixc: [
      [
        {
          column: 'description',
          value: {
            contains: ['PABX', 'rama'],
          },
        },
        {
          column: 'service',
          value: {
            equals: 'Telefone via Internet',
          },
        },
      ],
    ],
    conta_azul: {
      name: 'PABX Digital',
    },
  },
  {
    ixc: [
      [
        {
          column: 'plan',
          value: {
            equals: 'DownloadE_100Mb_UploadE_100Mb',
          },
        },
      ],
      [
        {
          column: 'description',
          value: {
            equals: 'Serviço de Conexão à Internet - SCI',
          },
        },
      ],
    ],
    conta_azul: {
      name: 'Banda Larga Fiber 100Mbps Empresarial',
    },
  },
  {
    ixc: [
      [
        {
          column: 'plan',
          value: {
            equals: 'DownloadE_200Mb_UploadE_200Mb',
          },
        },
      ],
      [
        {
          column: 'description',
          value: {
            equals: 'Serviço de Conexão à Internet - SCI',
          },
        },
      ],
    ],
    conta_azul: {
      name: 'Banda Larga Fiber 200Mbps Empresarial',
    },
  },
];

export default function formatIxcContractProductsToContaAzul(
  ixcContractProducts: IContractProductItem[],
): IContractProductItemContaAzul[] {
  const products: IContractProductItemContaAzul[] = [];

  ixcContractProducts.forEach(ixcProduct => {
    const product = MAPPED_PRODUCTS.find(mappedProduct =>
      mappedProduct.ixc.some(ixcFilters =>
        ixcFilters.some(filter => {
          const value = String(ixcProduct[filter.column]).toLowerCase();

          if (filter.value.equals) {
            if (Array.isArray(filter.value.equals)) {
              return filter.value.equals.some(
                compare => value === compare.toLowerCase(),
              );
            }

            return value === filter.value.equals.toLowerCase();
          }

          if (filter.value.contains) {
            if (Array.isArray(filter.value.contains)) {
              return filter.value.contains.some(compare =>
                value.includes(compare.toLowerCase()),
              );
            }

            return value.includes(filter.value.contains.toLowerCase());
          }

          return true;
        }),
      ),
    );

    const contaAzulProduct: IContractProductItemContaAzul = {
      name: product.conta_azul.name,
      description: ixcProduct.description,
      amount: ixcProduct.amount,
      unit_value: ixcProduct.unit_value,
    };

    products.push(contaAzulProduct);
  });

  return products;
}
