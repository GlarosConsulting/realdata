import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import { FiArrowLeft, FiPlus } from 'react-icons/fi';
import { Column } from 'react-table';

import { Box, Button, Tooltip, useDisclosure, useTheme } from '@chakra-ui/core';

import CreateCustomerIXCModal from '@/components/_pages/app/ixc/CreateCustomerICXModal';
import SEO from '@/components/SEO';
import Sidebar from '@/components/Sidebar';
import Table from '@/components/Table';
import Title from '@/components/Title';
import { useCustomersIxc } from '@/hooks/customers_ixc';
import ICustomerIXCFormatted from '@/interfaces/customers_ixc/ICustomerIXCFormatted';

const COLUMNS = [
  {
    Header: 'ID',
    accessor: 'ixc_id',
  },
  {
    Header: 'Nome do cliente IXC',
    accessor: 'ixc_name',
  },
  {
    Header: 'Nome do cliente Conta Azul',
    accessor: 'conta_azul_name',
  },
  {
    Header: 'Situação',
    accessor: 'status_formatted',
  },
] as Column[];

const IXC: React.FC = () => {
  const theme = useTheme();

  const router = useRouter();

  const {
    isOpen: isCreateCustomerIXCOpen,
    onOpen: onOpenCreateCustomerIXC,
    onClose: onCloseCreateCustomerIXC,
  } = useDisclosure();

  const { customersIxc } = useCustomersIxc();

  const handleGoBack = useCallback(() => {
    router.replace('/app/logs');
  }, []);

  const handleOpenCreateCustomerIXCModal = useCallback(() => {
    onOpenCreateCustomerIXC();
  }, []);

  const formattedCustomersIxc = useMemo(
    () =>
      customersIxc?.map<ICustomerIXCFormatted>(customerIxc => ({
        ...customerIxc,
        status_formatted: customerIxc.status ? 'Ativo' : 'Inativo',
      })) || [],
    [customersIxc],
  );

  return (
    <>
      <SEO
        title="Clientes do IXC"
        image="og/boost.png"
        description="Lista de clientes do IXC"
      />

      <Sidebar
        top={
          <Tooltip label="Voltar" aria-label="Voltar">
            <Button
              bg="green.400"
              padding={1}
              borderRadius="50%"
              _hover={{
                bg: 'green.300',
              }}
              onClick={handleGoBack}
            >
              <FiArrowLeft size={theme.sizes[6]} color={theme.colors.white} />
            </Button>
          </Tooltip>
        }
        middle={
          <Tooltip
            label="Adicionar novo cliente do IXC"
            aria-label="Adicionar novo cliente do IXC"
          >
            <Button
              bg="green.400"
              padding={1}
              borderRadius="50%"
              marginTop={16}
              _hover={{
                bg: 'green.300',
              }}
              onClick={handleOpenCreateCustomerIXCModal}
            >
              <FiPlus size={theme.sizes[8]} color={theme.colors.white} />
            </Button>
          </Tooltip>
        }
      />

      <CreateCustomerIXCModal
        isOpen={isCreateCustomerIXCOpen}
        onClose={onCloseCreateCustomerIXC}
      />

      <Box as="main" marginLeft={24} marginY={6} paddingRight={8}>
        <Box>
          <Title>Clientes do IXC</Title>

          <Table columns={COLUMNS} data={formattedCustomersIxc} pageSize={5} />
        </Box>
      </Box>
    </>
  );
};

export default IXC;
