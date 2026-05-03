/**
 * Formatea un monto numérico a la moneda local (Bolívar Venezolano - Bs.)
 * @param amount El monto a formatear
 * @param includeSymbol Si es true, incluye 'Bs.' al inicio. Default: true
 * @returns String formateado (ej. "Bs. 1.000,00")
 */
export const formatCurrency = (amount: number, includeSymbol: boolean = true): string => {
  const formattedAmount = amount.toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return includeSymbol ? `Bs. ${formattedAmount}` : formattedAmount;
};

/**
 * Devuelve el monto formateado dividido en partes (entero y decimal)
 * Útil para dar diferentes estilos a los decimales.
 */
export const formatCurrencyParts = (amount: number): { integerPart: string; decimalPart: string } => {
  const formatted = amount.toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  const separatorIndex = formatted.lastIndexOf(',');
  
  if (separatorIndex === -1) {
    return { integerPart: formatted, decimalPart: ',00' };
  }
  
  return {
    integerPart: formatted.substring(0, separatorIndex),
    decimalPart: formatted.substring(separatorIndex)
  };
};
