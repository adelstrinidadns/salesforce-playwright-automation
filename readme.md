# Salesforce Playwright Automation

Automated testing framework for Salesforce using Playwright with persistent authentication and stress testing capabilities.

## Features

- 🔐 **Automatic Authentication**: Logs into Salesforce once and reuses cookies across test runs
- 🔄 **Smart Cookie Management**: Automatically detects expired cookies and re-authenticates
- ⚡ **Fast Test Execution**: Skips login for subsequent test runs
- 🛡️ **Environment Variables**: Secure credential management via `.env` file
- 📝 **Type-Safe**: Written in TypeScript with proper type definitions
- 🚀 **Stress Testing Ready**: Configurable parallel workers and test repetitions

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Salesforce Sandbox account with valid credentials

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

## Configuration

### 1. Set up environment variables

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` with your Salesforce credentials:
```env
SF_USERNAME=your.username@example.com.fullsb
SF_PASSWORD=your_password
SF_VERIFICATION_CODE=XXXXXXXX  # Update daily
```

**Important**:
- The verification code changes daily. Update `SF_VERIFICATION_CODE` each day before running tests.
- If you leave `SF_VERIFICATION_CODE` empty, the browser will pause and wait for you to enter it manually (2-minute timeout).

### 2. Configure Salesforce URL (Optional)

If your Salesforce sandbox has a different URL, update both:

**1. Login URL in `global-setup.ts`:**
```typescript
const SALESFORCE_LOGIN_URL = 'https://your-instance.sandbox.my.salesforce.com/';
```

**2. Base URL in `playwright.config.ts`:**
```typescript
use: {
  baseURL: 'https://your-instance.sandbox.lightning.force.com',
  // ...
}
```

## Usage

### Basic Test Execution

Run all tests:
```bash
npx playwright test
```

Run tests with UI (headed mode):
```bash
npx playwright test --headed
```

Run specific test file:
```bash
npx playwright test tests/test-1.spec.ts
```

Run tests in debug mode:
```bash
npx playwright test --debug
```

Run tests in UI mode (interactive):
```bash
npx playwright test --ui
```

### Stress Testing with Parallel Workers

You can control workers and repetitions directly from the command line without modifying `playwright.config.ts`:

**Light stress test** (5 workers, 5 repetitions = 25 total executions):
```bash
npx playwright test --workers=5 --repeat-each=5
```

**Medium stress test** (10 workers, 10 repetitions = 100 total executions):
```bash
npx playwright test --workers=10 --repeat-each=10
```

**Heavy stress test** (20 workers, 20 repetitions = 400 total executions):
```bash
npx playwright test --workers=20 --repeat-each=20
```

**Heavy stress test with UI** (see browser actions):
```bash
npx playwright test --workers=20 --repeat-each=20 --headed
```

**Custom configuration example**:
```bash
npx playwright test --workers=15 --repeat-each=30 --headed
```

**Pro tip**: Start with fewer workers to avoid overwhelming the Salesforce instance:
```bash
# Start conservative
npx playwright test --workers=3 --repeat-each=5

# Gradually increase
npx playwright test --workers=10 --repeat-each=10

# Then go heavy if needed
npx playwright test --workers=20 --repeat-each=20
```

### Advanced Options

Combine multiple options for specific scenarios:

**Stress test with retries** (useful for flaky tests):
```bash
npx playwright test --workers=10 --repeat-each=10 --retries=2
```

**Specific test with stress**:
```bash
npx playwright test tests/test-1.spec.ts --workers=5 --repeat-each=10
```

**Debug mode with repetitions** (run same test multiple times to catch intermittent issues):
```bash
npx playwright test --repeat-each=5 --headed
```

**Maximum stress test** (use with caution):
```bash
npx playwright test --workers=50 --repeat-each=50 --headed
```

### View Test Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```

## How Authentication Works

### First Run or Expired Cookies
1. Global setup (`global-setup.ts`) checks if valid authentication exists
2. If not, it opens a browser and performs login automatically
3. Authentication state (cookies) is saved to `.auth/user.json`
4. Tests run using the saved authentication

### Subsequent Runs
1. Global setup validates existing cookies
2. If cookies are still valid, login is skipped
3. Tests run immediately using cached authentication

### Cookie Expiration
- Cookies are automatically checked for expiration before each test run
- If expired, the system automatically re-authenticates
- No manual intervention needed (assuming `SF_VERIFICATION_CODE` is set)

## Project Structure

```
salesforce-playwright-automation/
├── .auth/                    # Authentication storage (git-ignored)
│   └── user.json            # Saved cookies and session data
├── tests/                    # Test files
│   └── test-1.spec.ts       # Sample test
├── global-setup.ts          # Authentication handler
├── playwright.config.ts     # Playwright configuration
├── .env                     # Environment variables (git-ignored)
├── .env.example            # Example environment file
├── package.json
└── README.md               # This file
```

## Configuration

The project is configured in `playwright.config.ts` with the following settings:

- **Workers**: 1 (override with `--workers` flag)
- **Repeat**: 1 (override with `--repeat-each` flag)
- **Timeout**: 2 minutes per test
- **SlowMo**: 1 second delay between actions (for visibility)
- **Retries**: 1 retry on failure
- **Authentication**: Automatic via `global-setup.ts`

### Customizing Configuration

You can either:

**Option 1: Use CLI flags** (recommended for flexibility):
```bash
npx playwright test --workers=10 --repeat-each=20
```

**Option 2: Edit `playwright.config.ts`** (for permanent changes):
```typescript
workers: 5,
repeatEach: 10,
timeout: 300000, // 5 minutes
```

## Writing Tests

Tests automatically use the saved authentication state:

```typescript
import { expect, test } from '@playwright/test';

test('my salesforce test', async ({ page }) => {
  // Navigate directly to Salesforce - already authenticated!
  await page.goto('/lightning/page/home');

  // Your test steps here
  await page.getByRole('button', { name: 'Search' }).click();
  // ... more steps
});
```

## Troubleshooting

### Authentication Failed
- Verify your credentials in `.env` are correct
- Check that the verification code is up-to-date (changes daily)
- Ensure your Salesforce account is not locked
- Run with `--headed` flag to see what's happening:
  ```bash
  npx playwright test --headed
  ```

### Cookies Expired
- The system should automatically re-authenticate
- If issues persist, manually delete `.auth/user.json` to force fresh login:
  ```bash
  rm .auth/user.json
  ```

### Tests Timeout
- Increase timeout in `playwright.config.ts`:
  ```typescript
  timeout: 300000, // 5 minutes
  ```
- Check your network connection
- Verify Salesforce instance is accessible
- Reduce `slowMo` value for faster execution

### Too Many Parallel Executions Causing Failures
Reduce workers and repetitions:
```bash
npx playwright test --workers=2 --repeat-each=5
```

### Salesforce Rate Limiting
If you encounter rate limiting errors during stress tests:
- Reduce the number of workers: `--workers=5`
- Add delays between tests in `playwright.config.ts`
- Contact Salesforce support to increase your org's limits

### Verification Code Issues
- Update `SF_VERIFICATION_CODE` in `.env` daily
- Or leave it empty and run with `--headed` to enter manually:
  ```bash
  npx playwright test --headed
  ```

## Best Practices

1. **Update Verification Code Daily**: Set `SF_VERIFICATION_CODE` in `.env` each day
2. **Keep Credentials Secret**: Never commit `.env` to version control
3. **Start Small**: Begin stress tests with fewer workers and scale up
4. **Monitor Performance**: Watch for Salesforce rate limits and timeouts
5. **Use Page Objects**: For complex tests, consider implementing the Page Object pattern
6. **Add Wait Conditions**: Use explicit waits for dynamic Salesforce content
7. **Test in Isolation**: Each test should be independent and not rely on others

## Security Notes

- `.env` is git-ignored to prevent credential exposure
- `.auth/user.json` is git-ignored to protect session data
- Use environment-specific credentials (sandbox only)
- Rotate passwords regularly
- Never hardcode credentials in test files
- Use secure vaults for CI/CD pipelines

## CI/CD Integration

For automated testing in CI/CD pipelines:

1. **Store credentials securely** (GitHub Secrets, Azure Key Vault, etc.)
2. **Handle 2FA differently**:
   - Use API tokens if available
   - Configure test accounts without 2FA
   - Or implement automated 2FA handling
3. **Adjust configuration** for CI environment:
   ```typescript
   headless: !!process.env.CI,
   workers: process.env.CI ? 1 : undefined,
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests to ensure they pass
5. Add tests if applicable
6. Submit a pull request

## License

ISC

## Support

For issues and questions:
- Check the [Playwright documentation](https://playwright.dev)
- Review [Salesforce testing best practices](https://developer.salesforce.com/docs)
- Open an issue in the [GitHub repository](https://github.com/adelstrinidadns/salesforce-playwright-automation)
