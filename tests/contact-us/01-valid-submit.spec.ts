import { test, expect } from '@playwright/test';
import { ContactPage } from '../pages/contact.page';

const contactUsData = require('../data/contact-us.json');

test.describe('Contact Us Form', () => {
  test('1.1. Успешная отправка валидной формы', async ({ page }) => {
    const contactPage = new ContactPage(page);

    await contactPage.goto();
    await contactPage.fillForm(contactUsData.valid);

    await expect(contactPage.emailInput).toHaveValue(contactUsData.valid.email);
    await expect(contactPage.subjectInput).toHaveValue(contactUsData.valid.subject);
    await expect(contactPage.messageInput).toHaveValue(contactUsData.valid.message);

    await contactPage.submit();

    await expect(page.getByText(/обязательное|неверный|ошибка|required|invalid/i)).toHaveCount(0);
  });
});
