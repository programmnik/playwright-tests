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

  test('1.1. Успешная отправка валидной формы', async ({ page }) => {
    const { emailInput, subjectInput, messageInput, submitButton } = await openContactForm(page);

    await typeInto(messageInput, contactUsData.valid.message);
    await typeInto(subjectInput, contactUsData.valid.subject);
    await typeInto(emailInput, contactUsData.valid.email);

    console.log('DEBUG before submit', {
      message: await messageInput.inputValue(),
      subject: await subjectInput.inputValue(),
      email: await emailInput.inputValue(),
    });

    await expect(page.getByText(/Некорректный email|обязательна|обязательно|слишком длинное|Ошибка/i)).toHaveCount(0);
    await expect(submitButton).toBeEnabled();
    await expect(submitButton).toHaveCount(1);
    await submitButton.click();

    const dialog = page.getByRole('dialog');
    const successTitle = dialog.getByRole('heading', { name: 'Форма отправлена!' });
    const okButton = dialog.getByRole('button', { name: 'OK' });

    await expect(dialog).toBeVisible({ timeout: 15000 });
    await expect(successTitle).toBeVisible();
    await expect(okButton).toBeVisible();
    await okButton.click();
    await expect(dialog).toBeHidden();
  });
});
