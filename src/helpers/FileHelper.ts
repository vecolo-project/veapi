export function generatePrefix(): string {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
  const random = ('' + Math.random()).substring(2, 8);
  const random_number = timestamp + random;
  return random_number;
}
