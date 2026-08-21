import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // این خط حتما باشد

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // این هم حتما اضافه شده باشد
  ],
})