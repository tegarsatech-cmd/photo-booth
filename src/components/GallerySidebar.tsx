import React, { useState } from 'react';
import { Image, Calendar, Download, Trash, X } from 'lucide-react';
import { CapturedPhoto } from '../types';

interface GallerySidebarProps {
  photos: CapturedPhoto[];
  onDeletePhoto: (id: string) => void;
}

export default function GallerySidebar({ photos, onDeletePhoto }: GallerySidebarProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<CapturedPhoto | null>(null);

  const downloadImage = (photo: CapturedPhoto) => {
    const link = document.createElement('a');
    link.download = `photobooth_captured_${photo.id}.png`;
    link.href = photo.imagePath;
    link.click();
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex-1 flex flex-col min-h-[400px]">
      
      {/* Sidebar Header with Counter */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <Image className="w-4 h-4 text-indigo-500" />
          <span>Riwayat Galeri Anda</span>
        </h3>
        <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 rounded-full text-slate-500">
          {photos.length} Foto
        </span>
      </div>

      {/* Empty State */}
      {photos.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <span className="text-4xl mb-2">✨</span>
          <p className="font-semibold text-slate-600 text-sm">Belum Ada Foto Disimpan</p>
          <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
            Ambil foto pertamamu menggunakan kamera di samping, hiasi dengan bingkai, lalu simpan ke galeri!
          </p>
        </div>
      ) : (
        /* Photos Grid Layout */
        <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[480px] pr-1">
          {photos.map((p) => (
            <div 
              key={p.id}
              onClick={() => setSelectedPhoto(p)}
              className="group aspect-square rounded-xl overflow-hidden bg-slate-100 relative border border-slate-200 shadow-sm transition hover:shadow-md cursor-pointer"
            >
              <img 
                src={p.imagePath} 
                alt="Photobooth Snap" 
                className="w-full h-full object-cover transform transition duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-200 p-2.5 flex items-end">
                <p className="text-[10px] text-white font-medium truncate w-full flex items-center gap-1">
                  <Calendar className="w-3 h-3 shrink-0" />
                  <span>{p.createdAt.split(',')[0]}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail View modal/overlay */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden transform scale-100 transition-all">
            
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" />
                <span>Diambil: {selectedPhoto.createdAt}</span>
              </span>
              <button 
                onClick={() => setSelectedPhoto(null)} 
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center text-xs transition"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-100/50 flex items-center justify-center border-b border-slate-100">
              <img 
                src={selectedPhoto.imagePath} 
                alt="Detail captured" 
                className="max-w-full max-h-[400px] object-contain rounded-xl shadow-md border border-slate-200"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-4 flex gap-3">
              <button
                onClick={() => downloadImage(selectedPhoto)}
                className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs text-center transition flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Foto</span>
              </button>
              
              <button
                onClick={() => {
                  onDeletePhoto(selectedPhoto.id);
                  setSelectedPhoto(null);
                }}
                className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition"
                title="Hapus dari Galeri"
              >
                <Trash className="w-4 h-4" />
              </button>

              <button 
                onClick={() => setSelectedPhoto(null)} 
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition text-center"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
