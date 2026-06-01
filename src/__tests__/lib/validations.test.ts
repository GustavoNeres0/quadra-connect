import { registerSchema, validateCPF, validatePhone, formatCPF, formatPhone } from '@/lib/validations';

describe('validateCPF', () => {

  it('aceita CPF válido', () => {
    expect(validateCPF('529.982.247-25')).toBe(true);
  });

  it('rejeita CPF com todos dígitos iguais', () => {
    expect(validateCPF('111.111.111-11')).toBe(false);
  });

  it('rejeita CPF com menos de 11 dígitos', () => {
    expect(validateCPF('123')).toBe(false);
  });

});

describe('validatePhone', () => {

  it('aceita celular válido com DDD', () => {
    expect(validatePhone('(11) 91234-5678')).toBe(true);
  });

  it('rejeita telefone com DDD inválido', () => {
    expect(validatePhone('(00) 91234-5678')).toBe(false);
  });

});

describe('formatCPF', () => {

  it('formata CPF corretamente', () => {
    expect(formatCPF('52998224725')).toBe('529.982.247-25');
  });

});

describe('formatPhone', () => {

  it('formata celular corretamente', () => {
    expect(formatPhone('11912345678')).toBe('(11) 91234-5678');
  });

});

describe('registerSchema', () => {

  it('aceita dados válidos', () => {
    const resultado = registerSchema.safeParse({
      name: 'João Silva',
      email: 'joao@email.com',
      cpf: '529.982.247-25',
      phone: '(11) 91234-5678',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      password: 'senha123',
      confirmPassword: 'senha123',
    });
    expect(resultado.success).toBe(true);
  });

  it('rejeita quando senhas não coincidem', () => {
    const resultado = registerSchema.safeParse({
      name: 'João Silva',
      email: 'joao@email.com',
      cpf: '529.982.247-25',
      phone: '(11) 91234-5678',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      password: 'senha123',
      confirmPassword: 'outrasenha',
    });
    expect(resultado.success).toBe(false);
  });

});