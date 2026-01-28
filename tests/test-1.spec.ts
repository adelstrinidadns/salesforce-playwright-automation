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
  // Helper to wait for page to be ready (spinner hidden)
  const waitForPageReady = async () => {
    await page.waitForLoadState('domcontentloaded');
    await page.locator('.slds-spinner').first().waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  };

  // Navigate to Salesforce home
  await page.goto('/lightning/page/home');
  await waitForPageReady();

  // Search for contact
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByPlaceholder('Search...').waitFor({ state: 'visible', timeout: 5000 });
  await page.getByPlaceholder('Search...').fill('timothy.hooker@tonyrobbins.com');
  await page.getByPlaceholder('Search...').press('Enter');

  // Select account from search results - wait for it to be visible first
  const accountLink = page.getByTitle('Testingus Cornelius Theodorus BTtest080420').nth(0);
  await accountLink.waitFor({ state: 'visible', timeout: 10000 });
  await accountLink.click();

  // Wait for navigation to complete
  await page.waitForURL(/lightning\/r\/Account/, { timeout: 10000 });
  await waitForPageReady();

  // Navigate to Event Credits
  await page.getByRole('link', { name: 'Show All (43)' }).click();
  // Wait for the Event Credits link to be visible after expanding the list
  await page.getByRole('link', { name: 'Event Credits (10+)' }).waitFor({ state: 'visible', timeout: 5000 });

  await page.getByRole('link', { name: 'Event Credits (10+)' }).click();
  await page.waitForURL(/lightning\/r\/Account/, { timeout: 5000 });
  await waitForPageReady();

  // Verify and open specific event credit
  const eventCreditLink = page.getByRole('link', { name: 'EC-04080643' });
  await expect(eventCreditLink).toBeVisible({ timeout: 10000 });
  await eventCreditLink.click();

  // Wait for event credit page to load
  await page.waitForURL(/lightning\/r\/Event_Credit__c/, { timeout: 10000 });
  await waitForPageReady();

  // Switch to Details tab
  await page.getByRole('tab', { name: 'Related' }).click();
  // Wait for tab content to load
  await page.locator('.slds-spinner').first().waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});

  await expect(page.getByRole('tab', { name: 'Details' })).toBeVisible({ timeout: 5000 });
  await page.getByRole('tab', { name: 'Details' }).click();
  // Wait for Details tab content to load
  await page.locator('.slds-spinner').first().waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});

  // Navigate to related opportunity
  const opportunityLink = page.getByRole('link', { name: 'Therealspork Evans - Business' });
  await opportunityLink.scrollIntoViewIfNeeded();
  await expect(opportunityLink).toBeVisible({ timeout: 5000 });
  await opportunityLink.click();

  // Wait for opportunity page to load
  await page.waitForURL(/lightning\/r\/Opportunity/, { timeout: 10000 });
  await waitForPageReady();

  // Navigate to Accounts and select another contact
  const accountsLink = page.getByRole('link', { name: 'Accounts' });
  await expect(accountsLink).toBeVisible({ timeout: 10000 });
  await accountsLink.click();

  const contactLink = page.getByRole('link', { name: 'Jessica Kitomary' });
  await contactLink.waitFor({ state: 'visible', timeout: 10000 });
  await contactLink.click();

  // Wait for contact page to load
  await page.waitForURL(/lightning\/r\/Account/, { timeout: 10000 });
  await waitForPageReady();

  // Verify Event Credits for second contact
  await page.getByRole('link', { name: 'Event Credits' }).click();
  // Wait for Event Credits section to load
  await page.locator('.slds-spinner').first().waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});

  const secondEventCreditLink = page.getByRole('link', { name: 'EC-04080643' });
  await expect(secondEventCreditLink).toBeVisible({ timeout: 10000 });
  await secondEventCreditLink.click();

  // Wait for event credit page to load
  await page.waitForURL(/lightning\/r\/Event_Credit__c/, { timeout: 10000 });
  await waitForPageReady();

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
  await waitForPageReady();

  // Navigate to Opportunities and verify specific opportunity
  await page.getByRole('link', { name: 'Opportunities' }).click();
  // Wait for Opportunities section to load
  await page.locator('.slds-spinner').first().waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});

  const finalOpportunityLink = page.getByRole('link', { name: /Samantha Grier - Customer/ });
  await finalOpportunityLink.waitFor({ state: 'visible', timeout: 15000 });
  await finalOpportunityLink.click();

  // Wait for opportunity page to load
  await page.waitForURL(/lightning\/r\/Opportunity/, { timeout: 10000 });
  await waitForPageReady();

  // Final verification of opportunity details with more specific selector
  await expect(
    page.locator('lightning-formatted-text').filter({ hasText: 'Samantha Grier - Customer' }).first()
  ).toBeVisible({ timeout: 10000 });
});

/**
 * Test case: Navigate through multiple Salesforce pages to load extensive content
 *
 * This test navigates through various Salesforce Lightning pages including:
 * - Home page
 * - Accounts list view
 * - Contacts list view
 * - Opportunities list view
 * - Leads list view
 * - Cases list view
 * - Reports
 * - Dashboards
 * - Campaigns
 * - Tasks
 * - Events
 * - Products
 *
 * The purpose is to stress test content loading across different object types.
 */
test('should navigate through multiple pages loading extensive content', async ({ page }) => {
  // Extend timeout for this test since it loads a lot of content
  test.setTimeout(300000); // 5 minutes

  // Helper function to wait for Salesforce page to be ready
  const waitForPageReady = async () => {
    await page.waitForLoadState('domcontentloaded');
    // Wait for Lightning spinner to disappear (indicates page is loading)
    await page.locator('.slds-spinner').first().waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  };

  // Helper function to wait for tab content to load
  const waitForTabContent = async () => {
    await page.locator('.slds-spinner').first().waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  };

  // 1. Start at Home page
  await page.goto('/lightning/page/home');
  await waitForPageReady();
  await expect(page.locator('.slds-page-header, .forceHighlightsPanel, [class*="home"]').first()).toBeVisible({ timeout: 15000 });

  // Interact with global search
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByPlaceholder('Search...').waitFor({ state: 'visible', timeout: 5000 });
  await page.getByPlaceholder('Search...').fill('test');
  await page.keyboard.press('Escape');

  // 2. Navigate to Accounts list view
  await page.goto('/lightning/o/Account/list');
  await waitForPageReady();
  await expect(page.getByRole('heading', { name: /Accounts/i }).first()).toBeVisible({ timeout: 15000 });

  // Try to click "View More" or "View All" if visible
  const viewMoreAccounts = page.getByRole('link', { name: /View More/i }).first();
  const viewAllAccounts = page.getByRole('link', { name: /View All/i }).first();
  if (await viewMoreAccounts.isVisible({ timeout: 2000 }).catch(() => false)) {
    await viewMoreAccounts.click();
    await waitForPageReady();
  } else if (await viewAllAccounts.isVisible({ timeout: 2000 }).catch(() => false)) {
    await viewAllAccounts.click();
    await waitForPageReady();
  }

  // Scroll down the list to load more content
  await page.mouse.wheel(0, 500);
  await page.mouse.wheel(0, 500);

  // Click on first record if available
  const firstAccountRecord = page.locator('a[data-refid="recordId"]').first();
  if (await firstAccountRecord.isVisible({ timeout: 3000 }).catch(() => false)) {
    await firstAccountRecord.click();
    await page.waitForURL(/lightning\/r\/Account/, { timeout: 15000 });
    await waitForPageReady();

    // Switch between tabs on the record
    const relatedTab = page.getByRole('tab', { name: 'Related' });
    if (await relatedTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await relatedTab.click();
      await waitForTabContent();
      await page.mouse.wheel(0, 300);
    }

    const detailsTab = page.getByRole('tab', { name: 'Details' });
    if (await detailsTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await detailsTab.click();
      await waitForTabContent();
      await page.mouse.wheel(0, 300);
    }
  }

  // 3. Navigate to Contacts list view
  await page.goto('/lightning/o/Contact/list');
  await waitForPageReady();
  await expect(page.getByRole('heading', { name: /Contacts/i }).first()).toBeVisible({ timeout: 15000 });

  // Try to click "View More" if needed
  const viewMoreContacts = page.getByRole('link', { name: /View More/i }).first();
  if (await viewMoreContacts.isVisible({ timeout: 2000 }).catch(() => false)) {
    await viewMoreContacts.click();
    await waitForPageReady();
  }

  // Scroll and interact
  await page.mouse.wheel(0, 500);

  // Click on first contact record
  const firstContactRecord = page.locator('a[data-refid="recordId"]').first();
  if (await firstContactRecord.isVisible({ timeout: 3000 }).catch(() => false)) {
    await firstContactRecord.click();
    await page.waitForURL(/lightning\/r\/Contact/, { timeout: 15000 });
    await waitForPageReady();

    // Toggle tabs
    const contactRelatedTab = page.getByRole('tab', { name: 'Related' });
    if (await contactRelatedTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await contactRelatedTab.click();
      await waitForTabContent();
    }
    const contactDetailsTab = page.getByRole('tab', { name: 'Details' });
    if (await contactDetailsTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await contactDetailsTab.click();
      await waitForTabContent();
    }
  }

  // 4. Navigate to Opportunities list view
  await page.goto('/lightning/o/Opportunity/list');
  await waitForPageReady();
  await expect(page.getByRole('heading', { name: /Opportunities/i }).first()).toBeVisible({ timeout: 15000 });

  // Try to click "View More" if needed
  const viewMoreOpps = page.getByRole('link', { name: /View More/i }).first();
  if (await viewMoreOpps.isVisible({ timeout: 2000 }).catch(() => false)) {
    await viewMoreOpps.click();
    await waitForPageReady();
  }

  // Scroll through opportunities
  await page.mouse.wheel(0, 500);
  await page.mouse.wheel(0, 500);

  // Click on first opportunity
  const firstOppRecord = page.locator('a[data-refid="recordId"]').first();
  if (await firstOppRecord.isVisible({ timeout: 3000 }).catch(() => false)) {
    await firstOppRecord.click();
    await page.waitForURL(/lightning\/r\/Opportunity/, { timeout: 15000 });
    await waitForPageReady();

    // Interact with opportunity tabs
    const oppRelatedTab = page.getByRole('tab', { name: 'Related' });
    if (await oppRelatedTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await oppRelatedTab.click();
      await waitForTabContent();
      await page.mouse.wheel(0, 400);
    }
  }

  // 5. Navigate to Leads list view
  await page.goto('/lightning/o/Lead/list');
  await waitForPageReady();
  await expect(page.getByRole('heading', { name: /Leads/i }).first()).toBeVisible({ timeout: 15000 });

  // Try to click "View More" if needed
  const viewMoreLeads = page.getByRole('link', { name: /View More/i }).first();
  if (await viewMoreLeads.isVisible({ timeout: 2000 }).catch(() => false)) {
    await viewMoreLeads.click();
    await waitForPageReady();
  }

  // Scroll through leads
  await page.mouse.wheel(0, 500);

  // 6. Navigate to Cases list view
  await page.goto('/lightning/o/Case/list');
  await waitForPageReady();
  await expect(page.getByRole('heading', { name: /Cases/i }).first()).toBeVisible({ timeout: 15000 });

  // Try to click "View More" if needed
  const viewMoreCases = page.getByRole('link', { name: /View More/i }).first();
  if (await viewMoreCases.isVisible({ timeout: 2000 }).catch(() => false)) {
    await viewMoreCases.click();
    await waitForPageReady();
  }

  // Scroll and click on a case if available
  await page.mouse.wheel(0, 300);

  const firstCaseRecord = page.locator('a[data-refid="recordId"]').first();
  if (await firstCaseRecord.isVisible({ timeout: 3000 }).catch(() => false)) {
    await firstCaseRecord.click();
    await page.waitForURL(/lightning\/r\/Case/, { timeout: 15000 });
    await waitForPageReady();

    // Scroll down the case details
    await page.mouse.wheel(0, 400);
  }

  // 7. Navigate to Campaigns list view
  await page.goto('/lightning/o/Campaign/list');
  await waitForPageReady();
  await expect(page.getByRole('heading', { name: /Campaigns/i }).first()).toBeVisible({ timeout: 15000 });

  // Try to click "View More" if needed
  const viewMoreCampaigns = page.getByRole('link', { name: /View More/i }).first();
  if (await viewMoreCampaigns.isVisible({ timeout: 2000 }).catch(() => false)) {
    await viewMoreCampaigns.click();
    await waitForPageReady();
  }

  // Scroll through campaigns
  await page.mouse.wheel(0, 500);

  // 8. Navigate to Reports
  await page.goto('/lightning/o/Report/home');
  await waitForPageReady();
  await expect(page.locator('[class*="report"], .slds-page-header').first()).toBeVisible({ timeout: 15000 });

  // Click on "View All Reports" button using title selector
  const viewAllReportsBtn = page.locator('[title="View All Reports"]').first();
  if (await viewAllReportsBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await viewAllReportsBtn.click();
    // Wait for report list to load
    await page.locator('a[href*="/lightning/r/Report/"]').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  }

  // Scroll to load more reports in the list
  await page.mouse.wheel(0, 400);

  // Try multiple selectors for report links
  const reportListLink = page.locator('a[href*="/lightning/r/Report/"]').first();
  const reportTableRow = page.locator('table tbody tr a').first();
  const reportNameLink = page.locator('[data-refid="recordId"]').first();

  let reportClicked = false;

  if (await reportListLink.isVisible({ timeout: 3000 }).catch(() => false)) {
    await reportListLink.click();
    reportClicked = true;
  } else if (await reportTableRow.isVisible({ timeout: 3000 }).catch(() => false)) {
    await reportTableRow.click();
    reportClicked = true;
  } else if (await reportNameLink.isVisible({ timeout: 3000 }).catch(() => false)) {
    await reportNameLink.click();
    reportClicked = true;
  }

  if (reportClicked) {
    // Wait for report to load
    await page.waitForURL(/lightning\/(r\/Report|o\/Report)/, { timeout: 15000 });
    await waitForPageReady();
    // Wait for report data table or chart to appear
    await page.locator('table, .reportChart, .slds-table, [class*="report"]').first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});

    // Scroll through the report results
    await page.mouse.wheel(0, 500);
    await page.mouse.wheel(0, 500);

    // Try to interact with report - click Run if available
    const runButton = page.getByRole('button', { name: /Run/i }).first();
    if (await runButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await runButton.click();
      // Wait for report to finish running
      await page.locator('.slds-spinner').first().waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
      await page.mouse.wheel(0, 500);
    }

    // Try to interact with report filters
    const filterButton = page.getByRole('button', { name: /Filters/i }).first();
    if (await filterButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await filterButton.click();
      await page.locator('[class*="filter"]').first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      await page.keyboard.press('Escape');
    }
  }

  // Go back to reports and open second report
  await page.goto('/lightning/o/Report/home');
  await waitForPageReady();

  // Click on "View All Reports" again to see the list
  const viewAllReportsBtn2 = page.locator('[title="View All Reports"]').first();
  if (await viewAllReportsBtn2.isVisible({ timeout: 3000 }).catch(() => false)) {
    await viewAllReportsBtn2.click();
    await page.locator('a[href*="/lightning/r/Report/"]').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  }

  // Scroll and try to click second report
  await page.mouse.wheel(0, 300);

  const secondReportLink = page.locator('a[href*="/lightning/r/Report/"]').nth(1);
  if (await secondReportLink.isVisible({ timeout: 3000 }).catch(() => false)) {
    await secondReportLink.click();
    await page.waitForURL(/lightning\/(r\/Report|o\/Report)/, { timeout: 15000 });
    await waitForPageReady();
    await page.locator('table, .reportChart, .slds-table, [class*="report"]').first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});

    // Scroll through this report
    await page.mouse.wheel(0, 600);
    await page.mouse.wheel(0, 600);
  }

  // Try a third report
  await page.goto('/lightning/o/Report/home');
  await waitForPageReady();

  const viewAllReportsBtn3 = page.locator('[title="View All Reports"]').first();
  if (await viewAllReportsBtn3.isVisible({ timeout: 3000 }).catch(() => false)) {
    await viewAllReportsBtn3.click();
    await page.locator('a[href*="/lightning/r/Report/"]').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});

    // Click on third report if available
    const thirdReportLink = page.locator('a[href*="/lightning/r/Report/"]').nth(2);
    if (await thirdReportLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await thirdReportLink.click();
      await page.waitForURL(/lightning\/(r\/Report|o\/Report)/, { timeout: 15000 });
      await waitForPageReady();
      await page.locator('table, .reportChart, .slds-table, [class*="report"]').first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});

      // Scroll through this report
      await page.mouse.wheel(0, 600);
    }
  }

  // 9. Navigate to Dashboards
  await page.goto('/lightning/o/Dashboard/home');
  await waitForPageReady();
  await expect(page.locator('[class*="dashboard"], .slds-page-header').first()).toBeVisible({ timeout: 15000 });

  // Click on "All Dashboards" in sidebar to see full list
  const allDashboardsLink = page.getByRole('link', { name: /All Dashboards/i }).first();
  if (await allDashboardsLink.isVisible({ timeout: 3000 }).catch(() => false)) {
    await allDashboardsLink.click();
    await page.locator('a[href*="/lightning/r/Dashboard/"]').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  }

  // Scroll to load more dashboards
  await page.mouse.wheel(0, 400);

  // Try multiple selectors for dashboard links
  const dashboardListLink = page.locator('a[href*="/lightning/r/Dashboard/"]').first();
  const dashboardTableRow = page.locator('table tbody tr a').first();
  const dashboardNameLink = page.locator('lst-formatted-text a, lightning-formatted-url a, [data-refid="recordId"]').first();

  let dashboardClicked = false;

  if (await dashboardListLink.isVisible({ timeout: 3000 }).catch(() => false)) {
    await dashboardListLink.click();
    dashboardClicked = true;
  } else if (await dashboardTableRow.isVisible({ timeout: 3000 }).catch(() => false)) {
    await dashboardTableRow.click();
    dashboardClicked = true;
  } else if (await dashboardNameLink.isVisible({ timeout: 3000 }).catch(() => false)) {
    await dashboardNameLink.click();
    dashboardClicked = true;
  }

  if (dashboardClicked) {
    // Wait for dashboard to load
    await page.waitForURL(/lightning\/(r\/Dashboard|o\/Dashboard)/, { timeout: 15000 });
    await waitForPageReady();
    // Wait for dashboard components to load (charts, tables, etc.)
    await page.locator('.dashboard-component, .dashboardComponent, [class*="chart"], [class*="metric"]').first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});

    // Scroll through the dashboard to load all components
    await page.mouse.wheel(0, 500);
    await waitForTabContent();
    await page.mouse.wheel(0, 500);
    await waitForTabContent();
    await page.mouse.wheel(0, 500);
    await waitForTabContent();

    // Try to refresh the dashboard if button is available
    const refreshButton = page.getByRole('button', { name: /Refresh/i }).first();
    if (await refreshButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await refreshButton.click();
      // Wait for refresh spinner to disappear
      await page.locator('.slds-spinner').first().waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
      await page.mouse.wheel(0, 500);
    }
  }

  // Go back and try Recent dashboards
  await page.goto('/lightning/o/Dashboard/home');
  await waitForPageReady();

  // Click on "Recent" in sidebar
  const recentDashboardsLink = page.getByRole('link', { name: /Recent/i }).first();
  if (await recentDashboardsLink.isVisible({ timeout: 3000 }).catch(() => false)) {
    await recentDashboardsLink.click();
    await page.locator('a[href*="/lightning/r/Dashboard/"]').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});

    // Scroll and click second dashboard
    await page.mouse.wheel(0, 300);

    const secondDashboardLink = page.locator('a[href*="/lightning/r/Dashboard/"]').nth(1);
    if (await secondDashboardLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await secondDashboardLink.click();
      await page.waitForURL(/lightning\/(r\/Dashboard|o\/Dashboard)/, { timeout: 15000 });
      await waitForPageReady();
      // Wait for dashboard components to load
      await page.locator('.dashboard-component, .dashboardComponent, [class*="chart"], [class*="metric"]').first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});

      // Scroll through this dashboard
      await page.mouse.wheel(0, 600);
      await waitForTabContent();
      await page.mouse.wheel(0, 600);
    }
  }

  // Try Private Dashboards
  await page.goto('/lightning/o/Dashboard/home');
  await waitForPageReady();

  const privateDashboardsLink = page.getByRole('link', { name: /Private Dashboards/i }).first();
  const createdByMeDashLink = page.getByRole('link', { name: /Created by Me/i }).first();

  if (await privateDashboardsLink.isVisible({ timeout: 2000 }).catch(() => false)) {
    await privateDashboardsLink.click();
    await waitForPageReady();
    await page.mouse.wheel(0, 400);
  } else if (await createdByMeDashLink.isVisible({ timeout: 2000 }).catch(() => false)) {
    await createdByMeDashLink.click();
    await waitForPageReady();
    await page.mouse.wheel(0, 400);
  }

  // 10. Navigate to Tasks list view
  await page.goto('/lightning/o/Task/list');
  await waitForPageReady();
  await expect(page.getByRole('heading', { name: /Tasks/i }).first()).toBeVisible({ timeout: 15000 });

  // Try to click "View More" if needed
  const viewMoreTasks = page.getByRole('link', { name: /View More/i }).first();
  if (await viewMoreTasks.isVisible({ timeout: 2000 }).catch(() => false)) {
    await viewMoreTasks.click();
    await waitForPageReady();
  }

  // Scroll through tasks
  await page.mouse.wheel(0, 500);

  // 11. Navigate to Events list view
  await page.goto('/lightning/o/Event/list');
  await waitForPageReady();
  await expect(page.getByRole('heading', { name: /Events/i }).first()).toBeVisible({ timeout: 15000 });

  // Try to click "View More" if needed
  const viewMoreEvents = page.getByRole('link', { name: /View More/i }).first();
  if (await viewMoreEvents.isVisible({ timeout: 2000 }).catch(() => false)) {
    await viewMoreEvents.click();
    await waitForPageReady();
  }

  // Scroll through events
  await page.mouse.wheel(0, 500);

  // 12. Navigate to Products list view
  await page.goto('/lightning/o/Product2/list');
  await waitForPageReady();
  await expect(page.getByRole('heading', { name: /Products/i }).first()).toBeVisible({ timeout: 15000 });

  // Try to click "View More" if needed
  const viewMoreProducts = page.getByRole('link', { name: /View More/i }).first();
  if (await viewMoreProducts.isVisible({ timeout: 2000 }).catch(() => false)) {
    await viewMoreProducts.click();
    await waitForPageReady();
  }

  // Scroll through products
  await page.mouse.wheel(0, 500);

  // 13. Use global search to find something specific
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByPlaceholder('Search...').waitFor({ state: 'visible', timeout: 5000 });
  await page.getByPlaceholder('Search...').fill('Account');
  // Wait for search results dropdown to appear
  await page.locator('[class*="search"], [class*="lookup"], [class*="results"]').first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  await page.keyboard.press('Escape');

  // 14. Return to Home and verify
  await page.goto('/lightning/page/home');
  await waitForPageReady();
  await expect(page.locator('.slds-page-header, .forceHighlightsPanel, [class*="home"]').first()).toBeVisible({ timeout: 15000 });
});
