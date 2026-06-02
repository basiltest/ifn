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
await page.waitForTimeout(400)
// feed shows comment counts now
await page.screenshot({ path: `${OUT}/E-feed-comments.png` })

// open agriprice -> comments thread
await page.goto(`${BASE}/post/p_agriprice`, { waitUntil: 'networkidle' })
await page.waitForTimeout(400)
// add a comment
await page.getByPlaceholder('Add a comment…').fill('Demoing the new comments — works great.')
await page.getByRole('button', { name: 'Comment' }).click()
await page.waitForTimeout(500)
await page.screenshot({ path: `${OUT}/E-post-comments.png`, fullPage: true })

await browser.close()
console.log('done')
