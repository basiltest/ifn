import { chromium } from 'playwright'
const BASE = 'http://localhost:5173'
const OUT = '/tmp/ifn_shots'

const browser = await chromium.launch({ executablePath: '/usr/bin/chromium' })
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })

await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
await page.getByPlaceholder('Alex Chen').fill('Billal Ainaoui')
await page.getByPlaceholder('name@ifheindia.org').fill('billal@ifheindia.org')
await page.getByRole('button', { name: 'Enter IFN' }).click()
await page.waitForURL(`${BASE}/`)

// pipeline -> select AgriPrice (G3, has submission fields)
await page.goto(`${BASE}/pipeline`, { waitUntil: 'networkidle' })
await page.waitForTimeout(300)
await page.locator('button', { hasText: 'AgriPrice' }).first().click()
await page.waitForTimeout(400)
await page.screenshot({ path: `${OUT}/F-pipeline-detail.png`, fullPage: true })

// switch to Mentor, open review
await page.getByRole('button', { name: /Student|Mentor|Admin/ }).first().click()
await page.getByRole('button', { name: 'Mentor' }).click()
await page.waitForTimeout(300)
await page.goto(`${BASE}/review`, { waitUntil: 'networkidle' })
await page.waitForTimeout(400)
await page.screenshot({ path: `${OUT}/F-mentor-review.png`, fullPage: true })

// create post -> expand submission details
await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
await page.getByRole('button', { name: 'Create Post' }).click()
await page.waitForTimeout(300)
await page.getByText('G1 submission details (optional)').click()
await page.waitForTimeout(300)
await page.screenshot({ path: `${OUT}/F-create-post.png` })

await browser.close()
console.log('done')
