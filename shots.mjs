import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const OUT = '/tmp/ifn_shots'
mkdirSync(OUT, { recursive: true })
const BASE = 'http://localhost:5173'

async function launch() {
  try {
    return await chromium.launch()
  } catch (e) {
    console.log('default launch failed, trying system chromium:', e.message)
    return await chromium.launch({ executablePath: '/usr/bin/chromium' })
  }
}

const browser = await launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

const shot = async (name) => {
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${OUT}/${name}.png` })
  console.log('shot:', name)
}

// login
await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
await shot('1-login')
await page.getByPlaceholder('Alex Chen').fill('Billal Ainaoui')
await page.getByPlaceholder('name@ifheindia.org').fill('billal@ifheindia.org')
await page.getByRole('button', { name: 'Enter IFN' }).click()
await page.waitForURL(`${BASE}/`)
await page.waitForTimeout(700)
await shot('2-feed')

// pipeline
await page.goto(`${BASE}/pipeline`, { waitUntil: 'networkidle' })
await shot('3-pipeline')

// calendar
await page.goto(`${BASE}/calendar`, { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
await shot('4-calendar')

// team board
await page.goto(`${BASE}/team`, { waitUntil: 'networkidle' })
await shot('5-team')

// profile
await page.goto(`${BASE}/profile`, { waitUntil: 'networkidle' })
await shot('6-profile')

// switch to Admin via header role switcher, then Tag Requests
await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
await page.getByRole('button', { name: /Student|Mentor|Admin/ }).first().click()
await page.getByRole('button', { name: 'Admin' }).click()
await page.waitForTimeout(400)
await page.goto(`${BASE}/tags`, { waitUntil: 'networkidle' })
await shot('7-admin-tagrequests')

await browser.close()
console.log('done ->', OUT)
