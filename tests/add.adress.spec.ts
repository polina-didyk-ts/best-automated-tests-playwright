import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login';

test('Add Address page opens successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login('user', '123');

  await page.getByTestId('addAddress-button').first().click();
  await expect(page.getByRole('heading', { name: 'Add Address' })).toBeVisible();
});
