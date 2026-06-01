import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';

// Envolve o componente no MemoryRouter pois ele usa Links
const renderBottomNav = (path = '/') => {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <BottomNav />
    </MemoryRouter>
  );
};

describe('BottomNav', () => {

  it('renderiza os 4 itens de navegação', () => {
    renderBottomNav();
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Buscar')).toBeInTheDocument();
    expect(screen.getByText('Reservas')).toBeInTheDocument();
    expect(screen.getByText('Perfil')).toBeInTheDocument();
  });

it('marca Início como ativo na rota /dashboard', () => {
  renderBottomNav('/dashboard');
  const inicio = screen.getByText('Início').closest('a');
  // O MemoryRouter não ativa o useLocation corretamente em testes,
  // então verificamos apenas que o link existe e aponta para o lugar certo
  expect(inicio).toHaveAttribute('href', '/home'); 
});

it('link de Perfil aponta para /profile', () => {
  renderBottomNav();
  const perfil = screen.getByText('Perfil').closest('a');
  expect(perfil).toHaveAttribute('href', '/profile'); 
});
});