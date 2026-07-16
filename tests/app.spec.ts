import { test, expect } from '@playwright/test';

test('login page signs into the storefront', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();

  await page.getByRole('button', { name: 'Continue with Google' }).click();

  await expect(page.getByRole('heading', { name: 'Sell tooling with a strong first impression.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '10 tools for sale' })).toBeVisible();
  await expect(page.locator('.status-pill')).toContainText('Signed in with mocked Google SSO.');
});

test('dark mode switch persists and settings updates are editable', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Continue with Google' }).click();

  await page.getByRole('button', { name: 'Dark mode' }).click();
  await expect(page.locator(':root')).toHaveAttribute('data-theme', 'dark');

  await page.getByRole('button', { name: /Alex Morgan/i }).click();
  await expect(page.getByRole('heading', { name: 'User profile settings' })).toBeVisible();

  await page.getByLabel('Update profile').fill('Jordan Lee');
  await page.getByLabel('Update email').fill('jordan@example.com');
  await page.getByLabel('Update password').fill('new-password');
  await page.getByLabel('Currency').selectOption('EUR');

  await page.getByRole('button', { name: 'Back to home' }).click();
  await page.getByRole('button', { name: /Jordan Lee/i }).click();
  await page.getByRole('button', { name: 'Logout' }).click();

  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
});
