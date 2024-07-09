// @ts-check
const { test, expect, chromium } = require('@playwright/test');
  test('wAll labels sh  ould be visible', async ({page}) => {
    await expect(page.getByRole('heading', { name: 'Add a New Workout' })).toBeVisible();
  });



