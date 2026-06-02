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

// settings -> toggle dark
await page.goto(`${BASE}/settings`, { waitUntil: 'networkidle' })
await page.getByRole('switch').first().click() // Dark mode is the first switch (Appearance section)
await page.waitForTimeout(500)
await page.screenshot({ path: `${OUT}/D-settings-dark.png` })

// feed dark
await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
await page.screenshot({ path: `${OUT}/D-feed-dark.png` })

// calendar dark
await page.goto(`${BASE}/calendar`, { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
await page.screenshot({ path: `${OUT}/D-calendar-dark.png` })

// post detail dark
await page.goto(`${BASE}/post/p_agriprice`, { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
await page.screenshot({ path: `${OUT}/D-post-dark.png` })

await browser.close()
console.log('done')
