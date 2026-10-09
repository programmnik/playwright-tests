import { test, expect } from '@playwright/test';

const contactUsData = require('../data/contact-us.json');

test.describe('Contact Us Form', () => {
  for (const field of ['Email', 'Тема обращения', 'Сообщение']) {
    test(`1.4. Поле "${field}" не принимает строку из пробелов`, async ({ page }) => {
      const validEmail = contactUsData.valid.email;
      const validSubject = contactUsData.valid.subject;
      const validMessage = contactUsData.valid.message;

      await page.goto('https://automation.tivaliclub.com/ru/contactus', {
        waitUntil: 'domcontentloaded',
      });

      await page.getByLabel(/Email/i).fill(field === 'Email' ? '   ' : validEmail);
      await page.getByLabel(/Тема обращения/i).fill(field === 'Тема обращения' ? '   ' : validSubject);
      await page.getByLabel(/Сообщение/i).fill(field === 'Сообщение' ? '   ' : validMessage);

      await page.getByRole('button', { name: 'Отправить' }).click();

      await expect(page).toHaveURL(/\/ru\/contactus(?:\?.*)?$/);
      await expect(page.getByRole('button', { name: 'Отправить' })).toBeVisible();
    });
  }
});
