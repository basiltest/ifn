import { chromium } from 'playwright'
const BASE = 'http://localhost:5173'
const OUT = '/tmp/ifn_shots'

const browser = await chromium.launch({ executablePath: '/usr/bin/chromium' })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
await page.getByPlaceholder('Alex Chen').fill('Billal Ainaoui')
await page.getByPlaceholder('name@ifheindia.org').fill('billal@ifheindia.org')
await page.getByRole('button', { name: 'Enter IFN' }).click()
await page.waitForURL(`${BASE}/`)

// settings toggles
await page.goto(`${BASE}/settings`, { waitUntil: 'networkidle' })
await page.waitForTimeout(400)
await page.screenshot({ path: `${OUT}/8-settings.png` })

// crop just the notifications toggles
const notif = page.locator('section', { hasText: 'Notifications' }).first()
await notif.screenshot({ path: `${OUT}/8b-toggles.png` })

// feed scrolled — search must stay pinned at top
await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
await page.waitForTimeout(400)
await page.mouse.wheel(0, 700)
await page.waitForTimeout(500)
await page.screenshot({ path: `${OUT}/9-feed-scrolled.png` })

await browser.close()
console.log('done')
