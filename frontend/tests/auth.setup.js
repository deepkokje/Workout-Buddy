
import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/auth/user.json';

setup('authenticate', async ({ page } ) => {
    await page.goto('http://localhost:3000/login')
    await page.locator("[name='email']").fill('dpj21@gmail.com');
    await page.locator("[name='password']").fill('Deep@1998');
    await page.locator("[name='login']").click();
    // await page.waitForURL('http://localhost:3000');
    await page.context().storageState({ path: authFile });
  });
