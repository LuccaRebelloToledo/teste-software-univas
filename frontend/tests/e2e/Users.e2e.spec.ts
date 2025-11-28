import { test, expect } from '@playwright/test';

const uniqueEmail = `aluno.${Date.now()}@ex.com`;

test.describe('Usuários', () => {
  test('navega para Usuários e lista itens do backend', async ({ page }) => {
    await page.goto('/') // Dashboard
    await page.getByRole('link', { name: 'Usuários' }).click()
    // Título da seção
    await expect(page.getByRole('heading', { name: /Usuários/i })).toBeVisible()
    // Emails semeados (seed do backend)
    await expect(page.getByText(/john.doe@example.com/i)).toBeVisible()
    await expect(page.getByText(/jane.smith@example.com/i)).toBeVisible()
  });

  test('cria usuário e aparece na lista', async ({ page }) => {
    await page.goto('/users')
    await page.getByRole('button', { name: /Adicionar Usuário/i }).click()
    await page.getByLabel('Nome:').fill('Aluno E2E')
    await page.getByLabel('Email:').fill(uniqueEmail)  
    await page.getByRole('button', { name: /Criar/i }).click()
      // Aguarda recarga da lista
    await expect(page.getByText(uniqueEmail)).toBeVisible()
  });

test('edita usuário e reflete na lista', async ({ page }) => {
    await page.goto('/users')
    // Encontra o usuário criado anteriormente e clica em editar
    await page.getByRole('row', { name: new RegExp(uniqueEmail) })
      .getByRole('button', { name: /Editar/i })
      .click()
    // Modifica o nome
    await page.getByLabel('Nome:').fill('Aluno E2E Editado')
    await page.getByRole('button', { name: /Atualizar/i }).click()
    // Aguarda recarga da lista
    await expect(page.getByRole('row', { name: new RegExp(uniqueEmail) }))
      .toHaveText(/Aluno E2E Editado/)
  });

  test('deleta usuário e desaparece da lista', async ({ page }) => {
    await page.goto('/users')
    
    page.once('dialog', (dialog) => {
      expect(dialog.message()).toContain('Tem certeza que deseja excluir este usuário?');
      expect(dialog.type()).toBe('confirm');
      dialog.accept();
    });
    
    // Encontra o usuário editado anteriormente e clica em deletar
    await page.getByRole('row', { name: new RegExp(uniqueEmail) })
      .getByRole('button', { name: /Excluir/i })
      .click()
    
    // Aguarda recarga da lista
    await expect(page.getByText(uniqueEmail)).not.toBeVisible()
  });
});