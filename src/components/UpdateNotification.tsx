import { useEffect } from 'react';

export const UpdateNotification: React.FC = () => {
  useEffect(() => {
    // Check if service worker is supported
    if (!('serviceWorker' in navigator)) {
      return;
    }

    // Function to activate waiting service worker and reload
    const activateAndReload = (worker: ServiceWorker) => {
      console.log('[Update] Auto-activating new version...');
      worker.postMessage({ type: 'SKIP_WAITING' });
      
      // Reload after a short delay
      setTimeout(() => {
        console.log('[Update] Reloading to apply update');
        window.location.reload();
      }, 500);
    };

    // Get current registration and check for updates
    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg) return;

      // Check immediately for waiting worker
      if (reg.waiting) {
        console.log('[Update] Found waiting service worker, auto-updating...');
        activateAndReload(reg.waiting);
      }

      // Listen for new service worker installing
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        console.log('[Update] New service worker found, state:', newWorker?.state);

        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            console.log('[Update] Service worker state changed to:', newWorker.state);
            
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is installed, auto-update immediately
              console.log('[Update] New version installed, auto-updating...');
              activateAndReload(newWorker);
            }
          });
        }
      });
    });

    // Listen for messages from service worker
    const messageHandler = (event: MessageEvent) => {
      if (event.data && event.data.type === 'RELOAD_PAGE') {
        console.log('[Update] Received reload message from service worker');
        window.location.reload();
      }
    };
    navigator.serviceWorker.addEventListener('message', messageHandler);

    // Check for updates every 60 seconds
    const interval = setInterval(() => {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) {
          console.log('[Update] Checking for updates...');
          reg.update();
        }
      });
    }, 60000);

    return () => {
      clearInterval(interval);
      navigator.serviceWorker.removeEventListener('message', messageHandler);
    };
  }, []);

  // No UI - updates happen automatically
  return null;
};
