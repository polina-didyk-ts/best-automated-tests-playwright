import { test, expect } from '@playwright/test';

test('valid all', async ({ page }) => {
  await page.goto('https://traineeautomation.azurewebsites.net/Login?returnUrl=%2F');

  await page.getByLabel('Username').fill('user');
  await page.getByLabel('Password').fill('123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByText('Users and Addresses')).toBeVisible();
});

test('invalid username, valid password', async ({ page }) => {
  await page.goto('https://traineeautomation.azurewebsites.net/Login?returnUrl=%2F');

  await page.getByLabel('Username').fill('uaerrr');
  await page.getByLabel('Password').fill('123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByText('Invalid username or password')).toBeVisible();
});

test('valid username, invalid password', async ({ page }) => {
  await page.goto('https://traineeautomation.azurewebsites.net/Login?returnUrl=%2F');

  await page.getByLabel('Username').fill('user');
  await page.getByLabel('Password').fill('321');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByText('Invalid username or password')).toBeVisible();
});

test('invalid username, invalid password', async ({ page }) => {
  await page.goto('https://traineeautomation.azurewebsites.net/Login?returnUrl=%2F');

  await page.getByLabel('Username').fill('uaerrr');
  await page.getByLabel('Password').fill('321');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByText('Invalid username or password')).toBeVisible();
});
