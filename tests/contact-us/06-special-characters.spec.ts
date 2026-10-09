import { test, expect } from '@playwright/test';
import { ContactPage } from '../pages/contact.page';

const contactUsData = require('../data/contact-us.json');

test.describe('Contact Us Form', () => {
  test('1.6. Спецсимволы и Unicode', async ({ page }) => {
    const contactPage = new ContactPage(page);

    await contactPage.goto();
    await contactPage.fillForm(contactUsData.specialCharacters);

    await expect(contactPage.emailInput).toHaveValue(contactUsData.specialCharacters.email);
    await expect(contactPage.subjectInput).toHaveValue(contactUsData.specialCharacters.subject);
    await expect(contactPage.messageInput).toHaveValue(contactUsData.specialCharacters.message);

    await contactPage.submit();

    await expect(page.getByText(/обязательное|неверный|ошибка|required|invalid/i)).toHaveCount(0);
  });
});
