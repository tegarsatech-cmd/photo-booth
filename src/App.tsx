import React, { useState, useEffect } from 'react';
import { Camera, LogOut, Database, User, Sparkles, Layers } from 'lucide-react';
import Studio from './components/Studio';
import GallerySidebar from './components/GallerySidebar';
import { CapturedPhoto } from './types';

export default function App() {
  // Captured Photos History Local Storage Sync
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [storageLimitReached, setStorageLimitReached] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem('photobooth_gallery');
    if (saved) {
      try {
        setPhotos(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse localStorage photos:', e);
      }
    }
  }, []);

  const savePhotosList = (newPhotos: CapturedPhoto[]) => {
    setPhotos(newPhotos);
    try {
      localStorage.setItem('photobooth_gallery', JSON.stringify(newPhotos));
      setStorageLimitReached(false);
    } catch (e) {
      console.warn('Storage quota exceeded, attempting to prune older entries in background storage...', e);
      setStorageLimitReached(true);
      
      // Attempt to save a pruned list to localStorage, keeping only the most recent photos
      let prunedPhotos = [...newPhotos];
      let success = false;
      while (prunedPhotos.length > 0 && !success) {
        prunedPhotos.pop(); // Remove oldest photo
        try {
          localStorage.setItem('photobooth_gallery', JSON.stringify(prunedPhotos));
          success = true;
        } catch (err) {
          // Continue pruning
        }
      }
    }
  };

  const handlePhotoSaved = (newPhoto: CapturedPhoto) => {
    const updated = [newPhoto, ...photos];
    savePhotosList(updated);
  };

  const handleDeletePhoto = (id: string) => {
    const updated = photos.filter(p => p.id !== id);
    savePhotosList(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-indigo-500/10">
      
      {/* Top Banner Navigation */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-pulse">📸</span>
            <div>
              <h1 className="text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Photobooth Studio Live
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">Capture & Customize Your Perfect Memories</p>
            </div>
          </div>

          {/* Right Action Profile */}
          <div className="flex items-center gap-3.5">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Sesi Aktif</p>
              <p className="text-xs font-bold text-slate-700">@fotografer_booth</p>
            </div>
          </div>

        </div>
      </header>

      {/* Main Content Pane */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col justify-center">
        
        {storageLimitReached && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start gap-3 shadow-sm animate-fade-in">
            <span className="text-lg">⚠️</span>
            <div className="flex-1">
              <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider">Memori Browser Penuh</h3>
              <p className="text-xs text-amber-700/90 mt-1 leading-relaxed">
                Browser Anda telah mencapai batas penyimpanan maksimal (Quota Exceeded). Beberapa foto lama di riwayat galeri Anda hanya disimpan sementara untuk sesi aktif ini dan tidak akan tersimpan setelah tab ditutup. Silakan unduh foto penting Anda sekarang!
              </p>
            </div>
            <button 
              onClick={() => setStorageLimitReached(false)} 
              className="text-amber-500 hover:text-amber-700 text-xs font-bold px-1 transition"
              title="Tutup pesan"
            >
              ✕
            </button>
          </div>
        )}

        {/* Core Studio Workspace Grid */}
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column (8/12): Core Camera Studio */}
            <div className="lg:col-span-8">
              <Studio 
                onPhotoSaved={handlePhotoSaved} 
                savedPhotosCount={photos.length}
              />
            </div>

            {/* Right Column (4/12): Saved Gallery History */}
            <div className="lg:col-span-4">
              <GallerySidebar 
                photos={photos} 
                onDeletePhoto={handleDeletePhoto}
              />
            </div>

          </div>
        </div>

      </main>

      {/* Styled Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            Photobooth Studio &copy; 2026. Semua hak cipta dilindungi.
          </p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
              <span className="font-semibold text-[10px] text-slate-500 uppercase tracking-wider">Aplikasi Studio Aktif</span>
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
