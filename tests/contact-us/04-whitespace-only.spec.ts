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
  for (const field of ['Email', 'Тема обращения', 'Сообщение']) {
    test.beforeEach(async ({ context }) => {
      await context.clearCookies();
    });

    test(`1.4. Поле "${field}" не принимает строку из пробелов`, async ({ page }) => {
      const { emailInput, subjectInput, messageInput, submitButton } = await openContactForm(page);
      const valueMap = {
        Email: '   ',
        'Тема обращения': '   ',
        Сообщение: '   ',
      };

      if (field === 'Сообщение') {
        await typeInto(messageInput, valueMap[field]);
        await typeInto(subjectInput, contactUsData.valid.subject);
        await typeInto(emailInput, contactUsData.valid.email);
      } else if (field === 'Тема обращения') {
        await typeInto(messageInput, contactUsData.valid.message);
        await typeInto(subjectInput, valueMap[field]);
        await typeInto(emailInput, contactUsData.valid.email);
      } else {
        await typeInto(messageInput, contactUsData.valid.message);
        await typeInto(subjectInput, contactUsData.valid.subject);
        await emailInput.fill(valueMap[field]);
        await expect(emailInput).toHaveValue('');
      }

      const actualTarget = field === 'Email' ? emailInput : field === 'Тема обращения' ? subjectInput : messageInput;
      const expectedValue = field === 'Email' ? '' : valueMap[field];
      await expect(actualTarget).toHaveValue(expectedValue);

      await expect(submitButton).toBeEnabled();
      await submitButton.click();

      if (field === 'Email') {
        await expect(page.getByText(/Некорректный email|Введите корректный email|Email.*обязател/i)).toBeVisible();
      } else if (field === 'Тема обращения') {
        await expect(page.getByText(/Тема.*обязател|Необходимо указать тему|Укажите тему/i)).toBeVisible();
      } else {
        await expect(page.getByText(/Сообщение.*обязательно|Необходимо.*сообщение|Введите.*сообщение/i)).toBeVisible();
      }

      await expect(page.getByRole('dialog')).toHaveCount(0);
      await expect(page.getByRole('heading', { name: 'Форма отправлена!' })).toHaveCount(0);
      await expect(page).toHaveURL(/\/ru\/contactus(?:\?.*)?$/);
      await expect(submitButton).toBeVisible();
    });
  }
});
