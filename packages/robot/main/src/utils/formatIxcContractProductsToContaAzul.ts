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
            equals: 'Telefonia via Internet',
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
            equals: 'Telefonia via Internet',
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
            equals: 'DownloadR_100Mb_UploadR_100Mb',
          },
        },
      ],
      [
        {
          column: 'description',
          value: {
            contains: 'Serviço de Conexão à Internet',
          },
        },
      ],
    ],
    conta_azul: {
      name: 'Banda Larga Fiber 100Mbps Residencial',
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
            contains: 'Serviço de Conexão à Internet',
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
            equals: 'DownloadR_200Mb_UploadR_200Mb',
          },
        },
      ],
      [
        {
          column: 'description',
          value: {
            contains: 'Serviço de Conexão à Internet',
          },
        },
      ],
    ],
    conta_azul: {
      name: 'Banda Larga Fiber 200Mbps Residencial',
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
            contains: 'Serviço de Conexão à Internet',
          },
        },
      ],
    ],
    conta_azul: {
      name: 'Banda Larga Fiber 200Mbps Empresarial',
    },
  },
];

const validate = (product: IContractProductItem, filter: IFilterIXC) => {
  const value = String(product[filter.column]).toLowerCase();

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
};

export default function formatIxcContractProductsToContaAzul(
  ixcContractProducts: IContractProductItem[],
): IContractProductItemContaAzul[] {
  const products: IContractProductItemContaAzul[] = [];

  const ignoreIds: string[] = [];

  for (const ixcContractProduct of ixcContractProducts) {
    if (ignoreIds.includes(ixcContractProduct.id)) {
      continue;
    }

    let joinProducts: IContractProductItem[] = [];

    const findMappedProduct = MAPPED_PRODUCTS.find(mappedProduct => {
      let filterJoinProducts: IContractProductItem[] = [];

      if (mappedProduct.ixc.length <= 1) {
        return mappedProduct.ixc.some(filters =>
          filters.every(filter => validate(ixcContractProduct, filter)),
        );
      }

      filterJoinProducts = ixcContractProducts.filter(item =>
        mappedProduct.ixc.some(filters =>
          filters.every(filter => validate(item, filter)),
        ),
      );

      if (filterJoinProducts.length !== mappedProduct.ixc.length) {
        return false;
      }

      joinProducts = filterJoinProducts;

      const mappedIds = filterJoinProducts.map(joinProduct => joinProduct.id);

      ignoreIds.push(...mappedIds);

      return true;
    });

    if (!findMappedProduct) {
      continue;
    }

    let { unit_value } = ixcContractProduct;

    if (joinProducts.length !== 0) {
      unit_value = joinProducts.reduce(
        (value, product) => value + product.unit_value,
        0,
      );
    }

    const contaAzulProduct: IContractProductItemContaAzul = {
      name: findMappedProduct.conta_azul.name,
      description: ixcContractProduct.description,
      amount: ixcContractProduct.amount,
      unit_value,
    };

    products.push(contaAzulProduct);
  }

  return products;
}
