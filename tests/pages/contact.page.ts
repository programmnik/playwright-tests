import { type Locator, type Page, expect } from '@playwright/test';

export class ContactPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly subjectInput: Locator;
  readonly messageInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    const form = page.locator('form');
    this.emailInput = form.getByLabel(/Email/i);
    this.subjectInput = form.getByLabel(/Тема обращения/i);
    this.messageInput = form.locator('textarea').first();
    this.submitButton = form.getByRole('button', { name: /Отправить/i });
  }

  async goto() {
    await this.page.goto('/ru/contactus');
    await expect(this.page).toHaveURL(/\/ru\/contactus(?:\?.*)?$/);
    await expect(this.emailInput).toBeVisible();
    await expect(this.subjectInput).toBeVisible();
    await expect(this.messageInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async typeInto(locator: Locator, value: string) {
    await locator.click();
    await locator.fill(value);
    await expect(locator).toHaveValue(value);
  }

  async fillForm(form: { email: string; subject: string; message: string }) {
    await this.typeInto(this.emailInput, form.email);
    await this.typeInto(this.subjectInput, form.subject);
    await this.typeInto(this.messageInput, form.message);
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
