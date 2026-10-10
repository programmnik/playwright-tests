import { test, expect, type Locator, type Page } from '@playwright/test';

const contactUsData = require('../data/contact-us.json');

async function typeInto(locator: Locator, value: string) {
  await locator.click();
  await locator.fill(value);
  await expect(locator).toHaveValue(value);
}

async function openContactForm(page: Page) {
  await page.goto('/ru/contactus');
  const form = page.locator('form');
  await expect(form).toBeVisible();

  const emailInput = form.getByLabel(/Email/i);
  const subjectInput = form.getByLabel(/Тема обращения/i);
  const messageInput = form.locator('textarea').first();
  const submitButton = form.getByRole('button', { name: /Отправить/i });

  await expect(form.locator('textarea')).toHaveCount(1);
  await expect(emailInput).toBeVisible();
  await expect(emailInput).toBeEditable();
  await expect(subjectInput).toBeVisible();
  await expect(subjectInput).toBeEditable();
  await expect(messageInput).toBeVisible();
  await expect(messageInput).toBeEditable();
  await expect(submitButton).toBeVisible();
  await expect(submitButton).toBeEnabled();

  await typeInto(messageInput, 'probe-ready');
  await expect.poll(async () => messageInput.inputValue(), { timeout: 5000 }).toBe('probe-ready');
  await messageInput.fill('');
  await expect(messageInput).toHaveValue('');

  return { form, emailInput, subjectInput, messageInput, submitButton };
}

test.describe('Contact Us Form', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('1.5. Граничное значение: длинный текст', async ({ page }) => {
    const longMessage = `${contactUsData.longText.message}${'x'.repeat(5000)}`;
    const { emailInput, subjectInput, messageInput, submitButton } = await openContactForm(page);
    const longTextError = page.getByText(/Сообщение слишком длинное/i);

    await typeInto(messageInput, longMessage);
    await typeInto(subjectInput, contactUsData.longText.subject);
    await typeInto(emailInput, contactUsData.longText.email);

    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    await expect(longTextError).toHaveCount(1);
    await expect(longTextError).toBeVisible();
    await expect(longTextError).toHaveText(/Сообщение слишком длинное \(максимум 1000 символов\)\./i);
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Форма отправлена!' })).toHaveCount(0);
    await expect(page).toHaveURL(/\/ru\/contactus(?:\?.*)?$/);
    await expect(submitButton).toBeVisible();
  });
});
