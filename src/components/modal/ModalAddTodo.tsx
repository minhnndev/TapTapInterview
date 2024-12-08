import React from 'react';
import {Priority} from '../../types';
import {TodoForm} from '../TodoForm';
import ModalBase from './ModalBase';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (title: string, dueDate: string, priority: Priority) => void;
}

const ModalAddTodo = ({visible, onClose}: Props) => {
  return (
    <ModalBase visible={visible} onClose={onClose}>
      <TodoForm
        itemInitial={{
          id: '',
          title: '',
          dueDate: new Date().toISOString(),
          priority: Priority.MEDIUM,
          completed: false,
          createdAt: new Date().toISOString(),
          selected: false,
        }}
        onCancel={() => onClose()}
      />
    </ModalBase>
  );
};

export default ModalAddTodo;
