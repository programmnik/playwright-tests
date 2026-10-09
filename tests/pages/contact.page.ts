import { type Locator, type Page, expect } from '@playwright/test';

export class ContactPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly subjectInput: Locator;
  readonly messageInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel(/Email/i);
    this.subjectInput = page.getByLabel(/Тема обращения/i);
    this.messageInput = page.getByLabel(/Сообщение/i);
    this.submitButton = page.getByRole('button', { name: /Отправить/i });
  }

  async goto() {
    await this.page.goto('/ru/contactus');
    await expect(this.page).toHaveURL(/\/ru\/contactus(?:\?.*)?$/);
    await expect(this.emailInput).toBeVisible();
    await expect(this.subjectInput).toBeVisible();
    await expect(this.messageInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async fillForm(form: { email: string; subject: string; message: string }) {
    await this.emailInput.fill(form.email);
    await this.subjectInput.fill(form.subject);
    await this.messageInput.fill(form.message);
  }

  async expectValidationError(
    fieldName: string,
    expectedText: RegExp = /обязательное|обязательно|required|invalid|неверный|введите/i,
  ) {
    await expect(this.page.getByLabel(new RegExp(fieldName, 'i'))).toBeVisible();
    await expect(this.page.getByText(expectedText)).toBeVisible();
  }

  async submit() {
    await this.submitButton.click();
  }
}
