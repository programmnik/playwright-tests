import { test } from '@playwright/test';

test.describe.skip('debug contact form state', () => {
    test('debug contact form state', async ({ page }) => {
        await page.goto('https://automation.tivaliclub.com/ru/contactus');

        await page.getByRole('button', { name: 'Отправить' }).click();
        console.log('EMPTY FORM BODY:\n' + (await page.locator('body').innerText()));

        await page.getByRole('textbox', { name: 'Email *' }).fill('   ');
        await page.getByRole('textbox', { name: 'Тема обращения *' }).fill('   ');
        await page.getByRole('textbox', { name: 'Сообщение *' }).fill('   ');
        await page.getByRole('button', { name: 'Отправить' }).click();
        console.log('WHITESPACE ALL BODY:\n' + (await page.locator('body').innerText()));

        await page.getByRole('textbox', { name: 'Email *' }).fill('test.user@example.com');
        await page.getByRole('textbox', { name: 'Тема обращения *' }).fill('   ');
        await page.getByRole('textbox', { name: 'Сообщение *' }).fill('Нормальное сообщение');
        await page.getByRole('button', { name: 'Отправить' }).click();
        console.log('WHITESPACE SUBJECT BODY:\n' + (await page.locator('body').innerText()));

        await page.getByRole('textbox', { name: 'Email *' }).fill('test.user@example.com');
        await page.getByRole('textbox', { name: 'Тема обращения *' }).fill('Тема');
        await page.getByRole('textbox', { name: 'Сообщение *' }).fill('   ');
        await page.getByRole('button', { name: 'Отправить' }).click();
        console.log('WHITESPACE MESSAGE BODY:\n' + (await page.locator('body').innerText()));

        const longMessage = 'Это длинное сообщение для проверки граничного значения. ' + 'x'.repeat(5000);
        await page.getByRole('textbox', { name: 'Сообщение *' }).fill(longMessage);
        await page.getByRole('textbox', { name: 'Тема обращения *' }).fill('Тема');
        await page.getByRole('textbox', { name: 'Email *' }).fill('test.user@example.com');
        await page.getByRole('button', { name: 'Отправить' }).click();
        console.log('LONG BODY:\n' + (await page.locator('body').innerText()));
    });
