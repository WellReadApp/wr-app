import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

// Plugin to inject build version into service worker
function injectServiceWorkerVersion(): Plugin {
  return {
    name: 'inject-sw-version',
    writeBundle() {
      try {
        const swPath = resolve(__dirname, 'dist/sw.js');
        const publicSwPath = resolve(__dirname, 'public/sw.js');
        
        // Generate a version based on timestamp
        const version = Date.now().toString();
        
        // Read the source service worker
        const swContent = readFileSync(publicSwPath, 'utf-8');
        
        // Replace the placeholder with actual version
        const updatedContent = swContent.replace('__BUILD_VERSION__', version);
        
        // Write to dist folder
        writeFileSync(swPath, updatedContent);
        
        console.log(`✅ Service worker versioned: ${version}`);
      } catch (error) {
        console.warn('⚠️  Could not version service worker:', error);
      }
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), injectServiceWorkerVersion()],
  build: {
    // Generate unique hashes for assets
    rollupOptions: {
      output: {
        // Ensure assets have unique names based on content hash
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
})
