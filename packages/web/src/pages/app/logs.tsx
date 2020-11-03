import React from 'react';
import { FiPlus, FiUsers } from 'react-icons/fi';
import { Column } from 'react-table';

import { Box, Button, Tooltip, useTheme } from '@chakra-ui/core';

import SEO from '@/components/SEO';
import Sidebar from '@/components/Sidebar';
import Table from '@/components/Table';
import Title from '@/components/Title';

const COLUMNS = [
  {
    Header: 'Data',
    accessor: 'date_formatted',
  },
  {
    Header: 'Cliente IXC',
    accessor: 'ixc_id',
  },
  {
    Header: 'Lançamento ID',
    accessor: 'projection_id',
  },
  {
    Header: 'Existia no Conta Azul',
    accessor: 'existing',
  },
  {
    Header: 'Baixa realizada',
    accessor: 'discharge_performed',
  },
] as Column[];

const App: React.FC = () => {
  const theme = useTheme();

  return (
    <>
      <SEO
        title="Histórico"
        image="og/boost.png"
        description="Histórico de ações"
      />

      <Sidebar
        top={
          <Tooltip
            label="Clientes pesquisados no IXC"
            aria-label="Clientes pesquisados no IXC"
          >
            <Button
              bg="green.400"
              padding={1}
              borderRadius="50%"
              _hover={{
                bg: 'green.300',
              }}
            >
              <FiUsers size={theme.sizes[5]} color={theme.colors.white} />
            </Button>
          </Tooltip>
        }
      />

      <Box as="main" marginLeft={24} marginY={6} paddingRight={8}>
        <Box>
          <Title>Histórico</Title>

          <Table
            columns={COLUMNS}
            data={[
              {
                date_formatted: '01/01/2020',
                ixc_id: '123',
                projection_id: '321',
                existing: 'Sim',
                discharge_performed: 'Sim',
              },
              {
                date_formatted: '11/01/2020',
                ixc_id: '456',
                projection_id: '654',
                existing: 'Sim',
                discharge_performed: 'Não',
              },
              {
                date_formatted: '26/01/2020',
                ixc_id: '789',
                projection_id: '987',
                existing: 'Sim',
                discharge_performed: 'Sim',
              },
            ]}
            pageSize={5}
          />
        </Box>
      </Box>
    </>
  );
};

export default App;
