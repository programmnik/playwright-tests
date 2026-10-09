import { test } from '@playwright/test';
import { ContactPage } from '../pages/contact.page';

test.describe('Contact Us Form', () => {
  test('1.2. Проверка обязательных полей при пустом заполнении', async ({ page }) => {
    const contactPage = new ContactPage(page);

    await contactPage.goto();
    await contactPage.submit();

    await contactPage.expectValidationError('Email');
    await contactPage.expectValidationError('Тема обращения');
    await contactPage.expectValidationError('Сообщение');
  });
});
