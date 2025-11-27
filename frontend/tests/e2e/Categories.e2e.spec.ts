import { test, expect } from '@playwright/test';

let categoryTitle = `Título.${Date.now()}`;
let categoryDescription = 'Descrição';

test.describe('Categorias', () => {
  test('navega para Categorias e lista itens do backend', async ({ page }) => {
    await page.goto('/') // Dashboard
    await page.getByRole('link', { name: 'Categorias' }).click()
    // Título da seção
    await expect(page.getByRole('heading', { name: /Categorias/i })).toBeVisible()
    // Categorias semeados (seed do backend) - busca por linhas na tabela
    await expect(page.getByRole('row', { name: /Study/i })).toBeVisible()
    await expect(page.getByRole('row', { name: /Personal/i })).toBeVisible()
    await expect(page.getByRole('row', { name: /Work/i })).toBeVisible()
  });

  test('cria categoria e aparece na lista', async ({ page }) => {
    await page.goto('/categories')
    await page.getByRole('button', { name: /Adicionar Categoria/i }).click()
    await page.getByLabel('Nome:').fill(categoryTitle)  
    await page.getByLabel('Descrição:').fill(categoryDescription)
    await page.getByRole('button', { name: /Criar/i }).click()
      // Aguarda recarga da lista
    await expect(page.getByText(categoryTitle)).toBeVisible()
  });

test('edita categoria e reflete na lista', async ({ page }) => {
    await page.goto('/categories')
    // Encontra a categoria criada anteriormente e clica em editar
    await page.getByRole('row', { name: new RegExp(categoryTitle) })
      .getByRole('button', { name: /Editar/i })
      .click()

    // Modifica o nome
    categoryTitle = 'Título editado.';
    categoryDescription = 'Descrição editada.';

    await page.getByLabel('Nome:').fill(categoryTitle)
    await page.getByLabel('Descrição:').fill(categoryDescription)
    await page.getByRole('button', { name: /Atualizar/i }).click()

    // Aguarda recarga da lista e verifica se a categoria editada está visível
    await expect(page.getByRole('row', { name: new RegExp(categoryTitle) }))
      .toBeVisible()
  });

  test('deleta categoria e desaparece da lista', async ({ page }) => {
    await page.goto('/categories')
    
    // Configura o listener para aceitar o diálogo de confirmação
    page.on('dialog', dialog => dialog.accept())
    
    // Encontra a categoria editada anteriormente e clica em deletar
    await page.getByRole('row', { name: new RegExp(categoryTitle) })
      .getByRole('button', { name: /Excluir/i })
      .click()
    
    // Aguarda recarga da lista
    await expect(page.getByText(categoryTitle)).not.toBeVisible()
  });
});