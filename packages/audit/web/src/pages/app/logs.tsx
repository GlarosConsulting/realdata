import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import { FiUsers } from 'react-icons/fi';
import { Column } from 'react-table';

import { Box, Button, Text, Tooltip, useTheme } from '@chakra-ui/core';
import { format, parseISO } from 'date-fns';

import SEO from '@/components/SEO';
import Sidebar from '@/components/Sidebar';
import Table from '@/components/Table';
import Title from '@/components/Title';
import { useLogs } from '@/hooks/logs';
import ILog from '@/interfaces/logs/ILog';
import ILogFormatted from '@/interfaces/logs/ILogFormatted';

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

interface ILogFormattedWithComponents
  extends Omit<ILogFormatted, 'discharge_performed_formatted'> {
  discharge_performed_formatted: React.ReactNode;
}

const Logs: React.FC = () => {
  const theme = useTheme();

  const router = useRouter();

  const { logs, performDischarge } = useLogs();

  const handleGoToCustomersIXC = useCallback(() => {
    router.replace('/app/ixc');
  }, []);

  const handlePerformDischarge = useCallback(async (log: ILog) => {
    await performDischarge(log);
  }, []);

  const formattedLogs = useMemo(
    () =>
      logs?.map<ILogFormattedWithComponents>(log => ({
        ...log,
        date_formatted: format(parseISO(log.date), 'dd/MM/yyyy'),
        conta_azul_existing_formatted: log.conta_azul_existing ? 'Sim' : 'Não',
        discharge_performed_formatted: (
          <>
            <Text width={10}>{log.discharge_performed ? 'Sim' : 'Não'}</Text>
            <Button onClick={() => handlePerformDischarge(log)}>
              Alternar
            </Button>
          </>
        ),
      })) || [],
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

          <Table columns={COLUMNS} data={formattedLogs} />
        </Box>
      </Box>
    </>
  );
};

export default Logs;
