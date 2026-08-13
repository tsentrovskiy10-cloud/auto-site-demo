import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './e2e', timeout: 30_000, fullyParallel: true, workers: 4,
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure' },
  webServer: { command: 'node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4173', url: 'http://127.0.0.1:4173', reuseExistingServer: true },
  projects: [
    { name: 'mobile-320', use: { ...devices['Desktop Chrome'], viewport: {width:320,height:800} } },
    { name: 'tablet', use: { ...devices['Desktop Chrome'], viewport: {width:768,height:1024} } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: {width:1366,height:900} } },
  ],
})
