# Salesforce Playwright Automation

Automated testing framework for Salesforce using Playwright and TypeScript for stress testing and functional validation.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Access to Salesforce sandbox environment

## Installation

1. Clone the repository:
```bash
git clone https://github.com/adelstrinidadns/salesforce-playwright-automation.git
cd salesforce-playwright-automation
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## Setup Authentication

Before running tests, you need to authenticate and save your session cookies.

### Step 1: Update credentials in `auth.setup.ts`

Open `auth.setup.ts` and update with your Salesforce credentials:
```typescript
await page.getByRole('textbox', { name: 'Username' }).fill('YOUR_USERNAME@salesforce.com');
await page.getByRole('textbox', { name: 'Password' }).fill('YOUR_PASSWORD');
```

**Important**: The verification code line is hardcoded. You have two options:

**Option A: Manual verification (Recommended)**
Comment out or remove the verification code line and enter it manually:
```typescript
// await page.getByRole('textbox', { name: 'Verification Code' }).fill('CODE');
```

Then run with headed mode:
```bash
npx playwright test auth.setup.ts --headed
```
Enter the verification code manually when prompted (you have 2 minutes).

**Option B: Use current verification code**
Get the code from your email/authenticator and update it before running.

### Step 2: Run authentication setup
```bash
# Run setup in headed mode (recommended for first time)
npx playwright test auth.setup.ts --headed

# Or in headless mode if verification code is already in the file
npx playwright test auth.setup.ts
```

This will save your authentication state in `.auth/user.json` (gitignored).

### Step 3: Verify authentication was saved
```bash
ls -la .auth/user.json
```

You should see the file created.

## Running Tests

Once authentication is set up, you can run the tests:

### Run all tests
```bash
npx playwright test
```

### Run specific test file
```bash
npx playwright test tests/test-1.spec.ts
```

### Run with custom workers and repetitions (stress testing)
```bash
# 5 parallel workers, repeat each test 10 times = 50 total executions
npx playwright test --workers=5 --repeat-each=10
```

### Run in headed mode (see browser)
```bash
npx playwright test --headed
```

### Run in UI mode (interactive)
```bash
npx playwright test --ui
```

### Run in debug mode
```bash
npx playwright test --debug
```

## View Test Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```

## Project Structure
```
salesforce-playwright-automation/
├── .auth/                  # Authentication state (gitignored)
│   └── user.json          # Saved session cookies
├── tests/                  # Test files
│   └── test-1.spec.ts     # Main test suite
├── auth.setup.ts          # Authentication setup script
├── playwright.config.ts   # Playwright configuration
├── package.json
└── README.md
```

## Configuration

The project is configured in `playwright.config.ts` with the following settings:

- **Workers**: 5 parallel workers (configurable)
- **Repeat**: Each test runs 10 times (configurable)
- **Timeout**: 5 minutes per test (Salesforce can be slow)
- **SlowMo**: 2 second delay between actions
- **Retries**: 1 retry on failure
- **Base URL**: `https://rri--fullsb.sandbox.lightning.force.com`

### Customizing Configuration

Edit `playwright.config.ts` to adjust:
- Number of workers: `workers: 10`
- Test repetitions: `repeatEach: 20`
- Timeouts: `timeout: 600000` (10 minutes)
- SlowMo delay: `slowMo: 3000` (3 seconds)

## Environment Variables (Optional)

You can create a `.env` file for sensitive data:
```bash
SF_USERNAME=your_username@salesforce.com
SF_PASSWORD=your_password
SF_SECURITY_TOKEN=your_token
BASE_URL=https://your-sandbox.salesforce.com
```

## Troubleshooting

### Authentication expired
If tests fail with login errors, re-run the authentication setup:
```bash
npx playwright test auth.setup.ts --headed
```

### Tests timeout
Increase timeouts in `playwright.config.ts`:
```typescript
timeout: 600000, // 10 minutes
use: {
  actionTimeout: 120000, // 2 minutes
  navigationTimeout: 180000, // 3 minutes
}
```

### Too many parallel executions causing failures
Reduce workers:
```bash
npx playwright test --workers=3 --repeat-each=5
```

### Verification code issues
Run setup in headed mode and enter code manually:
```bash
npx playwright test auth.setup.ts --headed
```

## Security Notes

- **Never commit** `.auth/user.json` (already in .gitignore)
- **Never commit** `.env` files with credentials
- **Never hardcode** passwords in test files
- Use environment variables or secure vaults for CI/CD

## CI/CD Integration

For automated testing in CI/CD pipelines, you'll need to:
1. Store credentials securely (GitHub Secrets, etc.)
2. Handle 2FA differently (use API tokens or disable for test accounts)
3. Adjust configuration for CI environment

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests to ensure they pass
4. Submit a pull request

## License

ISC

## Support

For issues or questions, please open an issue in the GitHub repository.