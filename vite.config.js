import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Skyramp's test executor runs Playwright inside a container and rewrites
    // localhost/127.0.0.1 to host.docker.internal so it can reach this dev server
    // on the host. Vite >=5.4.12 rejects unknown Host headers with a 403
    // "Blocked request", which makes the page load but render nothing — surfacing
    // as an opaque element timeout in UI tests. Allow the host explicitly. (SKYR-4139)
    allowedHosts: ['host.docker.internal'],
    proxy: {
      '/record': 'http://localhost:5050',
    },
  },
})
