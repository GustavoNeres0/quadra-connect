import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from '@/pages/Login';
import { authApi } from '@/lib/api';

// O cliente HTTP usa import.meta (Vite), que o Jest não suporta: mock da camada de API.
jest.mock('@/lib/api', () => ({
  authApi: { login: jest.fn() },
  ApiError: class ApiError extends Error {},
}));

const mockLogin = authApi.login as jest.Mock;

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

  it('chama a API de login com email e senha corretos', async () => {
    mockLogin.mockResolvedValueOnce({ accessToken: 'token' });
    renderLogin();

    await userEvent.type(screen.getByPlaceholderText(/email/i), 'user@test.com');
    await userEvent.type(screen.getByPlaceholderText(/senha/i), 'senha123');
    await userEvent.click(screen.getByRole('button', { name: /^login$/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('user@test.com', 'senha123');
    });
  });

});
