export default function createRangeArray(start: number, end: number): number[] {
  return (Array(end - start + 1) as any).fill().map((_, idx) => start + idx);
}
