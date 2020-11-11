import React, { useCallback, useRef } from 'react';
import { FiBookmark, FiHash, FiTag } from 'react-icons/fi';

import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/core';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import Input from '@/components/Input';
import Switch from '@/components/Switch';
import { useCustomersIxc } from '@/hooks/customers_ixc';
import getValidationErrors from '@/utils/getValidationErrors';

interface IFormData {
  ixc_id: string;
  ixc_name: string;
  conta_azul_name: string;
  status: boolean;
}

interface ICreateCustomerIXCModalProps {
  isOpen: boolean;
  onClose?: (
    event: React.MouseEvent | React.KeyboardEvent,
    reason?: 'pressedEscape' | 'clickedOverlay',
  ) => void;
}

const CreateCustomerIXCModal: React.FC<ICreateCustomerIXCModalProps> = ({
  isOpen,
  onClose,
}) => {
  const formRef = useRef<FormHandles>(null);

  const toast = useToast();

  const { createCustomerIxc } = useCustomersIxc();

  const handleSubmit = useCallback(
    async (data: IFormData, event) => {
      try {
        formRef.current?.setErrors({});

        console.log(data);

        const schema = Yup.object().shape({
          ixc_id: Yup.string().required('ID obrigatório'),
          ixc_name: Yup.string().required('Nome do cliente no IXC obrigatório'),
          conta_azul_name: Yup.string().required(
            'Nome do cliente no Conta Azul obrigatório',
          ),
          status: Yup.boolean().required('Situação obrigatória'),
        });

        await schema.validate(data, { abortEarly: false });

        await createCustomerIxc(data);

        toast({
          status: 'success',
          title: 'Novo cliente do IXC adicionado com sucesso!',
          position: 'top',
          duration: 3000,
        });

        onClose(event);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        toast({
          status: 'error',
          title: 'Erro ao adicionar novo cliente do IXC',
          description:
            'Ocorreu um erro ao tentar adicionar o novo cliente, tente novamente.',
          position: 'top',
          duration: 5000,
        });
      }
    },
    [createCustomerIxc],
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent borderRadius="md">
        <ModalHeader>Adicionar cliente do IXC</ModalHeader>
        <ModalCloseButton />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <ModalBody paddingBottom={4}>
            <Input
              name="ixc_id"
              icon={FiHash}
              placeholder="ID"
              containerProps={{
                border: '1px solid',
                borderColor: 'gray.400',
                bg: 'white',
              }}
            />

            <Input
              name="ixc_name"
              icon={FiBookmark}
              placeholder="Nome do cliente no IXC"
              containerProps={{
                border: '1px solid',
                borderColor: 'gray.400',
                bg: 'white',
                marginTop: 3,
              }}
            />

            <Input
              name="conta_azul_name"
              icon={FiTag}
              placeholder="Nome do cliente no Conta Azul"
              containerProps={{
                border: '1px solid',
                borderColor: 'gray.400',
                bg: 'white',
                marginTop: 3,
              }}
            />

            <Flex justifyContent="flex-end">
              <Switch
                name="status"
                label="Ativo"
                switchProps={{
                  size: 'lg',
                  defaultIsChecked: true,
                }}
                labelProps={{
                  position: 'left',
                  fontSize: 'lg',
                }}
                marginTop={4}
              />
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose} marginRight={4}>
              Cancelar
            </Button>

            <Button type="submit" variantColor="green">
              Confirmar
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  );
};

export default CreateCustomerIXCModal;
