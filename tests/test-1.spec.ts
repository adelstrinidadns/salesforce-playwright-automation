import { expect, test } from '@playwright/test';

test('test', async ({ page }) => {
  // await page.goto('https://rri--fullsb.sandbox.my.salesforce.com/');
  // await page.getByRole('textbox', { name: 'Username' }).click();
  
  // await page.getByRole('textbox', { name: 'Username' }).fill('adelquis.trinidad@nortal.com.fullsb');
  // await page.getByRole('textbox', { name: 'Password' }).click();
  // await page.getByRole('textbox', { name: 'Password' }).fill('success404');
  // // await page.locator('#main').click();
  // await page.getByRole('button', { name: 'Log In to Sandbox' }).click();

  // await page.getByRole('textbox', { name: 'Verification Code' }).fill('IHE0TAZ4XP');
  // await page.getByRole('button', { name: 'Verify' }).click();
await page.goto('https://rri--fullsb.sandbox.lightning.force.com/lightning/page/home');
await expect(page).toHaveURL('https://rri--fullsb.sandbox.lightning.force.com/lightning/page/home', { timeout: 15000 });
await page.getByRole('button', { name: 'Search' }).click();
await page.getByPlaceholder('Search...').fill('timothy.hooker@tonyrobbins.com');
await page.getByPlaceholder('Search...').press('Enter');
// await page.getByRole('heading', { name: 'Contacts' }).click();
await page.getByTitle(`Testingus Cornelius Theodorus BTtest080420`).nth(0).click();
// await page.goto('https://rri--fullsb.sandbox.lightning.force.com/lightning/r/Account/0012H00001b10yuQAA/view');
await page.getByRole('link', { name: 'Show All (43)' }).click();
await page.getByRole('link', { name: 'Event Credits (10+)' }).click();
await expect(page.getByRole('link', { name: 'EC-04080643' })).toBeVisible();
await page.getByRole('link', { name: 'EC-04080643' }).click();
await page.getByRole('tab', { name: 'Related' }).click();
await expect(page.getByRole('tab', { name: 'Details' })).toBeVisible();
await page.getByRole('tab', { name: 'Details' }).click();
await page.getByRole('link', { name: 'Therealspork Evans - Business' }).scrollIntoViewIfNeeded();
await page.getByRole('link', { name: 'Therealspork Evans - Business' }).click();
await expect(page.getByRole('link', { name: 'Accounts' })).toBeVisible();
await page.getByRole('link', { name: 'Accounts' }).click();
await page.getByRole('link', { name: 'Jessica Kitomary' }).click();
await page.getByRole('link', { name: 'Event Credits' }).click();
await expect(page.getByRole('link', { name: 'EC-04080643' })).toBeVisible();
// await page.getByText('Jessica Kitomary').first().click();
await page.getByRole('link', { name: 'EC-04080643' }).click();
await expect(page.getByRole('tab', { name: 'Details' })).toBeVisible();
await page.getByRole('link', { name: 'Therealspork Evans - Business' }).scrollIntoViewIfNeeded();
await page.getByRole('link', { name: /Testingus Cornelius Theodorus BTtest080420/ }).first().click();
// await page.getByRole('link', { name: 'Show All (25)' }).click();
// await page.locator('#tab-25 #window').click();
await page.getByRole('link', { name: 'Opportunities' }).click();
await page.getByRole('link', { name: /Samantha Grier - Customer/ }).click({ timeout: 10000 });

await expect(page.locator('forcegenerated-highlightspanel_opportunity___012800000007axpaay___compact___view___recordlayout2 lightning-formatted-text').filter({ hasText: 'Samantha Grier - Customer' })).toBeVisible();


});

// test('test 2', async ({ page }) => {
//   await page.goto('https://rri--fullsb.sandbox.my.salesforce.com/');
//   await page.getByRole('textbox', { name: 'Username' }).click();
  
//   await page.getByRole('textbox', { name: 'Username' }).fill('adelquis.trinidad@gmail.com.sb');
//   await page.getByRole('textbox', { name: 'Password' }).click();
//   await page.getByRole('textbox', { name: 'Password' }).fill('success404');
//   // await page.locator('#main').click();
//   await page.getByRole('button', { name: 'Log In to Sandbox' }).click();

//   await page.getByRole('textbox', { name: 'Verification Code' }).fill('RGOTCLIJ6W');
//   await page.getByRole('button', { name: 'Verify' }).click();
//   await expect(page).toHaveURL('https://rri--fullsb.sandbox.lightning.force.com/lightning/page/home', { timeout: 15000 });
// await page.getByRole('button', { name: 'Search' }).click();
// await page.getByPlaceholder('Search...').fill('timothy.hooker@tonyrobbins.com');
// await page.getByPlaceholder('Search...').press('Enter');
// // await page.getByRole('heading', { name: 'Contacts' }).click();
// await page.getByTitle(`Testingus Cornelius Theodorus BTtest080420`).nth(0).click();
// // await page.goto('https://rri--fullsb.sandbox.lightning.force.com/lightning/r/Account/0012H00001b10yuQAA/view');
// await page.getByRole('link', { name: 'Show All (43)' }).click();
// await page.getByRole('link', { name: 'Event Credits (10+)' }).click();
// await expect(page.getByRole('link', { name: 'EC-04080643' })).toBeVisible();
// await page.getByRole('link', { name: 'EC-04080643' }).click();
// await page.getByRole('tab', { name: 'Related' }).click();
// await expect(page.getByRole('tab', { name: 'Details' })).toBeVisible();
// await page.getByRole('tab', { name: 'Details' }).click();
// await page.getByRole('link', { name: 'Therealspork Evans - Business' }).scrollIntoViewIfNeeded();
// await page.getByRole('link', { name: 'Therealspork Evans - Business' }).click();
// await expect(page.getByRole('link', { name: 'Accounts' })).toBeVisible();
// await page.getByRole('link', { name: 'Accounts' }).click();
// await page.getByRole('link', { name: 'Testingus Cornelius Theodorus' }).click();
// // await page.getByRole('link', { name: 'Jessica Kitomary' }).click();
// await page.getByRole('link', { name: 'Event Credits' }).click();
// await expect(page.getByRole('link', { name: 'EC-04080643' })).toBeVisible();
// // await page.getByText('Jessica Kitomary').first().click();
// await page.getByRole('link', { name: 'EC-04080643' }).click();
// await expect(page.getByRole('tab', { name: 'Details' })).toBeVisible();
// await page.getByRole('link', { name: 'Therealspork Evans - Business' }).scrollIntoViewIfNeeded();
// await page.getByRole('link', { name: /Testingus Cornelius Theodorus BTtest080420/ }).first().click();
// // await page.getByRole('link', { name: 'Show All (25)' }).click();
// // await page.locator('#tab-25 #window').click();
// await page.getByRole('link', { name: 'Opportunities' }).click();
// await page.getByRole('link', { name: /Therealspork Evans -/ }).click({ timeout: 10000 });
// await expect(page.locator('forcegenerated-highlightspanel_opportunity___012800000007ar0aaa___compact___view___recordlayout2 lightning-formatted-text').filter({ hasText: 'Therealspork Evans - Business' })).toBeVisible();
// // await page.locator('forcegenerated-highlightspanel_opportunity___012800000007ar0aaa___compact___view___recordlayout2 lightning-formatted-text').filter({ hasText: 'Therealspork Evans - Business' }).click();

// // await expect(page.locator('forcegenerated-highlightspanel_opportunity___012800000007axpaay___compact___view___recordlayout2 lightning-formatted-text').filter({ hasText: 'Therealspork Evans - Business Mastery' })).toBeVisible();


// });