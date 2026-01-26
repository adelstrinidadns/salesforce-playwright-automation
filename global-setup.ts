import * as fs from 'fs';
import * as path from 'path';

import { FullConfig, chromium } from '@playwright/test';

// Configuration constants
const AUTH_FILE = '.auth/user.json';
const SALESFORCE_LOGIN_URL = 'https://rri--fullsb.sandbox.my.salesforce.com/';
const LOGIN_TIMEOUT = 60000;
const VERIFICATION_TIMEOUT = 120000;

interface Cookie {
  expires?: number;
  [key: string]: any;
}

interface AuthData {
  cookies: Cookie[];
  origins?: any[];
}

/**
 * Validates if the stored authentication is still valid
 * Checks for file existence, proper format, and cookie expiration
 */
function isAuthValid(): boolean {
  if (!fs.existsSync(AUTH_FILE)) {
    console.log('⚠️  Auth file does not exist');
    return false;
  }

  try {
    const content = fs.readFileSync(AUTH_FILE, 'utf-8');

    if (!content || content.trim() === '' || content === '{}' || content === '[]') {
      console.log('⚠️  Auth file is empty');
      return false;
    }

    const authData: AuthData = JSON.parse(content);

    if (!authData.cookies || authData.cookies.length === 0) {
      console.log('⚠️  Auth file has no cookies');
      return false;
    }

    // Check if important authentication cookies are expired
    // Ignore short-lived tracking/analytics cookies that expire quickly
    const now = Date.now() / 1000; // Convert to seconds (Unix timestamp)
    const ONE_DAY = 86400;

    // Only check cookies that have long expiration (> 1 day from now)
    // These are the actual auth cookies, not tracking/session cookies
    const authCookies = authData.cookies.filter((cookie: Cookie) => {
      if (!cookie.expires || cookie.expires <= 0) return false;
      return cookie.expires > now + ONE_DAY;
    });

    if (authCookies.length === 0) {
      console.log('⚠️  No long-lived authentication cookies found');
      console.log('🔄 Authentication expired, will re-authenticate...');
      return false;
    }

    console.log(`✅ Valid authentication found (${authCookies.length} auth cookies valid)`);
    return true;
  } catch (error: any) {
    console.log('⚠️  Auth file is corrupted:', error?.message || 'Unknown error');
    return false;
  }
}

/**
 * Performs the Salesforce login process
 * Uses credentials from environment variables or defaults
 */
async function performLogin(page: any): Promise<void> {
  const username = process.env.SF_USERNAME || 'adelquis.trinidad@nortal.com.fullsb';
  const password = process.env.SF_PASSWORD || 'success404';
  const verificationCode = process.env.SF_VERIFICATION_CODE;

  await page.goto(SALESFORCE_LOGIN_URL, { timeout: LOGIN_TIMEOUT });

  console.log('📝 Filling login form...');
  await page.getByRole('textbox', { name: 'Username' }).fill(username);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Log In to Sandbox' }).click();

  // Handle verification code
  if (verificationCode) {
    console.log('🔐 Using verification code from environment variable...');
    await page.getByRole('textbox', { name: 'Verification Code' }).fill(verificationCode);
    await page.getByRole('button', { name: 'Verify' }).click();
  } else {
    console.log('⏸️  PLEASE ENTER VERIFICATION CODE IN BROWSER (you have 2 minutes)...');
    console.log('💡 Tip: Set SF_VERIFICATION_CODE environment variable to automate this step');
  }

  // Wait for successful authentication redirect
  await page.waitForURL(/lightning\/page\/home/, { timeout: VERIFICATION_TIMEOUT });
  console.log('✅ Login successful!');
}

/**
 * Global setup function that runs before all tests
 * Manages authentication state and performs login if needed
 */
async function globalSetup(_config: FullConfig): Promise<void> {
  // Ensure auth directory exists
  const authDir = path.dirname(AUTH_FILE);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // Skip authentication if already valid
  if (isAuthValid()) {
    return;
  }

  console.log('🔐 Authentication required. Starting login process...');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 500,
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await performLogin(page);

    // Save authentication state
    await context.storageState({ path: AUTH_FILE });

    const savedContent = fs.readFileSync(AUTH_FILE, 'utf-8');
    const savedData: AuthData = JSON.parse(savedContent);

    console.log(`✅ Authentication saved! (${savedData.cookies.length} cookies)`);
  } catch (error: any) {
    console.error('❌ Authentication failed:', error?.message || 'Unknown error');
    throw new Error('Authentication failed. Please try again.');
  } finally {
    await browser.close();
  }
}

export default globalSetup;