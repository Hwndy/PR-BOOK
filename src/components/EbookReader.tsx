import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Lock, 
  AlertTriangle, 
  Clock, 
  Shield, 
  Eye,
  EyeOff,
  RefreshCw,
  Home
} from 'lucide-react';

interface AccessValidation {
  success: boolean;
  sessionId?: string;
  email?: string;
  expiresAt?: number;
  error?: string;
  code?: string;
}

const EbookReader: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [accessValidated, setAccessValidated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<number>(0);
  const [sessionActive, setSessionActive] = useState(true);
  const [showProtectionInfo, setShowProtectionInfo] = useState(false);
  const heartbeatRef = useRef<NodeJS.Timeout>();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (token) {
      validateAccess();
    } else {
      setError('Invalid reading link');
      setLoading(false);
    }

    return () => {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
      }
    };
  }, [token]);

  const validateAccess = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ebook/validate-access/${token}`);
      const data: AccessValidation = await response.json();

      if (data.success) {
        setAccessValidated(true);
        setUserEmail(data.email || '');
        setExpiresAt(data.expiresAt || 0);
        startHeartbeat();
      } else {
        setError(getErrorMessage(data.error, data.code));
      }
    } catch (err) {
      console.error('Access validation failed:', err);
      setError('Failed to validate access. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (error?: string, code?: string) => {
    switch (code) {
      case 'SHARING_DETECTED':
        return 'This link has been shared and is no longer valid. Each reading link is personal and can only be used on the original device.';
      case 'CONCURRENT_SESSION':
        return 'This book is already being read on another device. Please close other sessions and try again.';
      case 'TOKEN_EXPIRED':
        return 'This reading link has expired. Please contact support for a new link.';
      case 'INVALID_TOKEN':
        return 'This reading link is invalid or has been revoked.';
      default:
        return error || 'Access denied. Please check your reading link.';
    }
  };

  const startHeartbeat = () => {
    // Send heartbeat every 30 seconds to maintain session
    heartbeatRef.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/ebook/heartbeat/${token}`, {
          method: 'POST'
        });
        
        if (!response.ok) {
          setSessionActive(false);
          setError('Your reading session has expired. Please refresh the page.');
          clearInterval(heartbeatRef.current!);
        }
      } catch (err) {
        console.error('Heartbeat failed:', err);
        setSessionActive(false);
      }
    }, 30000);
  };

  const formatTimeRemaining = () => {
    if (!expiresAt) return '';
    
    const remaining = expiresAt - Date.now();
    if (remaining <= 0) return 'Expired';
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  // Prevent right-click and other interactions
  useEffect(() => {
    const preventContextMenu = (e: MouseEvent) => e.preventDefault();
    const preventKeyboardShortcuts = (e: KeyboardEvent) => {
      // Prevent common shortcuts for copying, saving, printing
      if (
        (e.ctrlKey || e.metaKey) && 
        ['s', 'a', 'c', 'v', 'p', 'u', 'i'].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
      }
      // Prevent F12, F5
      if (['F12', 'F5'].includes(e.key)) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('keydown', preventKeyboardShortcuts);

    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('keydown', preventKeyboardShortcuts);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Validating Access</h2>
          <p className="text-gray-600">Please wait while we verify your reading permissions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={handleRefresh}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
            <button
              onClick={handleGoHome}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!accessValidated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Access Validation Required</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Shield className="h-6 w-6 text-blue-600" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">The Science of Public Relations</h1>
              <p className="text-sm text-gray-600">Secure Reading - {userEmail}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              {formatTimeRemaining()}
            </div>
            
            <button
              onClick={() => setShowProtectionInfo(!showProtectionInfo)}
              className="flex items-center text-sm text-blue-600 hover:text-blue-700"
            >
              {showProtectionInfo ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
              Protection Info
            </button>
            
            <button
              onClick={handleGoHome}
              className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-300 transition-colors"
            >
              Exit
            </button>
          </div>
        </div>
        
        {/* Protection Info Panel */}
        {showProtectionInfo && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Reading Protection Active</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• This link is personal and tied to your device</li>
              <li>• Sharing this link will invalidate it for security</li>
              <li>• Session expires automatically for protection</li>
              <li>• Content cannot be downloaded or copied</li>
              <li>• Only one active reading session allowed</li>
            </ul>
          </div>
        )}
        
        {/* Session Warning */}
        {!sessionActive && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-800 font-medium">Session Expired</span>
            </div>
            <p className="text-red-700 text-sm mt-1">Your reading session has expired. Please refresh to continue.</p>
          </div>
        )}
      </header>

      {/* PDF Viewer */}
      <main className="flex-1 p-4">
        <div className="max-w-4xl mx-auto h-full">
          <div className="bg-white rounded-lg shadow-lg h-full">
            <iframe
              ref={iframeRef}
              src={`/api/ebook/content/${token}`}
              className="w-full h-full rounded-lg"
              title="The Science of Public Relations"
              style={{ minHeight: '80vh' }}
              onLoad={() => {
                // Additional security: disable right-click in iframe
                if (iframeRef.current?.contentDocument) {
                  iframeRef.current.contentDocument.addEventListener('contextmenu', (e) => e.preventDefault());
                }
              }}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-600">
          <p>© 2024 The Science of Public Relations. All rights reserved. | Secure Reading Session</p>
        </div>
      </footer>
    </div>
  );
};

export default EbookReader;
