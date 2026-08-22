import { expect, test } from '@playwright/test'

test.describe('The Dark Glass demo', () => {
  test('desktop page and lead actions work', async ({ page }) => {
    await page.goto('/dark-glass/')

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Комфорт')
    await expect(page.locator('.logo')).toHaveAttribute('href', './')
    await expect(page.locator('a[href="tel:+79290016222"]').first()).toBeVisible()

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
    expect(overflow).toBeFalsy()

    await page.locator('.level').last().click()
    await expect(page.locator('.level').last()).toHaveClass(/active/)
  })

  test('mobile navigation opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/dark-glass/')

    const burger = page.locator('.burger')
    await burger.click()
    await expect(burger).toHaveAttribute('aria-expanded', 'true')
    await expect(page.locator('#menu')).toHaveClass(/open/)

    await page.locator('#menu a').first().click()
    await expect(burger).toHaveAttribute('aria-expanded', 'false')

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
    expect(overflow).toBeFalsy()
  })
})
