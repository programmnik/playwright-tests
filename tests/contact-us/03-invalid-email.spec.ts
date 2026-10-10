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

  test('1.3. Невалидный email', async ({ page }) => {
    const { emailInput, subjectInput, messageInput, submitButton } = await openContactForm(page);

    await typeInto(messageInput, contactUsData.valid.message);
    await typeInto(subjectInput, contactUsData.valid.subject);
    await typeInto(emailInput, contactUsData.invalidEmails[0]);

    await expect(page.getByText(/Некорректный email|обязательна|обязательно|слишком длинное|Ошибка/i)).toHaveCount(0);
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    await expect(page.getByText('Некорректный email', { exact: true })).toBeVisible();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page).toHaveURL(/\/ru\/contactus(?:\?.*)?$/);
    await expect(submitButton).toBeVisible();
  });
});
