import { test, expect } from '@playwright/test';
import { ContactPage } from '../pages/contact.page';

const contactUsData = require('../data/contact-us.json');

test.describe('Contact Us Form', () => {
  test('1.5. Граничное значение: длинный текст', async ({ page }) => {
    const contactPage = new ContactPage(page);
    const longMessage = `${contactUsData.longText.message}${'x'.repeat(5000)}`;
    const longTextError = page.locator('span.text-t-red-300-error', {
      hasText: /Сообщение слишком длинное/i,
    });

    await contactPage.goto();
    await contactPage.fillForm({
      email: contactUsData.longText.email,
      subject: contactUsData.longText.subject,
      message: longMessage,
    });

    await expect(contactPage.messageInput).toHaveValue(longMessage);

    await contactPage.submit();

    await expect(longTextError).toHaveCount(1);
    await expect(longTextError).toBeVisible();
    await expect(longTextError).toHaveText(/Сообщение слишком длинное \(максимум 1000 символов\)\./i);
    await expect(page).toHaveURL(/\/ru\/contactus(?:\?.*)?$/);
    await expect(page.getByRole('button', { name: 'Отправить' })).toBeVisible();
  });
});
