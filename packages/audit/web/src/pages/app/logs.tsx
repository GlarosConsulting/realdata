import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FiUsers } from 'react-icons/fi';
import { Column } from 'react-table';

import { Box, Button, Input, Text, Tooltip, useTheme } from '@chakra-ui/core';
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

  const [filteredLogs, setFilteredLogs] = useState(logs);

  const [search, setSearch] = useState('');

  const formatLogs = useCallback(
    (list: ILog[]) =>
      list?.map<ILogFormattedWithComponents>(log => ({
        ...log,
        date_formatted: format(parseISO(log.date), 'dd/MM/yyyy'),
        conta_azul_existing_formatted: log.conta_azul_existing ? 'Sim' : 'Não',
        discharge_performed_formatted: (
          <>
            <Text width={10}>{log.discharge_performed ? 'Sim' : 'Não'}</Text>
            <Button onClick={() => performDischarge(log)}>Alternar</Button>
          </>
        ),
      })),
    [],
  );

  const formattedLogs = useMemo(() => formatLogs(filteredLogs) || [], [
    filteredLogs,
  ]);

  useEffect(() => {
    setFilteredLogs(logs);
  }, [logs]);

  useEffect(() => {
    if (!search) {
      setFilteredLogs(logs);
      return;
    }

    console.log(search);

    const localFormattedLogs = formatLogs(logs);

    const searchedLogs = localFormattedLogs.filter(log => {
      const values = Object.values(log);

      console.log(log);

      const found = values.some(
        val => String(val).toLowerCase().indexOf(search.toLowerCase()) > -1,
      );

      return found;
    });

    setFilteredLogs(searchedLogs);
  }, [search]);

  const handleGoToCustomersIXC = useCallback(() => {
    router.replace('/app/ixc');
  }, []);

  const handleChangeSearch = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      setSearch(event.currentTarget.value);
    },
    [],
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
          <Title>
            Histórico
            <Input
              placeholder="Pesquisar"
              width={56}
              marginTop="-10px"
              borderColor="gray.300"
              _focusWithin={{
                borderColor: 'blue.50',
              }}
              onChange={handleChangeSearch}
            />
          </Title>

          <Table columns={COLUMNS} data={formattedLogs} />
        </Box>
      </Box>
    </>
  );
};

export default Logs;
