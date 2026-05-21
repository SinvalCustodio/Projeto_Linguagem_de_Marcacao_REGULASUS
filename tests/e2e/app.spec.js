import { test, expect } from '@playwright/test';

test.describe('REGULASUS E2E', () => {
  test('homepage loads and default pages render', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/REGULASUS/);
    await expect(page.locator('text=REGULASUS')).toBeVisible();
    await expect(page.locator('#dashboardPage')).toBeVisible();
  });

  test('navigate to patients page and search patient', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-page="patients"]');
    await expect(page.locator('#patientsPage')).toBeVisible();
    await expect(page.locator('#patientsTableBody')).toBeVisible();

    await page.fill('#patientSearch', 'Maria');
    await page.waitForTimeout(400);
    await expect(page.locator('#patientsTableBody tr')).toHaveCount(1);
    await expect(page.locator('#patientsTableBody')).toContainText('Maria Oliveira Costa');
  });

  test('open patient modal and submit new patient form', async ({ page }) => {
    await page.goto('/');
    await page.click('#newPatientBtn');
    await expect(page.locator('#patientModal')).toBeVisible();

    await page.fill('#firstName', 'Ana Silva');
    await page.fill('#cpf', '111.222.333-44');
    await page.fill('#birthDate', '1990-01-01');
    await page.selectOption('#gender', 'F');
    await page.fill('#email', 'ana.silva@test.com');
    await page.fill('#phone', '(81) 91234-5678');
    await page.fill('#address', 'Rua Teste, 123');
    await page.fill('#neighborhood', 'Boa Vista');
    await page.fill('#city', 'Recife');

    await page.click('#patientModal button[type="submit"]');
    await expect(page.locator('#patientModal')).toBeHidden();
    await expect(page.locator('.toast-message')).toContainText('Paciente Ana Silva cadastrado com sucesso!');
  });

  test('patient form requires mandatory fields', async ({ page }) => {
    await page.goto('/');
    await page.click('#newPatientBtn');
    await expect(page.locator('#patientModal')).toBeVisible();

    await page.click('#patientModal button[type="submit"]');
    await expect(page.locator('#patientModal')).toBeVisible();

    const invalidCount = await page.locator('#patientForm input:invalid, #patientForm select:invalid').count();
    expect(invalidCount).toBeGreaterThan(0);
  });

  test('logout via user menu shows warning toast', async ({ page }) => {
    await page.goto('/');
    await page.click('#userMenuBtn');
    await page.click('#logoutBtn');
    await expect(page.locator('.toast-message')).toContainText('Você foi desconectado');
  });

  test('filter referrals by status and priority', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-page="referrals"]');
    await expect(page.locator('#referralsPage')).toBeVisible();

    await page.selectOption('#filterStatus', 'autorizado');
    await expect(page.locator('.referral-card')).toHaveCount(1);
    await expect(page.locator('.referral-card')).toContainText('Encaminhamento #5002');

    await page.selectOption('#filterStatus', '');
    await page.selectOption('#filterPriority', 'urgencia');
    await expect(page.locator('.referral-card')).toHaveCount(2);
  });

  test('schedule a consultation from scheduling page', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-page="scheduling"]');
    await expect(page.locator('#schedulingPage')).toBeVisible();

    await page.fill('#schedulePatient', 'João Silva Santos');
    await page.selectOption('#scheduleSpecialty', 'cardiologia');
    await page.fill('#scheduleDate', '2026-06-01');
    await page.selectOption('#scheduleTime', '09:00');
    await page.selectOption('#scheduleLocation', 'hospital-central');
    await page.fill('#scheduleObservations', 'Consulta de rotina');

    await page.click('#schedulingForm button[type="submit"]');
    await expect(page.locator('.toast-message')).toContainText('Consulta agendada com sucesso!');
  });

  test('approve first referral and verify status change', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-page="referrals"]');
    await expect(page.locator('#referralsPage')).toBeVisible();

    const firstCard = page.locator('.referral-card').first();
    await firstCard.locator('button:has-text("Aprovar")').click();
    await expect(page.locator('.toast-message')).toContainText('Encaminhamento #5001 aprovado');
    await expect(firstCard.locator('.card-header .badge')).toContainText('Autorizado');
  });

  test('request more information for a referral', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-page="referrals"]');
    await expect(page.locator('#referralsPage')).toBeVisible();

    const secondCard = page.locator('.referral-card').nth(1);
    await secondCard.locator('button:has-text("Solicitar Info")').click();
    await expect(page.locator('.toast-message')).toContainText('Solicitação de informações enviada para #5002');
  });

  test('reject a referral and verify rejection toast', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-page="referrals"]');
    await expect(page.locator('#referralsPage')).toBeVisible();

    const thirdCard = page.locator('.referral-card').nth(2);
    await thirdCard.locator('button:has-text("Rejeitar")').click();
    await expect(page.locator('.toast-message')).toContainText('Encaminhamento #5003 rejeitado');
  });
});

