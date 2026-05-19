import { test, expect } from '@playwright/test';

test.describe('Unit-like tests (convertidos de Vitest)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('formats date correctly', async ({ page }) => {
    const formatted = await page.evaluate(() => window.patientManager.formatDate('2026-05-15'));
    expect(formatted).toBe('15/05/2026');
  });

  test('validates CPF format correctly', async ({ page }) => {
    const valid = await page.evaluate(() => window.modalManager.validateCPF('123.456.789-00'));
    const invalid = await page.evaluate(() => window.modalManager.validateCPF('123.456.789'));
    expect(valid).toBe(true);
    expect(invalid).toBe(false);
  });

  test('searches patients and updates table rows', async ({ page }) => {
    await page.fill('#patientSearch', 'João');
    // esperar debounce do search
    await page.waitForTimeout(400);
    const rows = await page.$$eval('#patientsTableBody tr', els => els.map(r => r.textContent));
    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0]).toContain('João Silva Santos');
  });

  test('approves and rejects referrals', async ({ page }) => {
    // Aprovar
    await page.evaluate(() => referralManager.approveReferral(5001));
    const status1 = await page.evaluate(() => referralManager.referrals.find(r => r.id === 5001).status);
    expect(status1).toBe('autorizado');

    // Verifica toast de sucesso
    const toastText = await page.$eval('.toast .toast-message', el => el.textContent);
    expect(toastText).toContain('aprovado');

    // Rejeitar
    await page.evaluate(() => referralManager.rejectReferral(5002));
    const status2 = await page.evaluate(() => referralManager.referrals.find(r => r.id === 5002).status);
    expect(status2).toBe('rejeitado');
  });

  test('creates toast notifications in the DOM', async ({ page }) => {
    await page.evaluate(() => notificationManager.success('Teste de sucesso', 0));
    const toast = await page.$('.toast');
    expect(toast).not.toBeNull();
    const msg = await page.$eval('.toast .toast-message', el => el.textContent.trim());
    expect(msg).toBe('Teste de sucesso');
  });
});
