import { parse } from 'date-fns';

export default function parseDate(
  dateString: string,
  formatString = 'dd/MM/yyyy',
): Date {
  if (!dateString) return undefined;

  const parsedDate = parse(dateString, formatString, Date.now());

  return parsedDate;
}
