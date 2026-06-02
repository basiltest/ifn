import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const OUT = '/tmp/ifn_shots'
mkdirSync(OUT, { recursive: true })
const BASE = 'http://localhost:5173/ifn'

async function launch() {
  try {
    return await chromium.launch()
  } catch (e) {
    console.log('default launch failed, system chromium:', e.message)
    return await chromium.launch({ executablePath: '/usr/bin/chromium' })
  }
}

const browser = await launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
const shot = async (name) => {
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${OUT}/${name}.png` })
  console.log('shot:', name)
}

// login (HashRouter -> routes live behind #)
await page.goto(`${BASE}/#/login`, { waitUntil: 'networkidle' })
await page.getByPlaceholder('Alex Chen').fill('Billal Ainaoui')
await page.getByPlaceholder('name@ifheindia.org').fill('billal@ifheindia.org')
await page.getByRole('button', { name: 'Enter IFN' }).click()
await page.waitForTimeout(900)
await shot('m1-feed-closed') // expect hamburger top-left, no sidebar

// open drawer
await page.getByRole('button', { name: 'Open navigation' }).click()
await shot('m2-drawer-open') // expect slide-in nav + backdrop

// tap a nav item -> should navigate AND close drawer
await page.getByRole('link', { name: 'Idea Pipeline' }).click()
await page.waitForTimeout(700)
await shot('m3-after-nav') // expect pipeline page, drawer closed

await browser.close()
console.log('done ->', OUT)
