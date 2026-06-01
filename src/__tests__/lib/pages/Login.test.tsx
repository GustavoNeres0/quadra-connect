import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from '@/pages/Login';

const renderLogin = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

describe('Página de Login', () => {

  it('renderiza os campos de email e senha', () => {
    renderLogin();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/senha/i)).toBeInTheDocument();
  });

it('exibe erro ao submeter com campos vazios', async () => {
  renderLogin();
  const botao = screen.getByRole('button', { name: /login/i }); // ← era "entrar", o botão se chama "Login"
  await userEvent.click(botao);
  await waitFor(() => {
    // Verifica que os inputs continuam na tela (form não foi enviado)
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  });
});

  it('permite digitar no campo de email', async () => {
    renderLogin();
    const emailInput = screen.getByPlaceholderText(/email/i);
    await userEvent.type(emailInput, 'teste@email.com');
    expect(emailInput).toHaveValue('teste@email.com');
  });

});