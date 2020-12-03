export default function formatRealValue(value?: number): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}
