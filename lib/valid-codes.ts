/* Códigos válidos para canjear 30 min sin pasos.
   El administrador añade aquí el código del día, ej:
   "PERSONS-22-11-2026".
*/
export const VALID_CODES: string[] = [
  // Ejemplo: "PERSONS-22-11-2026",
];

export function isValidCode(code: string): boolean {
  return VALID_CODES.includes(code.trim().toUpperCase());
}
