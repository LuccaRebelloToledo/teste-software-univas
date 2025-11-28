import { test, expect } from '@playwright/test';

let taskTitle = `Tarefa.${Date.now()}`;
let taskDescription = 'Descrição';

const userNamesFromSeed = ['John Doe', 'Jane Smith'];
const categoryNamesFromSeed = ['Work', 'Personal', 'Study'];
const priorityOptions = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
const statusOptions = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

test.describe('Tarefas', () => {
  test('navega para Tarefas e lista itens do backend', async ({ page }) => {
    await page.goto('/') // Dashboard
    await page.getByRole('link', { name: 'Tarefas' }).click()
    // Título da seção
    await expect(page.getByRole('heading', { name: /Tarefas/i })).toBeVisible()
    // Tarefas semeados (seed do backend) - busca por linhas na tabela
    await expect(page.getByRole('row', { name: /Complete project proposal/i })).toBeVisible()
    await expect(page.getByRole('row', { name: /Review team performance/i })).toBeVisible()
    await expect(page.getByRole('row', { name: /Learn TypeScript/i })).toBeVisible()
    await expect(page.getByRole('row', { name: /Plan weekend trip/i })).toBeVisible()
    await expect(page.getByRole('row', { name: /Update resume/i })).toBeVisible()
  });

  test('cria tarefa e aparece na lista', async ({ page }) => {
    await page.goto('/tasks')
    await page.getByRole('button', { name: /Adicionar Tarefa/i }).click()
    await page.getByLabel('Título:').fill(taskTitle)  
    await page.getByLabel('Descrição:').fill(taskDescription)
    await page.getByLabel('Status:').selectOption(statusOptions[0]) // PENDING
    await page.getByLabel('Prioridade:').selectOption(priorityOptions[1]) // MEDIUM
    await page.getByLabel('Usuário:').selectOption({ label: userNamesFromSeed[0] }) // Usuário do seed
    await page.getByLabel('Categoria:').selectOption({ label: categoryNamesFromSeed[0] }) // Categoria do seed
    await page.getByRole('button', { name: /Criar/i }).click()
    
    // Aguarda recarga da lista e verifica se a tarefa foi criada com os valores corretos
    const taskRow = page.getByRole('row', { name: new RegExp(taskTitle) })
    await expect(taskRow).toBeVisible()
    
    // Verifica os campos individuais na linha da tarefa
    await expect(taskRow.getByRole('cell', { name: taskTitle })).toBeVisible()
    await expect(taskRow).toContainText(userNamesFromSeed[0]) // John Doe
    await expect(taskRow).toContainText(categoryNamesFromSeed[0]) // Work
    await expect(taskRow).toContainText('PENDING')
    await expect(taskRow).toContainText('MEDIUM')
  });

  test('edita tarefa e reflete na lista', async ({ page }) => {
    await page.goto('/tasks')
    // Encontra a tarefa criada anteriormente e clica em editar
    await page.getByRole('row', { name: new RegExp(taskTitle) })
      .getByRole('button', { name: /Editar/i })
      .click()

    // Modifica o título e descrição
    taskTitle = 'Tarefa editada.';
    taskDescription = 'Descrição editada.';

    await page.getByLabel('Título:').fill(taskTitle)
    await page.getByLabel('Descrição:').fill(taskDescription)
    await page.getByLabel('Status:').selectOption(statusOptions[1]) // IN_PROGRESS
    await page.getByLabel('Prioridade:').selectOption(priorityOptions[3]) // URGENT
    await page.getByLabel('Usuário:').selectOption({ label: userNamesFromSeed[1] }) // Jane Smith
    await page.getByLabel('Categoria:').selectOption({ label: categoryNamesFromSeed[2] }) // Study
    await page.getByRole('button', { name: /Atualizar/i }).click()

    // Aguarda recarga da lista e verifica se a tarefa editada está visível com os novos valores
    const taskRow = page.getByRole('row', { name: new RegExp(taskTitle) })
    await expect(taskRow).toBeVisible()
    
    // Verifica os campos individuais na linha da tarefa
    await expect(taskRow.getByRole('cell', { name: taskTitle })).toBeVisible()
    await expect(taskRow).toContainText(userNamesFromSeed[1]) // Jane Smith
    await expect(taskRow).toContainText(categoryNamesFromSeed[2]) // Study
    await expect(taskRow).toContainText('IN PROGRESS')
    await expect(taskRow).toContainText('URGENT')
  });

  test('deleta tarefa e desaparece da lista', async ({ page }) => {
    await page.goto('/tasks')
    
    // Configura o listener para aceitar o diálogo de confirmação
    page.once('dialog', (dialog) => {
      expect(dialog.message()).toContain('Tem certeza que deseja excluir esta tarefa?');
      expect(dialog.type()).toBe('confirm');
      dialog.accept();
    });
    
    // Encontra a tarefa editada anteriormente e clica em deletar
    await page.getByRole('row', { name: new RegExp(taskTitle) })
      .getByRole('button', { name: /Excluir/i })
      .click()
    
    // Aguarda recarga da lista
    await expect(page.getByText(taskTitle)).not.toBeVisible()
  });
});