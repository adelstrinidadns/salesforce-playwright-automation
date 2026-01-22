import { expect, test } from '@playwright/test';

const authFile = '.auth/user.json';

test('authenticate', async ({ page }) => {
  // Login en Salesforce
  await page.goto('https://rri--fullsb.sandbox.my.salesforce.com/');
  await page.getByRole('textbox', { name: 'Username' }).click();
  
  await page.getByRole('textbox', { name: 'Username' }).fill('adelquis.trinidad@nortal.com.fullsb');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('success404');
  // await page.locator('#main').click();
  await page.getByRole('button', { name: 'Log In to Sandbox' }).click();

  await page.getByRole('textbox', { name: 'Verification Code' }).fill('IHE0TAZ4XP');
  await page.getByRole('button', { name: 'Verify' }).click();
  await expect(page).toHaveURL('https://rri--fullsb.sandbox.lightning.force.com/lightning/page/home', { timeout: 15000 });
  
  // Esperar que cargue completamente
  await page.waitForURL(/lightning\/page\/home/, { timeout: 45000 });
//   await page.waitForLoadState('networkidle');
  
  // Guardar el estado de autenticación (cookies, localStorage, sessionStorage)
  await page.context().storageState({ path: authFile });
});