import React, { useState, useEffect } from 'react';

export const UpdateNotification: React.FC = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    // Check if service worker is supported
    if (!('serviceWorker' in navigator)) {
      return;
    }

    // Function to check for waiting service worker
    const checkForWaitingWorker = (reg: ServiceWorkerRegistration) => {
      if (reg.waiting) {
        console.log('[Update] Found waiting service worker');
        setWaitingWorker(reg.waiting);
        setShowUpdate(true);
      }
    };

    // Get current registration and check for updates
    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg) return;

      // Check immediately
      checkForWaitingWorker(reg);

      // Listen for new service worker installing
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        console.log('[Update] New service worker found, state:', newWorker?.state);

        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            console.log('[Update] Service worker state changed to:', newWorker.state);
            
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is installed and there's an active controller
              console.log('[Update] New version ready to activate');
              setWaitingWorker(newWorker);
              setShowUpdate(true);
            }
          });
        }
      });
    });

    // Listen for controller change (when new SW takes over)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[Update] Controller changed, new service worker active');
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

  const handleUpdate = () => {
    if (!waitingWorker) {
      console.warn('[Update] No waiting worker found');
      return;
    }

    console.log('[Update] Activating new service worker');
    
    // Send skip waiting message to the waiting service worker
    waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    
    // Hide the notification
    setShowUpdate(false);
    
    // The service worker will send a RELOAD_PAGE message when ready
    // If it doesn't work, fallback to reload after 1 second
    setTimeout(() => {
      console.log('[Update] Fallback reload');
      window.location.reload();
    }, 1000);
  };

  const handleDismiss = () => {
    console.log('[Update] User dismissed update notification');
    setShowUpdate(false);
    // Don't set waitingWorker to null - keep it so we can update later
  };

  if (!showUpdate) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg 
              className="w-6 h-6 text-[#E87968]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Update Available
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              A new version of WellRead is available. Tap "Update Now" to get the latest features.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-[#E87968] text-white text-sm font-medium rounded-lg hover:bg-[#D96858] transition-colors active:scale-95"
              >
                Update Now
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors active:scale-95"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
