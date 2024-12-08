import dayjs from 'dayjs';
import {Priority} from '../types';

export const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case Priority.HIGH:
      return '#4CAF50';
    case Priority.MEDIUM:
      return '#FFA000';
    case Priority.LOW:
      return '#757575';
  }
};

export const getPriorityTextButton = (priority: Priority) => {
  switch (priority) {
    case Priority.HIGH:
      return 'Cao';
    case Priority.MEDIUM:
      return 'Trung bình';
    case Priority.LOW:
      return 'Thấp';
  }
};

export const getPriorityText = (priority: Priority) => {
  switch (priority) {
    case Priority.HIGH:
      return 'Ưu tiên cao';
    case Priority.MEDIUM:
      return 'Ưu tiên trung bình';
    case Priority.LOW:
      return 'Ưu tiên thấp';
  }
};

export const getDueDateText = (date: string) => {
  const currentDate = dayjs();
  const dueDate = dayjs(date);
  const diff = dueDate.diff(currentDate, 'day');

  if (currentDate.isAfter(dueDate, 'day')) {
    return 'Quá hạn';
  }
  if (diff === 0) {
    return 'Hôm nay';
  }
  if (diff === 1) {
    return 'Ngày mai';
  }
  return `Còn ${diff} ngày`;
};
