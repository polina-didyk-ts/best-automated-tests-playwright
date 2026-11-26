import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login';

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('user', '123');
});

test('Add Address page opens successfully', async ({ page }) => {
  await page.getByTestId('addAddress-button').first().click();
  await expect(page.getByRole('heading', { name: 'Add Address' })).toBeVisible();
});

test('Address can be created with valid data', async ({ page }) => {
  const street = `Test St ${Date.now()}`;

  await page.getByTestId('addAddress-button').first().click();
  await page.getByRole('textbox', { name: 'Street Address' }).fill(street);
  await page.getByRole('textbox', { name: 'City' }).fill('New York');
  await page.getByRole('textbox', { name: 'State' }).fill('NY');
  await page.getByRole('textbox', { name: 'Zip Code' }).fill('10392');
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByTestId('table-Addresses').getByText(street)).toBeVisible();
});

test('Street Address field is required', async ({ page }) => {
  await page.getByTestId('addAddress-button').first().click();
  await page.getByRole('textbox', { name: 'City' }).fill('New York');
  await page.getByRole('textbox', { name: 'State' }).fill('NY');
  await page.getByRole('textbox', { name: 'Zip Code' }).fill('10392');
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByText('Street Address is required')).toBeVisible();
});

test('City field is required', async ({ page }) => {
  await page.getByTestId('addAddress-button').first().click();
  await page.getByRole('textbox', { name: 'Street Address' }).fill('123 Main Street');
  await page.getByRole('textbox', { name: 'State' }).fill('NY');
  await page.getByRole('textbox', { name: 'Zip Code' }).fill('10392');
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByText('City is required')).toBeVisible();
});

test('State field is required', async ({ page }) => {
  await page.getByTestId('addAddress-button').first().click();
  await page.getByRole('textbox', { name: 'Street Address' }).fill('123 Main Street');
  await page.getByRole('textbox', { name: 'City' }).fill('New York');
  await page.getByRole('textbox', { name: 'Zip Code' }).fill('10392');
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByText('State is required')).toBeVisible();
});

test('Zip Code field is required', async ({ page }) => {
  await page.getByTestId('addAddress-button').first().click();
  await page.getByRole('textbox', { name: 'Street Address' }).fill('123 Main Street');
  await page.getByRole('textbox', { name: 'City' }).fill('New York');
  await page.getByRole('textbox', { name: 'State' }).fill('NY');
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByText('Zip Code is required')).toBeVisible();
});

test('Address cannot be created with invalid data', async ({ page }) => {
  await page.getByTestId('addAddress-button').first().click();
  await page.getByRole('textbox', { name: 'Street Address' }).fill('123 Main Street');
  await page.getByRole('textbox', { name: 'City' }).fill('New York');
  await page.getByRole('textbox', { name: 'State' }).fill('NY');
  await page.getByRole('textbox', { name: 'Zip Code' }).fill('qwerty');
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByText('Zip Code is incorrect')).toBeVisible();
});

test('Cancel button cancels address creation', async ({ page }) => {
  await page.getByTestId('addAddress-button').first().click();
  await page.getByRole('textbox', { name: 'Street Address' }).fill('123 Main Street');
  await page.getByRole('textbox', { name: 'City' }).fill('New York');
  await page.getByRole('textbox', { name: 'State' }).fill('NY');
  await page.getByRole('textbox', { name: 'Zip Code' }).fill('10392');
  await page.getByRole('link', { name: 'Cancel' }).click();
  await expect(page.getByText('Users and Addresses')).toBeVisible();
});

test.describe('Street Address. Boundary Value Analysis', () => {
  test('Minimum allowed length of 5 characters', async ({ page }) => {
    await page.getByTestId('addAddress-button').first().click();
    await page.getByRole('textbox', { name: 'Street Address' }).fill('12 St');
    await page.getByRole('textbox', { name: 'City' }).fill('New York');
    await page.getByRole('textbox', { name: 'State' }).fill('NY');
    await page.getByRole('textbox', { name: 'Zip Code' }).fill('10392');
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page.getByText('Users and Addresses')).toBeVisible();
  });

  test('Shorter than the minimum of 5 characters', async ({ page }) => {
    await page.getByTestId('addAddress-button').first().click();
    await page.getByRole('textbox', { name: 'Street Address' }).fill('12 S');
    await page.getByRole('textbox', { name: 'City' }).fill('New York');
    await page.getByRole('textbox', { name: 'State' }).fill('NY');
    await page.getByRole('textbox', { name: 'Zip Code' }).fill('10392');
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page.getByText('Street Address is too short')).toBeVisible();
  });

  test('Maximum allowed length of 30 characters', async ({ page }) => {
    await page.getByTestId('addAddress-button').first().click();
    await page
      .getByRole('textbox', { name: 'Street Address' })
      .fill('123456789012345678901234567890');
    await page.getByRole('textbox', { name: 'City' }).fill('New York');
    await page.getByRole('textbox', { name: 'State' }).fill('NY');
    await page.getByRole('textbox', { name: 'Zip Code' }).fill('10392');
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page.getByText('Users and Addresses')).toBeVisible();
  });

  test('Longer than the maximum of 30 characters', async ({ page }) => {
    await page.getByTestId('addAddress-button').first().click();
    await page
      .getByRole('textbox', { name: 'Street Address' })
      .fill('1234567890123456789012345678901');
    await expect(page.getByRole('textbox', { name: 'Street Address' })).toHaveValue(
      '123456789012345678901234567890',
    );
  });
});
