import { expect, test } from '@playwright/test';

/**
 * Test case: Navigate through Salesforce records and verify event credit associations
 *
 * This test demonstrates:
 * - Searching for contacts in Salesforce
 * - Navigating through related records (Accounts, Event Credits, Opportunities)
 * - Verifying data consistency across related objects
 */
test('should verify event credit associations across multiple accounts', async ({ page }) => {
  // Navigate to Salesforce home
  await page.goto('/lightning/page/home');
  await page.waitForLoadState('domcontentloaded');

  // Search for contact
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByPlaceholder('Search...').fill('timothy.hooker@tonyrobbins.com');
  await page.getByPlaceholder('Search...').press('Enter');

  // Select account from search results - wait for it to be visible first
  const accountLink = page.getByTitle('Testingus Cornelius Theodorus BTtest080420').nth(0);
  await accountLink.waitFor({ state: 'visible', timeout: 10000 });
  await accountLink.click();

  // Wait for navigation to complete
  await page.waitForURL(/lightning\/r\/Account/, { timeout: 10000 });

  // Navigate to Event Credits
  await page.getByRole('link', { name: 'Show All (43)' }).click();
  await page.waitForTimeout(500); // Wait for list to expand

  await page.getByRole('link', { name: 'Event Credits (10+)' }).click();
  await page.waitForURL(/lightning\/r\/Account/, { timeout: 5000 });

  // Verify and open specific event credit
  const eventCreditLink = page.getByRole('link', { name: 'EC-04080643' });
  await expect(eventCreditLink).toBeVisible({ timeout: 10000 });
  await eventCreditLink.click();

  // Wait for event credit page to load
  await page.waitForURL(/lightning\/r\/Event_Credit__c/, { timeout: 10000 });

  // Switch to Details tab
  await page.getByRole('tab', { name: 'Related' }).click();
  await page.waitForTimeout(500); // Wait for tab transition

  await expect(page.getByRole('tab', { name: 'Details' })).toBeVisible({ timeout: 5000 });
  await page.getByRole('tab', { name: 'Details' }).click();
  await page.waitForTimeout(500); // Wait for tab transition

  // Navigate to related opportunity
  const opportunityLink = page.getByRole('link', { name: 'Therealspork Evans - Business' });
  await opportunityLink.scrollIntoViewIfNeeded();
  await expect(opportunityLink).toBeVisible({ timeout: 5000 });
  await opportunityLink.click();

  // Wait for opportunity page to load
  await page.waitForURL(/lightning\/r\/Opportunity/, { timeout: 10000 });

  // Navigate to Accounts and select another contact
  const accountsLink = page.getByRole('link', { name: 'Accounts' });
  await expect(accountsLink).toBeVisible({ timeout: 10000 });
  await accountsLink.click();

  const contactLink = page.getByRole('link', { name: 'Jessica Kitomary' });
  await contactLink.waitFor({ state: 'visible', timeout: 10000 });
  await contactLink.click();

  // Wait for contact page to load
  await page.waitForURL(/lightning\/r\/Account/, { timeout: 10000 });

  // Verify Event Credits for second contact
  await page.getByRole('link', { name: 'Event Credits' }).click();
  await page.waitForTimeout(500);

  const secondEventCreditLink = page.getByRole('link', { name: 'EC-04080643' });
  await expect(secondEventCreditLink).toBeVisible({ timeout: 10000 });
  await secondEventCreditLink.click();

  // Wait for event credit page to load
  await page.waitForURL(/lightning\/r\/Event_Credit__c/, { timeout: 10000 });

  // Verify Details tab and navigate back to original account
  await expect(page.getByRole('tab', { name: 'Details' })).toBeVisible({ timeout: 5000 });

  const businessLink = page.getByRole('link', { name: 'Therealspork Evans - Business' });
  await businessLink.scrollIntoViewIfNeeded();
  await expect(businessLink).toBeVisible({ timeout: 5000 });

  const accountReturnLink = page.getByRole('link', { name: /Testingus Cornelius Theodorus BTtest080420/ }).first();
  await accountReturnLink.waitFor({ state: 'visible', timeout: 10000 });
  await accountReturnLink.click();

  // Wait for account page to load
  await page.waitForURL(/lightning\/r\/Account/, { timeout: 10000 });

  // Navigate to Opportunities and verify specific opportunity
  await page.getByRole('link', { name: 'Opportunities' }).click();
  await page.waitForTimeout(500);

  const finalOpportunityLink = page.getByRole('link', { name: /Samantha Grier - Customer/ });
  await finalOpportunityLink.waitFor({ state: 'visible', timeout: 15000 });
  await finalOpportunityLink.click();

  // Wait for opportunity page to load
  await page.waitForURL(/lightning\/r\/Opportunity/, { timeout: 10000 });

  // Final verification of opportunity details with more specific selector
  await expect(
    page.locator('lightning-formatted-text').filter({ hasText: 'Samantha Grier - Customer' }).first()
  ).toBeVisible({ timeout: 10000 });
});
