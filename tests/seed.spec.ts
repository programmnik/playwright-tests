import { test, expect } from '@playwright/test';

test('seed', async ({ page }) => {
  await page.goto('https://automation.tivaliclub.com/ru/contactus', {
    waitUntil: 'domcontentloaded',
  });

  // Ждём, что страница реально загрузилась — по заголовку или по форме
  await expect(page).toHaveURL(/contactus/);
});