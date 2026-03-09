import { expect, test } from '@playwright/test';

test('추천 필터와 상세 카드 시나리오', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('선호 기반 부동산 피드');

  await page.getByRole('combobox', { name: '지역' }).selectOption('Mapo');
  await page.getByRole('combobox', { name: '매물 유형' }).selectOption('OFFICE');
  await page.getByRole('combobox', { name: '계약 타입' }).selectOption('MONTHLY');
  await page.getByPlaceholder('최소').fill('5000');
  await page.getByPlaceholder('최대').fill('9000');

  const slider = page.getByLabel('스타일 점수 슬라이더');
  await slider.evaluate((el) => {
    el.value = '70';
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });

  await expect(page.getByText('추천 이유:').first()).toBeVisible();

  const detailButton = page.getByRole('button', { name: '상세 보기 열기' }).first();
  await detailButton.click();
  await expect(page.getByText('행정/스타일 정보')).toBeVisible();

  await page.screenshot({ path: 'screenshots/recommendation-feed.png', fullPage: true });
});
