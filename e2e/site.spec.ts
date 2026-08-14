import { expect, test } from '@playwright/test'

test('loads, navigates and has no horizontal overflow', async ({page},testInfo) => {
  await page.goto('/')
  await expect(page.getByRole('heading',{level:1})).toContainText('Автомобиль')
  await expect(page.getByText('Детейлинг-мойка')).toBeVisible()
  await expect(page.getByText('Porsche 911 Carrera')).toBeVisible()
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)
  expect(overflow).toBeLessThanOrEqual(1)
  if(testInfo.project.name==='desktop'){
    await page.getByRole('navigation',{name:'Основная навигация'}).getByRole('button',{name:'Услуги'}).click()
    await expect(page.locator('#services')).toBeInViewport()
  }else{
    await page.getByLabel('Открыть меню').click(); await expect(page.getByLabel('Мобильная навигация')).toBeVisible()
    await page.getByLabel('Мобильная навигация').getByRole('button',{name:/Работы/}).click()
    await expect(page.locator('#works')).toBeInViewport()
  }
})

test('hero CTA and form validation/success work', async ({page}) => {
  await page.goto('/')
  await page.getByRole('button',{name:/Рассчитать стоимость/}).click()
  await expect(page.locator('#request')).toBeInViewport()
  await page.getByRole('button',{name:/Получить расчёт/}).click()
  await expect(page.getByText('Укажите, как к вам обращаться')).toBeVisible()
  await page.getByLabel(/Ваше имя/).fill('Антон')
  const phone=page.getByRole('textbox',{name:/^Телефон/})
  await phone.fill('123')
  await expect(phone).toHaveValue('+7 (123)')
  await page.getByRole('button',{name:/Получить расчёт/}).click()
  await expect(page.getByText(/Введите номер полностью/)).toBeVisible()
  await phone.fill('+7 999 222-33-44')
  await page.getByRole('button',{name:/Получить расчёт/}).click()
  await expect(page.getByText('Заявка принята')).toBeVisible()
})

test('before/after, portfolio and modal interactions work', async ({page}) => {
  await page.goto('/')
  const compare=page.locator('.compare'); await compare.scrollIntoViewIfNeeded(); const box=await compare.boundingBox();
  if(box){await page.mouse.move(box.x+box.width*.25,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width*.7,box.y+box.height/2);await page.mouse.up();expect(await page.locator('.before').getAttribute('style')).toContain('70')}
  await page.getByRole('button',{name:/Porsche 911 Carrera/}).click(); await expect(page.getByRole('dialog',{name:'Porsche 911 Carrera'})).toBeVisible(); await page.keyboard.press('Escape'); await expect(page.getByRole('dialog',{name:'Porsche 911 Carrera'})).toBeHidden()
  await page.getByRole('button',{name:'Политика конфиденциальности'}).click(); await expect(page.getByRole('dialog')).toBeVisible(); await page.getByRole('button',{name:'Закрыть'}).click(); await expect(page.getByRole('dialog')).toBeHidden()
  await expect(page.getByRole('link',{name:'+7 (999) 123-45-67'}).first()).toHaveAttribute('href','tel:+79991234567')
})

test('map has a direct expand link to Yandex Maps', async ({page}) => {
  await page.goto('/')
  const map=page.getByTitle('Интерактивная карта проезда к APEX DETAILING').first()
  await map.scrollIntoViewIfNeeded()
  await expect(map).toHaveAttribute('src',/yandex\.ru\/map-widget/)
  const expand=page.getByRole('link',{name:'Открыть карту в Яндекс Картах'})
  await expect(expand).toHaveAttribute('href',/yandex\.ru\/maps/)
  await expect(expand).toHaveAttribute('target','_blank')
})
