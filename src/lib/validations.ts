import { z } from 'zod';

// Validação de CPF
export const validateCPF = (cpf: string): boolean => {
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  
  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (digit !== parseInt(cleanCPF.charAt(9))) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (digit !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
};

// Validação de telefone brasileiro
export const validatePhone = (phone: string): boolean => {
  // Remove caracteres não numéricos
  const cleanPhone = phone.replace(/[^\d]/g, '');
  
  // Verifica se tem 10 ou 11 dígitos (com DDD)
  if (cleanPhone.length < 10 || cleanPhone.length > 11) return false;
  
  // Verifica se o DDD é válido (11 a 99)
  const ddd = parseInt(cleanPhone.substring(0, 2));
  const validDDDs = [
    11, 12, 13, 14, 15, 16, 17, 18, 19, // SP
    21, 22, 24, // RJ
    27, 28, // ES
    31, 32, 33, 34, 35, 37, 38, // MG
    41, 42, 43, 44, 45, 46, // PR
    47, 48, 49, // SC
    51, 53, 54, 55, // RS
    61, // DF
    62, 64, // GO
    63, // TO
    65, 66, // MT
    67, // MS
    68, // AC
    69, // RO
    71, 73, 74, 75, 77, // BA
    79, // SE
    81, 87, // PE
    82, // AL
    83, // PB
    84, // RN
    85, 88, // CE
    86, 89, // PI
    91, 93, 94, // PA
    92, 97, // AM
    95, // RR
    96, // AP
    98, 99, // MA
  ];
  
  if (!validDDDs.includes(ddd)) return false;
  
  // Para celular (11 dígitos), o terceiro dígito deve ser 9
  if (cleanPhone.length === 11 && cleanPhone.charAt(2) !== '9') return false;
  
  return true;
};

// Formatação de CPF
export const formatCPF = (value: string): string => {
  const cleanValue = value.replace(/[^\d]/g, '');
  if (cleanValue.length <= 3) return cleanValue;
  if (cleanValue.length <= 6) return `${cleanValue.slice(0, 3)}.${cleanValue.slice(3)}`;
  if (cleanValue.length <= 9) return `${cleanValue.slice(0, 3)}.${cleanValue.slice(3, 6)}.${cleanValue.slice(6)}`;
  return `${cleanValue.slice(0, 3)}.${cleanValue.slice(3, 6)}.${cleanValue.slice(6, 9)}-${cleanValue.slice(9, 11)}`;
};

// Formatação de telefone
export const formatPhone = (value: string): string => {
  const cleanValue = value.replace(/[^\d]/g, '');
  if (cleanValue.length <= 2) return cleanValue;
  if (cleanValue.length <= 6) return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2)}`;
  if (cleanValue.length <= 10) return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2, 6)}-${cleanValue.slice(6)}`;
  return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2, 7)}-${cleanValue.slice(7, 11)}`;
};

// Função para mascarar CPF (mostra apenas os 3 primeiros e 2 últimos dígitos)
export const maskCPF = (cpf: string): string => {
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  if (cleanCPF.length !== 11) return cpf;
  return `${cleanCPF.slice(0, 3)}.***.***-${cleanCPF.slice(9)}`;
};

// Função para mascarar telefone (mostra apenas os 2 primeiros e 4 últimos dígitos)
export const maskPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/[^\d]/g, '');
  if (cleanPhone.length < 10) return phone;
  if (cleanPhone.length === 10) {
    return `(${cleanPhone.slice(0, 2)}) ****-${cleanPhone.slice(6)}`;
  }
  return `(${cleanPhone.slice(0, 2)}) *****-${cleanPhone.slice(7)}`;
};

// Schema de validação para registro de usuário
export const registerSchema = z.object({
  name: z.string()
    .trim()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras"),
  email: z.string()
    .trim()
    .email("Email inválido")
    .max(255, "Email deve ter no máximo 255 caracteres"),
  cpf: z.string()
    .trim()
    .refine(validateCPF, "CPF inválido"),
  phone: z.string()
    .trim()
    .refine(validatePhone, "Telefone inválido"),
  address: z.string()
    .trim()
    .min(5, "Endereço deve ter no mínimo 5 caracteres")
    .max(200, "Endereço deve ter no máximo 200 caracteres"),
  city: z.string()
    .trim()
    .min(2, "Cidade deve ter no mínimo 2 caracteres")
    .max(100, "Cidade deve ter no máximo 100 caracteres"),
  state: z.string()
    .trim()
    .length(2, "Estado deve ter 2 caracteres")
    .toUpperCase(),
  password: z.string()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .max(100, "Senha deve ter no máximo 100 caracteres"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
