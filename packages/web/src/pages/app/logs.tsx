import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import { FiUsers } from 'react-icons/fi';
import { Column } from 'react-table';

import { Box, Button, Tooltip, useTheme } from '@chakra-ui/core';
import { format, parseISO } from 'date-fns';

import SEO from '@/components/SEO';
import Sidebar from '@/components/Sidebar';
import Table from '@/components/Table';
import Title from '@/components/Title';
import ILog from '@/interfaces/logs/ILog';
import ILogFormatted from '@/interfaces/logs/ILogFormatted';
import fetch from '@/lib/fetch';

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
    accessor: 'conta_azul_existing_formatted',
  },
  {
    Header: 'Baixa realizada',
    accessor: 'discharge_performed_formatted',
  },
] as Column[];

interface IAppProps {
  logs: ILog[];
}

const App: React.FC<IAppProps> = ({ logs }) => {
  const theme = useTheme();

  const router = useRouter();

  const handleGoToCustomersIXC = useCallback(() => {
    router.replace('/app/ixc');
  }, []);

  const formattedLogs = useMemo(
    () =>
      logs.map<ILogFormatted>(log => ({
        ...log,
        date_formatted: format(parseISO(log.date), 'dd/MM/yyyy'),
        conta_azul_existing_formatted: log.conta_azul_existing ? 'Sim' : 'Não',
        discharge_performed_formatted: log.discharge_performed ? 'Sim' : 'Não',
      })),
    [logs],
  );

  return (
    <>
      <SEO
        title="Histórico"
        image="og/boost.png"
        description="Lista de histórico de ações"
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
              onClick={handleGoToCustomersIXC}
            >
              <FiUsers size={theme.sizes[5]} color={theme.colors.white} />
            </Button>
          </Tooltip>
        }
      />

      <Box as="main" marginLeft={24} marginY={6} paddingRight={8}>
        <Box>
          <Title>Histórico</Title>

          <Table columns={COLUMNS} data={formattedLogs} pageSize={5} />
        </Box>
      </Box>
    </>
  );
};

export const getStaticProps: GetStaticProps<IAppProps> = async () => {
  const response = await fetch<ILog[]>('/logs');

  return {
    props: {
      logs: response.data,
    },
    revalidate: 10,
  };
};

export default App;
