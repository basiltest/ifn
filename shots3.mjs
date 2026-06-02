import { chromium } from 'playwright'
const BASE = 'http://localhost:5173'
const OUT = '/tmp/ifn_shots'

const browser = await chromium.launch({ executablePath: '/usr/bin/chromium' })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
await page.waitForTimeout(300)
await page.screenshot({ path: `${OUT}/A-login.png` })

await page.getByPlaceholder('Alex Chen').fill('Billal Ainaoui')
await page.getByPlaceholder('name@ifheindia.org').fill('billal@ifheindia.org')
await page.getByRole('button', { name: 'Enter IFN' }).click()
await page.waitForURL(`${BASE}/`)
await page.waitForTimeout(600)
await page.screenshot({ path: `${OUT}/B-feed.png` })

// click a post title to open permalink (Reddit-style)
await page.getByText('AgriPrice — live mandi prices for small farmers over SMS').first().click()
await page.waitForTimeout(700)
await page.screenshot({ path: `${OUT}/C-postdetail.png` })

await browser.close()
console.log('done', await page.url())
