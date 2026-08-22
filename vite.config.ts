import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { sites } from '@openai/sites-vite-plugin'

export default defineConfig({
  plugins: [react(), sites()],
  test: { environment: 'jsdom', setupFiles: './src/test/setup.ts', css: true, globals: true, include: ['src/**/*.test.tsx'] },
})
