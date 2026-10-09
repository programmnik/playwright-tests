import { test, expect } from '@playwright/test';

const contactUsData = require('../data/contact-us.json');

test.describe('Contact Us Form', () => {
  test('1.3. Невалидный email', async ({ page }) => {
    const invalidEmail = contactUsData.invalidEmails[0];
    const emailError = page.locator('span.text-t-red-300-error', {
      hasText: 'Некорректный email',
    });

    await page.goto('https://automation.tivaliclub.com/ru/contactus', {
      waitUntil: 'domcontentloaded',
    });

    await page.getByLabel(/Email/i).fill(invalidEmail);
    await page.getByLabel(/Тема обращения/i).fill(contactUsData.valid.subject);
    await page.getByLabel(/Сообщение/i).fill(contactUsData.valid.message);
    await page.getByRole('button', { name: 'Отправить' }).click();

    await expect(emailError).toHaveCount(1);
    await expect(emailError).toBeVisible();
    await expect(emailError).toHaveText('Некорректный email');

    await expect(page).toHaveURL(/\/ru\/contactus$/);
    await expect(page.getByRole('button', { name: 'Отправить' })).toBeVisible();
  });
});
