import React, { useState, useEffect } from 'react';
import { Smartphone, Chrome, Globe, Download, Book, CheckCircle } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Detection utilities
const isStandalone = () => {
  // Check if running in standalone mode (actually installed as PWA)
  const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
  
  // Check iOS standalone
  const isIOSStandalone = (window.navigator as any).standalone;
  
  // Check for Android app referrer
  const hasAndroidAppReferrer = document.referrer.includes('android-app://');
  
  // Check for PWA source parameter
  const hasPWASource = window.location.search.includes('source=pwa');
  
  // Only return true if actually in standalone mode, not just on desktop
  return isStandaloneMode || isIOSStandalone || hasAndroidAppReferrer || hasPWASource;
};

const getPlatform = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/iphone|ipad|ipod/.test(userAgent)) {
    if (/chrome/.test(userAgent)) {
      return 'ios-chrome';
    } else if (/safari/.test(userAgent) || /webkit/.test(userAgent)) {
      return 'ios-safari';
    }
    return 'ios';
  } else if (/android/.test(userAgent)) {
    if (/chrome/.test(userAgent)) {
      return 'android-chrome';
    } else if (/firefox/.test(userAgent)) {
      return 'android-firefox';
    }
    return 'android';
  } else if (/macintosh|windows|linux/.test(userAgent)) {
    // Desktop detection
    if (/chrome/.test(userAgent) && !/edge/.test(userAgent)) {
      return 'desktop-chrome';
    } else if (/edge/.test(userAgent)) {
      return 'desktop-edge';
    } else if (/firefox/.test(userAgent)) {
      return 'desktop-firefox';
    } else if (/safari/.test(userAgent)) {
      return 'desktop-safari';
    }
    return 'desktop';
  } else if (/chrome/.test(userAgent)) {
    return 'chrome';
  } else if (/firefox/.test(userAgent)) {
    return 'firefox';
  } else if (/edge/.test(userAgent)) {
    return 'edge';
  } else if (/safari/.test(userAgent)) {
    return 'safari';
  }
  return 'other';
};

interface InstallInstructionsProps {
  platform: string;
  onInstallPrompt?: () => void;
  canUseInstallPrompt?: boolean;
}

const InstallInstructions: React.FC<InstallInstructionsProps> = ({ 
  platform, 
  onInstallPrompt, 
  canUseInstallPrompt 
}) => {
  const renderInstructions = () => {
    switch (platform) {
      case 'ios-safari':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
              <Globe className="text-blue-600" size={24} />
              <div>
                <h4 className="font-semibold text-blue-900">iPhone/iPad</h4>
                <p className="text-sm text-blue-700">Install WellRead on your device</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#E87968] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                <div>
                  <p className="font-medium text-[#333333]">Tap the Share button</p>
                  <p className="text-sm text-gray-600">Square with an arrow pointing up</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#E87968] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                <div>
                  <p className="font-medium text-[#333333]">Scroll down and find "Add to Home Screen"</p>
                  <p className="text-sm text-gray-600">It appears with a "+" icon in the share menu</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#E87968] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                <div>
                  <p className="font-medium text-[#333333]">Tap "Add" to confirm</p>
                  <p className="text-sm text-gray-600">WellRead will be added to your home screen</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'ios-chrome':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl">
              <Chrome className="text-orange-600" size={24} />
              <div>
                <h4 className="font-semibold text-orange-900">iPhone/iPad</h4>
                <p className="text-sm text-orange-700">Install WellRead on your device</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#E87968] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                <div>
                  <p className="font-medium text-[#333333]">Tap the Share button</p>
                  <p className="text-sm text-gray-600">Square with an arrow pointing up</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#E87968] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                <div>
                  <p className="font-medium text-[#333333]">Look for "Add to Home Screen"</p>
                  <p className="text-sm text-gray-600">Scroll down in the share menu to find this option</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#E87968] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                <div>
                  <p className="font-medium text-[#333333]">Tap "Add" to install</p>
                  <p className="text-sm text-gray-600">The app will appear on your home screen</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'ios':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
              <Smartphone className="text-blue-600" size={24} />
              <div>
                <h4 className="font-semibold text-blue-900">iPhone/iPad</h4>
                <p className="text-sm text-blue-700">Install WellRead on your device</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <h5 className="font-semibold text-[#333333] mb-2">📱 Installation Steps:</h5>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>1. Tap the Share button (⬆️)</p>
                  <p>2. Find "Add to Home Screen"</p>
                  <p>3. Tap "Add" to install</p>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'android-chrome':
        return (
          <div className="space-y-4">
            {canUseInstallPrompt && (
              <button
                onClick={onInstallPrompt}
                className="w-full bg-gradient-to-r from-[#F7B8A1] to-[#E87968] text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg"
              >
                <Download size={20} />
                Install App Now
              </button>
            )}
            
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
              <Chrome className="text-green-600" size={24} />
              <div>
                <h4 className="font-semibold text-green-900">Android Device</h4>
                <p className="text-sm text-green-700">Install WellRead on your device</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#E87968] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                <div>
                  <p className="font-medium text-[#333333]">Look for the install banner</p>
                  <p className="text-sm text-gray-600">Chrome may show an automatic "Install" banner at the bottom</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#E87968] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                <div>
                  <p className="font-medium text-[#333333]">Or tap the menu (⋮)</p>
                  <p className="text-sm text-gray-600">Three dots in the top-right corner → "Add to Home screen"</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#E87968] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                <div>
                  <p className="font-medium text-[#333333]">Tap "Install" or "Add"</p>
                  <p className="text-sm text-gray-600">Confirm to add WellRead to your home screen</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'android':
        return (
          <div className="space-y-4">
            {canUseInstallPrompt && (
              <button
                onClick={onInstallPrompt}
                className="w-full bg-gradient-to-r from-[#F7B8A1] to-[#E87968] text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg"
              >
                <Download size={20} />
                Install App Now
              </button>
            )}
            
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
              <Smartphone className="text-green-600" size={24} />
              <div>
                <h4 className="font-semibold text-green-900">Android Device</h4>
                <p className="text-sm text-green-700">Install WellRead on your device</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <h5 className="font-semibold text-[#333333] mb-2">🌐 Installation Steps:</h5>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>1. Look for install banner or tap menu (⋮)</p>
                  <p>2. Select "Add to Home screen" or "Install"</p>
                  <p>3. Confirm installation</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'desktop-chrome':
      case 'desktop-edge':
        return (
          <div className="space-y-4">
            {canUseInstallPrompt && (
              <button
                onClick={onInstallPrompt}
                className="w-full bg-gradient-to-r from-[#F7B8A1] to-[#E87968] text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg"
              >
                <Download size={20} />
                Install App Now
              </button>
            )}
            
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
              <Chrome className="text-purple-600" size={24} />
              <div>
                <h4 className="font-semibold text-purple-900">Desktop</h4>
                <p className="text-sm text-purple-700">Install WellRead on your computer</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#E87968] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                <div>
                  <p className="font-medium text-[#333333]">Look for the install icon in address bar</p>
                  <p className="text-sm text-gray-600">Usually appears as a computer or download icon</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#E87968] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                <div>
                  <p className="font-medium text-[#333333]">Click the install button</p>
                  <p className="text-sm text-gray-600">Or check browser menu for "Install WellRead" option</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#E87968] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                <div>
                  <p className="font-medium text-[#333333]">Confirm installation</p>
                  <p className="text-sm text-gray-600">WellRead will be added as a desktop app</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'desktop':
        return (
          <div className="space-y-4">
            {canUseInstallPrompt && (
              <button
                onClick={onInstallPrompt}
                className="w-full bg-gradient-to-r from-[#F7B8A1] to-[#E87968] text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg"
              >
                <Download size={20} />
                Install App Now
              </button>
            )}
            
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Smartphone className="text-gray-600" size={24} />
              <div>
                <h4 className="font-semibold text-gray-900">Desktop</h4>
                <p className="text-sm text-gray-700">Install WellRead on your computer</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#E87968] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                <div>
                  <p className="font-medium text-[#333333]">Look for install icon</p>
                  <p className="text-sm text-gray-600">Check address bar or browser menu</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#E87968] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                <div>
                  <p className="font-medium text-[#333333]">Click to install</p>
                  <p className="text-sm text-gray-600">Follow your browser's prompts</p>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="space-y-4">
            {canUseInstallPrompt && (
              <button
                onClick={onInstallPrompt}
                className="w-full bg-gradient-to-r from-[#F7B8A1] to-[#E87968] text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg"
              >
                <Download size={20} />
                Install App Now
              </button>
            )}
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <h5 className="font-semibold text-[#333333] mb-2">📱 Mobile Devices:</h5>
                <div className="text-sm text-gray-600 space-y-2">
                  <p><strong>iPhone/iPad:</strong> Share button → "Add to Home Screen"</p>
                  <p><strong>Android:</strong> Browser menu → "Add to Home screen" or look for install banner</p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <h5 className="font-semibold text-[#333333] mb-2">💻 Desktop:</h5>
                <div className="text-sm text-gray-600">
                  <p>Look for the install button in your browser's address bar, or check the browser menu for "Install" options.</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-[#333333] mb-4 flex items-center gap-2">
        <Smartphone className="text-[#E87968]" size={20} />
        Installation Instructions
      </h3>
      {renderInstructions()}
    </div>
  );
};

const PWAInstallationGate: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isCheckingInstallation, setIsCheckingInstallation] = useState(true);
  const [platform] = useState(getPlatform());

  useEffect(() => {
    // Check if already installed
    if (isStandalone()) {
      // App is installed, don't show the gate
      return;
    }

    // Prevent back navigation to bypass installation
    const preventNavigation = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, '', window.location.pathname);
      return false;
    };

    // Add history entry to prevent back navigation
    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', preventNavigation);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check installation status after a short delay
    setTimeout(() => {
      setIsCheckingInstallation(false);
    }, 1000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('popstate', preventNavigation);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      // The app should reload as standalone after installation
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
  };

  // Don't show the gate if already installed
  if (isStandalone()) {
    return null;
  }

  if (isCheckingInstallation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FCF8F5] to-[#F7B8A1] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#E87968] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#333333] font-medium">Checking installation status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FCF8F5] to-[#F7B8A1] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#F7B8A1] to-[#E87968] rounded-2xl flex items-center justify-center shadow-lg">
            <Book size={40} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#333333] mb-2">Install WellRead</h1>
            <p className="text-gray-600 text-lg">
              To ensure the best reading experience, please install our app on your device.
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-[#333333] mb-4 flex items-center gap-2">
            <CheckCircle className="text-green-500" size={20} />
            Why Install?
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#E87968] flex-shrink-0 mt-2"></div>
              <p><strong>Faster Performance:</strong> Instant loading and smooth navigation</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#E87968] flex-shrink-0 mt-2"></div>
              <p><strong>Offline Reading:</strong> Access your books even without internet</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#E87968] flex-shrink-0 mt-2"></div>
              <p><strong>Native Experience:</strong> Full-screen reading without browser distractions</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#E87968] flex-shrink-0 mt-2"></div>
              <p><strong>Quick Access:</strong> Launch directly from your home screen</p>
            </div>
          </div>
        </div>

        {/* Installation Instructions */}
        <InstallInstructions 
          platform={platform} 
          onInstallPrompt={handleInstallClick}
          canUseInstallPrompt={!!deferredPrompt}
        />

        {/* Refresh Button */}
        <div className="text-center pt-4">
          <p className="text-sm text-gray-600 mb-4">
            Already installed? The page should reload automatically.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-[#E87968] font-semibold text-sm underline"
          >
            Refresh Page
          </button>
          
          {/* Development bypass - only in development */}
          {process.env.NODE_ENV === 'development' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Development Mode</p>
              <button
                onClick={() => {
                  const url = new URL(window.location.href);
                  url.searchParams.set('bypass', 'true');
                  window.location.href = url.toString();
                }}
                className="text-xs text-gray-400 underline"
              >
                Bypass Installation (Dev Only)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PWAInstallationGate;