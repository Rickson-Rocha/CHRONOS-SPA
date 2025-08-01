// src/utils/masks.ts

export const cpfMask = (value: string): string => {
  if (!value) return "";

  // Remove tudo que não for dígito
  const onlyNums = value.replace(/[^\d]/g, '');

  // Limita a 11 dígitos
  if (onlyNums.length <= 11) {
    let maskedValue = onlyNums;
    maskedValue = maskedValue.replace(/(\d{3})(\d)/, '$1.$2');
    maskedValue = maskedValue.replace(/(\d{3})(\d)/, '$1.$2');
    maskedValue = maskedValue.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return maskedValue;
  }
  
  // Se for maior que 11, não permite mais digitação
  return value.slice(0, 14);
};