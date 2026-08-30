import React, { useRef, useState, useEffect } from 'react';
import { Camera, RotateCcw, Download, Save, X, Sparkles, Check, Upload, Image as ImageIcon, Laptop } from 'lucide-react';
import { PhotoFilter, PhotoFrame, CapturedPhoto, PlacedSticker } from '../types';

interface StudioProps {
  onPhotoSaved: (newPhoto: CapturedPhoto) => void;
  savedPhotosCount: number;
}

interface ExtendedPhotoFilter extends PhotoFilter {
  category: 'all' | 'beautify' | 'aesthetic' | 'fun' | 'normal';
  description?: string;
}

const filters: ExtendedPhotoFilter[] = [
  { id: 'normal', name: 'Normal', cssFilter: 'none', category: 'normal', description: 'Tanpa filter tambahan' },
  
  // Beautify
  { id: 'snow_white', name: 'Snow White Glow', cssFilter: 'none', category: 'beautify', description: 'Pencerah kulit wajah merata' },
  { id: 'porcelain', name: 'Porcelain Skin', cssFilter: 'none', category: 'beautify', description: 'Efek kulit bersih porselen' },
  { id: 'rosy_white', name: 'Rosy White', cssFilter: 'none', category: 'beautify', description: 'Mencerahkan kulit merona pinkish' },
  { id: 'ivory_elegance', name: 'Ivory Elegance', cssFilter: 'none', category: 'beautify', description: 'Putih gading mewah & alami' },
  { id: 'undereye_corrector', name: 'Under-Eye Corrector', cssFilter: 'none', category: 'beautify', description: 'Menyamarkan lingkar hitam mata' },
  { id: 'ultra_smooth', name: 'Ultra Smooth', cssFilter: 'none', category: 'beautify', description: 'Kulit mulus tanpa cela' },
  { id: 'glass_skin', name: 'Glass Skin', cssFilter: 'none', category: 'beautify', description: 'Dewy glowing lembap ala Korea' },
  { id: 'silk_satin', name: 'Silk & Satin', cssFilter: 'none', category: 'beautify', description: 'Melembutkan bayangan keras wajah' },
  { id: 'soft_glam', name: 'Soft Glam & Lip Tint', cssFilter: 'none', category: 'beautify', description: 'Wajah cerah + polesan bibir merona' },
  { id: 'cute_freckles', name: 'Cute Freckles & Blush', cssFilter: 'none', category: 'beautify', description: 'Rona pipi & bintik manis' },

  // Aesthetic
  { id: 'sunset_glow', name: 'Sunset Glow', cssFilter: 'none', category: 'aesthetic', description: 'Warm tone jam golden hour' },
  { id: 'cyber_neon', name: 'Cyber Neon / Y2K', cssFilter: 'none', category: 'aesthetic', description: 'Ungu & magenta kontras tinggi' },
  { id: 'warm_latte', name: 'Warm Latte', cssFilter: 'none', category: 'aesthetic', description: 'Tone pastel cokelat lembut' },
  { id: 'retro_film', name: 'Retro Film / VHS', cssFilter: 'none', category: 'aesthetic', description: 'Kamera analog 90-an & bintik grain' },
  { id: 'moody_cold', name: 'Moody Cold', cssFilter: 'none', category: 'aesthetic', description: 'Tone biru dingin & tenang' },

  // Fun Effects
  { id: 'big_head', name: 'Big Head / Bubble', cssFilter: 'none', category: 'fun', description: 'Kepala membesar cermin cembung' },
  { id: 'fish_eye', name: 'Fish-Eye Lens', cssFilter: 'none', category: 'fun', description: 'Lensa cembung melingkar' },
  { id: 'rgb_glitch', name: 'RGB Glitch', cssFilter: 'none', category: 'fun', description: 'Glitch pergeseran warna merah-biru' },
  { id: 'pixel_art', name: 'Pixel Art 8-Bit', cssFilter: 'none', category: 'fun', description: 'Resolusi game retro' },
  { id: 'invert_alien', name: 'Invert / Alien', cssFilter: 'none', category: 'fun', description: 'Efek klise negatif' },
  { id: 'thermal_camera', name: 'Thermal Camera', cssFilter: 'none', category: 'fun', description: 'Suhu tubuh inframerah' }
];

const frames: PhotoFrame[] = [
  { id: 'polaroid_classic', name: 'Polaroid Klasik', category: 'Polaroid', desc: 'Area teks tulis tangan retro di bagian bawah' },
  { id: 'retro_y2k', name: 'Retro Neon Y2K', category: 'Retro / Neon', desc: 'Gradasi ungu-pink neon dengan corak bintang' },
  { id: 'elegant_gold', name: 'Minimalis Gold', category: 'Elegant', desc: 'Garis tipis emas bersih berkelas' },
  { id: 'floral_vibe', name: 'Aesthetic Floral', category: 'Decorative', desc: 'Daun ranting hijau estetik & natural' },
  { id: 'birthday_party', name: 'Tematik Birthday', category: 'Celebration', desc: 'Konfeti warna-warni & kue pesta' },
  { id: 'cyberpunk_sys', name: 'Cyberpunk Grid', category: 'Sci-Fi', desc: 'HUD fiksi ilmiah dengan warna hijau komputer' },
  { id: 'pastel_kawaii', name: 'Pastel Cute', category: 'Kawaii', desc: 'Bintang kuning pastel & awan awan putih imut' },
  { id: 'vintage_newspaper', name: 'Vintage News', category: 'Vintage', desc: 'Koran klasik dengan header Daily News jadul' },
  { id: 'sakura_blossom', name: 'Sakura Blossom', category: 'Romantic', desc: 'Kelopak bunga sakura merah muda berguguran' },
  { id: 'disco_night', name: 'Disco Stars', category: 'Fun / Party', desc: 'Sorotan lampu neon gemerlap musik malam' },
  { id: 'comic_pop', name: 'Comic Pop', category: 'Artistic', desc: 'Latar pola titik pop-art dengan balon komik' },
  { id: 'underwater_marine', name: 'Ocean Deep', category: 'Marine', desc: 'Dekorasi bawah laut dengan gelembung air & karang' },
  { id: 'holiday_winter', name: 'Holiday Winter', category: 'Winter', desc: 'Gumpalan salju beku & kristal es yang dingin' },
  { id: 'multiplex_strip', name: '3-Photo Strip', category: 'Multiplex', desc: 'Sprocket film vertikal 3 jepretan horizontal' },
  { id: 'four_cut_strip', name: '4-Cut Photostrip', category: 'Multiplex', desc: 'Latar film strip klasik dengan 4 jepretan vertikal' }
];

const layouts = [
  { id: 'single', name: 'Polaroid Single', slots: 1, desc: 'Satu foto polaroid klasik' },
  { id: '4_cut_strip', name: '4-Cut Photostrip', slots: 4, desc: '4 foto berderet vertikal ala Korea' },
  { id: '2x2_grid', name: '2x2 Photo Grid', slots: 4, desc: 'Layout kotak 4 foto (2 baris x 2 kolom)' },
  { id: '5_photo_combo', name: '5-Photo Combo', slots: 5, desc: '1 foto utama besar + 4 foto kecil pendukung' }
];

const frameColors = [
  { id: 'white', bg: '#ffffff', border: '#e2e8f0', text: '#1e293b', name: 'Putih Bersih' },
  { id: 'black', bg: '#1c1917', border: '#2e2a24', text: '#f5f5f4', name: 'Hitam Klasik' },
  { id: 'pastel_pink', bg: '#ffe5ec', border: '#ffb3c1', text: '#ff758f', name: 'Pastel Pink' },
  { id: 'cream', bg: '#fbfbf9', border: '#e2dcd5', text: '#5f6f52', name: 'Cream Vintage' }
];

type BackdropType = 'sunset' | 'cyberpunk' | 'aurorapastel' | 'disco' | 'custom';

export default function Studio({ onPhotoSaved, savedPhotosCount }: StudioProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const resultCanvasRef = useRef<HTMLCanvasElement>(null);
  const virtualCanvasRef = useRef<HTMLCanvasElement>(null);
  const isCapturingCleanRef = useRef<boolean>(false);
  
  // Camera & Mode States
  const [isVirtual, setIsVirtual] = useState<boolean>(true); // Default to true as standard fallback in restricted iframe
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'physical' | 'virtual'>('virtual');

  // Virtual Camera Backdrop States
  const [virtualBackdrop, setVirtualBackdrop] = useState<BackdropType>('sunset');
  const [customImageSrc, setCustomImageSrc] = useState<string | null>(null);
  const [customImageObj, setCustomImageObj] = useState<HTMLImageElement | null>(null);

  // Styling Customizer States
  const [selectedFilter, setSelectedFilter] = useState<string>('normal');
  const [selectedFrame, setSelectedFrame] = useState<string>('polaroid_classic');
  const [activeFilterCategory, setActiveFilterCategory] = useState<'all' | 'beautify' | 'aesthetic' | 'fun'>('all');
  const [selectedLayout, setSelectedLayout] = useState<'single' | '4_cut_strip' | '2x2_grid' | '5_photo_combo'>('single');
  const [selectedFrameColor, setSelectedFrameColor] = useState<string>('white');
  const [customBottomText, setCustomBottomText] = useState<string>('');
  const [printDate, setPrintDate] = useState<boolean>(true);

  // Multi-Photo Capture Progress States
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [activeSlotIndex, setActiveSlotIndex] = useState<number>(0);
  const [capturedSlots, setCapturedSlots] = useState<string[]>([]);
  const [reviewingPhoto, setReviewingPhoto] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  
  // Results Overlay States
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [showFlash, setShowFlash] = useState<boolean>(false);

  const triggerFlash = () => {
    playShutterClickSound();
    setShowFlash(true);
    setTimeout(() => {
      setShowFlash(false);
    }, 150);
  };

  const animationFrameId = useRef<number | null>(null);

  // Share / QR Code States
  const [shareUrl, setShareUrl] = useState<string>('');
  const [isUploadingShare, setIsUploadingShare] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Sticker & Decoration interactive states
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([]);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  
  const stickerTemplates = [
    '✨', '💖', '❤️', '🔥', '🌸', '🦖', '⭐', '🎈', '🎉', '🌟', 
    '🧸', '👑', '🕶️', '🐱', '🦋', '🍀', '🌈', '🍕', '🍩', '📸',
    '🎨', '👾', '🍦', '🍒', '🌻', '🐾', '🎀', '💌', '✌️', '👑'
  ];

  // Play Dynamic Camera Shutter Click Sound Synthesizer via Web Audio API
  const playShutterClickSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // 1. White noise for the physical shutter spring
      const bufferSize = audioCtx.sampleRate * 0.12; // 120ms
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noiseNode = audioCtx.createBufferSource();
      noiseNode.buffer = buffer;
      
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1000;
      
      const gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      
      noiseNode.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      // 2. High metallic click oscillator
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, audioCtx.currentTime + 0.08);
      
      oscGain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
      
      osc.connect(oscGain);
      oscGain.connect(audioCtx.destination);
      
      noiseNode.start();
      osc.start();
      
      noiseNode.stop(audioCtx.currentTime + 0.12);
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (err) {
      console.warn("AudioContext failed or blocked by autoplay restriction:", err);
    }
  };

  // Initialize Physical Webcam Stream
  const initPhysicalCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      let mediaStream: MediaStream;
      try {
        // Ideal resolution configuration with wide range aspect ratios
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user' 
          },
          audio: false
        });
      } catch (innerErr) {
        console.warn("Retrying with broadest possible camera fallbacks...", innerErr);
        // Fallback constraint to ensure it supports virtually all webcams and sandboxed frames
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }
      
      setStream(mediaStream);
      setCameraError(false);
      setIsVirtual(false);
      setActiveTab('physical');
    } catch (err) {
      console.warn("Gagal terhubung ke kamera fisik (biasa terjadi karena pembatasan sandbox iframe): ", err);
      setCameraError(true);
      setIsVirtual(true);
      setActiveTab('virtual');
    }
  };

  // Safe release of camera stream
  const stopPhysicalCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Handle Tab Switch
  const handleTabChange = (tab: 'physical' | 'virtual') => {
    if (tab === 'physical') {
      initPhysicalCamera();
    } else {
      stopPhysicalCamera();
      setIsVirtual(true);
      setActiveTab('virtual');
    }
  };

  useEffect(() => {
    // Attempt physical camera first, fallback gracefully to virtual if blocked
    initPhysicalCamera();
    return () => {
      stopPhysicalCamera();
    };
  }, []);

  // Safe binding of the stream object to the video ref once it renders in the DOM
  useEffect(() => {
    if (videoRef.current && stream && !isVirtual) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(err => {
        console.warn("Autoplay was blocked or prevented by the browser:", err);
      });
    }
  }, [stream, isVirtual]);

  // Handle custom image file uploads
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const base64 = event.target.result as string;
        setCustomImageSrc(base64);
        
        const img = new Image();
        img.onload = () => {
          setCustomImageObj(img);
          setVirtualBackdrop('custom');
        };
        img.src = base64;
      }
    };
    reader.readAsDataURL(file);
  };

  // Run real-time animation loop for the Virtual/Physical Camera Feed Canvas
  // Shared function to render a clean camera/virtual feed with filters but without frames or hud elements
  const drawCleanFeed = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number,
    isVirtMode: boolean,
    vBackdrop: BackdropType,
    customImgObj: HTMLImageElement | null,
    selFilter: string
  ) => {
    ctx.save();
    ctx.clearRect(0, 0, width, height);

    let frameDrawn = false;

    if (!isVirtMode) {
      // Physical webcam mode
      const video = videoRef.current;
      if (video && video.readyState >= 2) {
        // Draw video mirrored
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, width, height);
        ctx.restore();
        ctx.save();
        frameDrawn = true;
      } else {
        // Draw loading camera placeholder
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Menghubungkan ke Kamera...', width / 2, height / 2);
        frameDrawn = true;
      }
    } else {
      // Virtual backdrop mode
      if (vBackdrop === 'custom' && customImgObj) {
        const img = customImgObj;
        const imgRatio = img.width / img.height;
        const canvasRatio = width / height;
        let sw, sh, sx, sy;

        if (imgRatio > canvasRatio) {
          sh = img.height;
          sw = img.height * canvasRatio;
          sx = (img.width - sw) / 2;
          sy = 0;
        } else {
          sw = img.width;
          sh = img.width / canvasRatio;
          sx = 0;
          sy = (img.height - sh) / 2;
        }

        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
        frameDrawn = true;

        // Add animated scan lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const scanY = (Math.sin(time * 0.5) + 1) * 0.5 * height;
        ctx.moveTo(0, scanY);
        ctx.lineTo(width, scanY);
        ctx.stroke();
      } else {
        frameDrawn = true;
        if (vBackdrop === 'sunset') {
          const grad = ctx.createLinearGradient(0, 0, 0, height);
          grad.addColorStop(0, '#1e1b4b');
          grad.addColorStop(0.5, '#4c1d95');
          grad.addColorStop(1, '#db2777');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);

          const sunGrad = ctx.createRadialGradient(width/2, height/2 + 20, 10, width/2, height/2 + 20, 130);
          sunGrad.addColorStop(0, '#fef08a');
          sunGrad.addColorStop(0.6, '#f97316');
          sunGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = sunGrad;
          ctx.beginPath();
          ctx.arc(width/2, height/2 + 20, 130, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)';
          ctx.lineWidth = 2;
          for (let i = 0; i < 4; i++) {
            const waveY = height - 60 + (i * 15);
            ctx.beginPath();
            ctx.moveTo(0, waveY);
            for (let x = 0; x <= width; x += 20) {
              const dy = Math.sin(x * 0.02 + time + i) * 6;
              ctx.lineTo(x, waveY + dy);
            }
            ctx.stroke();
          }
        } else if (vBackdrop === 'cyberpunk') {
          ctx.fillStyle = '#090d16';
          ctx.fillRect(0, 0, width, height);

          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 1;
          const horizonY = height * 0.45;

          for (let y = horizonY; y < height; y += 12) {
            const norm = (y - horizonY) / (height - horizonY);
            const py = horizonY + Math.pow(norm, 1.8) * (height - horizonY);
            ctx.beginPath();
            ctx.moveTo(0, py);
            ctx.lineTo(width, py);
            ctx.stroke();
          }

          for (let x = -100; x <= width + 100; x += 40) {
            ctx.beginPath();
            ctx.moveTo(width / 2, horizonY);
            ctx.lineTo(x, height);
            ctx.stroke();
          }

          ctx.fillStyle = 'rgba(6, 182, 212, 0.35)';
          ctx.beginPath();
          ctx.arc(width/2, height/2 - 20, 50, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillRect(width/2 - 40, height/2 - 20, 80, 90);

          ctx.strokeStyle = '#06b6d4';
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 12;
          ctx.lineWidth = 2;
          ctx.beginPath();
          const scanY = horizonY + (time % 1) * (height - horizonY);
          ctx.moveTo(0, scanY);
          ctx.lineTo(width, scanY);
          ctx.stroke();
          ctx.shadowBlur = 0;
        } else if (vBackdrop === 'aurorapastel') {
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(0, 0, width, height);

          const blobs = [
            { x: width * 0.3 + Math.sin(time) * 40, y: height * 0.4 + Math.cos(time * 0.8) * 30, r: 160, color: '#fbcfe8' },
            { x: width * 0.7 + Math.cos(time * 0.5) * 50, y: height * 0.5 + Math.sin(time * 1.1) * 40, r: 180, color: '#c7d2fe' },
            { x: width * 0.5 + Math.sin(time * 1.3) * 60, y: height * 0.7 + Math.cos(time * 0.6) * 40, r: 150, color: '#bae6fd' }
          ];

          blobs.forEach(b => {
            const rad = ctx.createRadialGradient(b.x, b.y, 5, b.x, b.y, b.r);
            rad.addColorStop(0, b.color);
            rad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = rad;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fill();
          });

          for (let i = 0; i < 6; i++) {
            const sx = (width * 0.15) + (i * 80) % (width - 100);
            const sy = (height * 0.1) + (i * 60 + time * 10) % (height - 100);
            const size = 6 + Math.sin(time + i) * 3;
            ctx.fillStyle = '#fef08a';
            ctx.beginPath();
            ctx.arc(sx, sy, size, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (vBackdrop === 'disco') {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, width, height);

          const colors = ['rgba(168, 85, 247, 0.35)', 'rgba(236, 72, 153, 0.35)', 'rgba(59, 130, 246, 0.35)'];
          for (let i = 0; i < 3; i++) {
            const beamX = width * 0.25 + (i * width * 0.25);
            const swing = Math.sin(time * 0.8 + i) * 100;

            ctx.fillStyle = colors[i % colors.length];
            ctx.beginPath();
            ctx.moveTo(beamX, 0);
            ctx.lineTo(beamX + swing - 60, height);
            ctx.lineTo(beamX + swing + 60, height);
            ctx.closePath();
            ctx.fill();
          }

          ctx.fillStyle = '#ffffff';
          for (let j = 0; j < 12; j++) {
            const px = (j * 57 + time * 15) % width;
            const py = (j * 39 + time * 25) % height;
            const size = Math.abs(Math.sin(time + j)) * 3;
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    if (frameDrawn) {
      applyPixelFilter(ctx, width, height, selFilter, time);
    }

    ctx.restore();
  };

  // Run real-time animation loop for the Virtual/Physical Camera Feed Canvas
  useEffect(() => {
    let active = true;
    const renderFeed = () => {
      if (!active) return;
      const canvas = virtualCanvasRef.current;
      if (!canvas) {
        animationFrameId.current = requestAnimationFrame(renderFeed);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const time = Date.now() * 0.002;

      // Draw clean camera/virtual feed
      drawCleanFeed(ctx, width, height, time, isVirtual, virtualBackdrop, customImageObj, selectedFilter);

      // Draw overlay frame if selected (skip during clean captures to prevent double-framing or cropping)
      if (selectedFrame && selectedFrame !== 'normal' && !isCapturingCleanRef.current) {
        drawActiveFrame(ctx, width, height, selectedFrame, customBottomText);
      }

      // Draw animated target HUD corners (skip during clean captures)
      if (!isCapturingCleanRef.current) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1.5;
        const boxSize = 140 + Math.sin(time * 2) * 4;
        const bx = width / 2 - boxSize / 2;
        const by = height / 2 - boxSize / 2;
        const len = 15;

        ctx.beginPath(); ctx.moveTo(bx + len, by); ctx.lineTo(bx, by); ctx.lineTo(bx, by + len); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bx + boxSize - len, by); ctx.lineTo(bx + boxSize, by); ctx.lineTo(bx + boxSize, by + len); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bx, by + boxSize - len); ctx.lineTo(bx, by + boxSize); ctx.lineTo(bx + len, by + boxSize); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bx + boxSize, by + boxSize - len); ctx.lineTo(bx + boxSize, by + boxSize); ctx.lineTo(bx + boxSize - len, by + boxSize); ctx.stroke();
        ctx.restore();
      }

      // Pulsing record indicator (skip during clean captures)
      if (!isCapturingCleanRef.current) {
        ctx.save();
        ctx.fillStyle = (Math.floor(time * 2) % 2 === 0) ? '#ef4444' : 'rgba(239, 68, 68, 0.2)';
        ctx.beginPath();
        ctx.arc(25, 25, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(!isVirtual ? 'LIVE WEBCAM STREAM' : 'LIVE VIRTUAL STREAM', 38, 28);
        ctx.restore();
      }

      animationFrameId.current = requestAnimationFrame(renderFeed);
    };

    renderFeed();
    return () => {
      active = false;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isVirtual, virtualBackdrop, customImageObj, selectedFilter, selectedFrame, customBottomText]);

  // Redraw Frame Overlays on preview canvas
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 640;
    canvas.height = 480;
    ctx.clearRect(0, 0, 640, 480);
    
    const theme = frameColors.find(c => c.id === selectedFrameColor) || frameColors[0];
    
    // Draw outer styled frame borders
    ctx.lineWidth = 16;
    ctx.strokeStyle = theme.bg;
    ctx.strokeRect(8, 8, 640 - 16, 480 - 16);

    // Draw customized bottom metadata bar
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 480 - 60, 640, 60);

    // Print custom text at bottom
    ctx.fillStyle = theme.text;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(customBottomText.trim() || 'Kenangan Indah ✨', 320, 480 - 30);
  }, [selectedFrameColor, customBottomText]);

  // Auto-recompile collage photostrip in real-time when any style or layout changes
  useEffect(() => {
    if (capturedSlots.length > 0 && showResultModal) {
      compileFinalLayout(capturedSlots);
    }
  }, [selectedLayout, selectedFrameColor, customBottomText, printDate, capturedSlots, showResultModal]);

  // Draw Frame algorithm stub
  const drawActiveFrame = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    frameId: string, 
    textVal: string
  ) => {
    if (frameId === 'polaroid_classic') {
      const border = Math.round(width * 0.035);
      ctx.strokeStyle = 'rgba(0,0,0,0.04)';
      ctx.lineWidth = 1;
      ctx.strokeRect(border, border, width - (border * 2), height - (border * 2));
    } else if (frameId === 'retro_y2k') {
      const border = Math.round(width * 0.045);
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#ff007f');
      grad.addColorStop(0.5, '#7f00ff');
      grad.addColorStop(1, '#01f9ff');
      
      ctx.strokeStyle = grad;
      ctx.lineWidth = border;
      ctx.strokeRect(border/2, border/2, width - border, height - border);
      
      drawY2KStar(ctx, border * 2, border * 2, border * 0.8, '#ffffff');
      drawY2KStar(ctx, width - (border * 2), border * 2, border * 0.8, '#ffffff');
      drawY2KStar(ctx, border * 2, height - (border * 2.5), border * 0.8, '#ffffff');
      drawY2KStar(ctx, width - (border * 2), height - (border * 2.5), border * 0.8, '#ffffff');
      
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(width * 0.035)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('⚡ RETRO SHOT 2000 ⚡', width / 2, height - (border * 0.8));

    } else if (frameId === 'elegant_gold') {
      const borderOuter = Math.round(width * 0.03);
      const borderInner = Math.round(width * 0.045);
      
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 2;
      ctx.strokeRect(borderOuter, borderOuter, width - (borderOuter * 2), height - (borderOuter * 2));
      
      ctx.lineWidth = 1;
      ctx.strokeRect(borderInner, borderInner, width - (borderInner * 2), height - (borderInner * 2));
      
      ctx.fillStyle = '#D4AF37';
      ctx.textAlign = 'center';
      ctx.font = `italic ${Math.round(width * 0.035)}px serif`;
      ctx.fillText('—  S t u d i o  E l e g a n c e  —', width / 2, height - borderInner - 12);

    } else if (frameId === 'floral_vibe') {
      const border = Math.round(width * 0.035);
      ctx.strokeStyle = '#e2dcd5';
      ctx.lineWidth = border;
      ctx.strokeRect(border/2, border/2, width - border, height - border);
      
      drawLeafBranch(ctx, border * 2, border * 2, 45);
      drawLeafBranch(ctx, width - (border * 2), border * 2, 135);
      drawLeafBranch(ctx, border * 2, height - (border * 2), -45);
      drawLeafBranch(ctx, width - (border * 2), height - (border * 2), -135);
      
      ctx.fillStyle = '#5f6f52';
      ctx.textAlign = 'center';
      ctx.font = `italic 600 ${Math.round(width * 0.035)}px serif`;
      ctx.fillText('wildflower memories', width / 2, height - (border * 0.8));

    } else if (frameId === 'birthday_party') {
      const border = Math.round(width * 0.04);
      ctx.strokeStyle = '#ffbe0b';
      ctx.lineWidth = border;
      ctx.strokeRect(border/2, border/2, width - border, height - border);
      
      const colors = ['#ff006e', '#8338ec', '#3a86f0', '#06d6a0', '#ff9f1c'];
      for (let i = 0; i < 30; i++) {
        const x = (i % 2 === 0) ? Math.random() * border * 2 : width - (Math.random() * border * 2);
        const y = Math.random() * height;
        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.arc(x, y, Math.random() * 5 + 2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.fillStyle = '#ff006e';
      ctx.textAlign = 'center';
      ctx.font = `bold ${Math.round(width * 0.045)}px sans-serif`;
      ctx.fillText('🎉 HAPPY CELEBRATION 🎉', width / 2, height - (border * 0.8));

    } else if (frameId === 'cyberpunk_sys') {
      const border = Math.round(width * 0.03);
      ctx.strokeStyle = '#39ff14';
      ctx.lineWidth = 2;
      ctx.strokeRect(border, border, width - (border * 2), height - (border * 2));
      
      ctx.strokeStyle = 'rgba(57, 255, 20, 0.4)';
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      ctx.moveTo(border * 2, border * 3);
      ctx.lineTo(border * 2, border * 2);
      ctx.lineTo(border * 3, border * 2);
      ctx.stroke();
      
      ctx.fillStyle = '#39ff14';
      ctx.font = `${Math.max(9, Math.round(width * 0.02))}px monospace`;
      ctx.textAlign = 'left';
      ctx.fillText('REC [●]', border * 1.5, border * 1.5);
      ctx.textAlign = 'right';
      ctx.fillText('SYS_BOOT v2.6', width - (border * 1.5), border * 1.5);
      
      ctx.textAlign = 'center';
      ctx.font = `bold ${Math.round(width * 0.032)}px monospace`;
      ctx.fillText('<< OVERLAY_SYS_ONLINE >>', width / 2, height - border - 8);

    } else if (frameId === 'pastel_kawaii') {
      const border = Math.round(width * 0.04);
      ctx.strokeStyle = '#e0aaff';
      ctx.lineWidth = border;
      ctx.strokeRect(border/2, border/2, width - border, height - border);
      
      drawCuteStar(ctx, border * 2, border * 2, 10, '#ffd166');
      drawCuteStar(ctx, width - (border * 2), border * 2, 8, '#ffd166');
      drawCuteStar(ctx, border * 3, height - (border * 2.5), 12, '#ffd166');
      
      ctx.fillStyle = '#7b2cbf';
      ctx.textAlign = 'center';
      ctx.font = `bold ${Math.round(width * 0.035)}px sans-serif`;
      ctx.fillText('⭐️ Sweet Day ⭐️', width / 2, height - (border * 0.8));

    } else if (frameId === 'vintage_newspaper') {
      const topGap = height * 0.15;
      const bottomGap = height * 0.08;
      const borderSize = width * 0.04;
      
      ctx.fillStyle = '#f4ebd0'; // Classic aged newsprint color
      ctx.fillRect(0, 0, width, topGap); // Header
      ctx.fillRect(0, height - bottomGap, width, bottomGap); // Footer
      ctx.fillRect(0, topGap, borderSize, height - topGap - bottomGap); // Left
      ctx.fillRect(width - borderSize, topGap, borderSize, height - topGap - bottomGap); // Right

      // Outer black lines
      ctx.strokeStyle = '#292524';
      ctx.lineWidth = 2;
      ctx.strokeRect(2, 2, width - 4, height - 4);
      
      // Header line & title
      ctx.fillStyle = '#1c1917';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `bold ${Math.round(width * 0.05)}px Georgia, serif`;
      ctx.fillText('THE STUDIO CHRONICLES', width / 2, topGap * 0.45);
      
      // Decorative thin lines
      ctx.beginPath();
      ctx.moveTo(borderSize, topGap * 0.8);
      ctx.lineTo(width - borderSize, topGap * 0.8);
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#1c1917';
      ctx.stroke();

      ctx.fillStyle = '#44403c';
      ctx.font = `italic 9px serif`;
      ctx.fillText('Edition No. 129 — Special Retro Memories Highlight', width / 2, topGap * 0.88);

      // Footer Headline
      ctx.fillStyle = '#1c1917';
      ctx.font = `bold italic ${Math.round(width * 0.03)}px serif`;
      ctx.fillText('EXTRA! PHOTO OF THE DAY CAPTURED LIVE', width / 2, height - (bottomGap / 2));

    } else if (frameId === 'sakura_blossom') {
      const border = Math.round(width * 0.04);
      ctx.strokeStyle = '#ffe5ec';
      ctx.lineWidth = border;
      ctx.strokeRect(border/2, border/2, width - border, height - border);

      const drawSakuraPetal = (x: number, y: number, r: number) => {
        ctx.fillStyle = '#ffb3c1';
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (Math.PI * 2 / 5) * i;
          const petalX = x + Math.cos(angle) * r;
          const petalY = y + Math.sin(angle) * r;
          ctx.arc(petalX, petalY, r * 0.8, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.fillStyle = '#ff758f';
        ctx.beginPath();
        ctx.arc(x, y, r * 0.4, 0, Math.PI * 2);
        ctx.fill();
      };

      drawSakuraPetal(border * 2, border * 2, border * 0.4);
      drawSakuraPetal(width - (border * 2), border * 2, border * 0.35);
      drawSakuraPetal(border * 2, height - (border * 2), border * 0.5);
      drawSakuraPetal(width - (border * 2), height - (border * 2), border * 0.4);

      ctx.fillStyle = '#ff758f';
      ctx.font = `italic bold ${Math.round(width * 0.035)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('🌸 SAKURA DREAMS 🌸', width / 2, height - (border * 0.8));

    } else if (frameId === 'disco_night') {
      const border = Math.round(width * 0.04);
      ctx.strokeStyle = '#1e1b4b';
      ctx.lineWidth = border;
      ctx.strokeRect(border/2, border/2, width - border, height - border);

      const colors = ['#06b6d4', '#ec4899', '#f59e0b', '#10b981', '#ffffff'];
      for (let i = 0; i < 24; i++) {
        const x = (i % 2 === 0) ? Math.random() * border * 2.5 : width - (Math.random() * border * 2.5);
        const y = Math.random() * height;
        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.arc(x, y, Math.random() * 4 + 2, 0, Math.PI * 2);
        ctx.fill();

        if (i % 4 === 0) {
          drawY2KStar(ctx, x, y, Math.random() * 6 + 3, '#ffffff');
        }
      }

      ctx.fillStyle = '#ec4899';
      ctx.font = `bold italic ${Math.round(width * 0.04)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('🕺 DISCO FEVER 💃', width / 2, height - (border * 0.8));

    } else if (frameId === 'comic_pop') {
      const border = Math.round(width * 0.045);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = border;
      ctx.strokeRect(border/2, border/2, width - border, height - border);

      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.strokeRect(border - 2, border - 2, width - (border * 2) + 4, height - (border * 2) + 4);

      const bx = border * 3;
      const by = height - border * 2.5;
      
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(bx, by, 22, 0, Math.PI * 2);
      ctx.arc(bx + 18, by - 6, 18, 0, Math.PI * 2);
      ctx.arc(bx - 14, by + 4, 15, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = `italic bold ${Math.round(width * 0.035)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SNAP!', bx + 4, by - 2);

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'right';
      ctx.font = `bold ${Math.round(width * 0.038)}px Impact, Arial, sans-serif`;
      ctx.fillText('★ RETRO POP ART ★', width - border * 1.5, height - (border * 0.8));

    } else if (frameId === 'underwater_marine') {
      const border = Math.round(width * 0.04);
      ctx.strokeStyle = '#0891b2';
      ctx.lineWidth = border;
      ctx.strokeRect(border/2, border/2, width - border, height - border);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 25; i++) {
        const x = (i % 2 === 0) ? Math.random() * border * 2.5 : width - (Math.random() * border * 2.5);
        const y = Math.random() * height;
        const radius = Math.random() * 6 + 3;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x - radius/3, y - radius/3, radius * 0.25, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(width * 0.035)}px Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('🫧 UNDERWATER MARINE 🫧', width / 2, height - (border * 0.8));

    } else if (frameId === 'holiday_winter') {
      const border = Math.round(width * 0.04);
      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = border;
      ctx.strokeRect(border/2, border/2, width - border, height - border);

      const drawSnowflake = (cx: number, cy: number, r: number) => {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const x2 = cx + Math.cos(angle) * r;
          const y2 = cy + Math.sin(angle) * r;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      };

      drawSnowflake(border * 2, border * 2, 12);
      drawSnowflake(width - (border * 2), border * 2, 10);
      drawSnowflake(border * 2, height - (border * 2), 14);
      drawSnowflake(width - (border * 2), height - (border * 2), 11);

      ctx.fillStyle = '#1e3a8a';
      ctx.font = `bold ${Math.round(width * 0.032)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('❄️ COZY WINTER HOLIDAYS ❄️', width / 2, height - (border * 0.8));

    } else if (frameId === 'multiplex_strip') {
      const holeW = width * 0.03;
      const holeH = height * 0.04;
      const gap = height * 0.03;
      
      const borderPanelWidth = width * 0.08;
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, borderPanelWidth, height);
      ctx.fillRect(width - borderPanelWidth, 0, borderPanelWidth, height);
      
      ctx.fillStyle = '#ffffff';
      for (let y = gap; y < height; y += holeH + gap) {
        ctx.fillRect(width * 0.02, y, holeW, holeH);
        ctx.fillRect(width - (width * 0.02) - holeW, y, holeW, holeH);
      }
    } else if (frameId === 'four_cut_strip') {
      const holeW = width * 0.03;
      const holeH = height * 0.03;
      const gap = height * 0.02;
      
      const borderPanelWidth = width * 0.08;
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(0, 0, borderPanelWidth, height);
      ctx.fillRect(width - borderPanelWidth, 0, borderPanelWidth, height);
      
      ctx.fillStyle = '#f5f5f4';
      for (let y = gap; y < height; y += holeH + gap) {
        ctx.fillRect(width * 0.02, y, holeW, holeH);
        ctx.fillRect(width - (width * 0.02) - holeW, y, holeW, holeH);
      }
    }
  };

  const applyPixelFilter = (ctx: CanvasRenderingContext2D, width: number, height: number, filterId: string, time: number) => {
    if (filterId === 'normal') return;

    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    const len = data.length;

    if (filterId === 'snow_white') {
      for (let i = 0; i < len; i += 4) {
        let r = data[i];
        let g = data[i+1];
        let b = data[i+2];

        const isSkin = r > 95 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 15;
        if (isSkin) {
          data[i] = Math.min(255, r * 1.18 + 15);
          data[i+1] = Math.min(255, g * 1.15 + 10);
          data[i+2] = Math.min(255, b * 1.15 + 10);
        } else {
          data[i] = Math.min(255, r * 1.08 + 5);
          data[i+1] = Math.min(255, g * 1.08 + 5);
          data[i+2] = Math.min(255, b * 1.08 + 5);
        }
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (filterId === 'porcelain') {
      for (let i = 0; i < len; i += 4) {
        let r = data[i];
        let g = data[i+1];
        let b = data[i+2];

        let bright = (r + g + b) / 3;
        let factor = bright > 120 ? 1.18 : 1.05;
        
        let nr = r * factor + 5;
        let ng = g * factor + 5;
        let nb = b * factor + 12;

        data[i] = Math.min(255, nr > 128 ? 128 + (nr - 128) * 1.1 : 128 - (128 - nr) * 0.95);
        data[i+1] = Math.min(255, ng > 128 ? 128 + (ng - 128) * 1.1 : 128 - (128 - ng) * 0.95);
        data[i+2] = Math.min(255, nb > 128 ? 128 + (nb - 128) * 1.1 : 128 - (128 - nb) * 0.95);
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (filterId === 'rosy_white') {
      for (let i = 0; i < len; i += 4) {
        let r = data[i];
        let g = data[i+1];
        let b = data[i+2];

        const isSkin = r > 95 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 15;
        if (isSkin) {
          data[i] = Math.min(255, r * 1.2 + 10);
          data[i+1] = Math.min(255, g * 1.05);
          data[i+2] = Math.min(255, b * 1.15 + 8);
        } else {
          data[i] = Math.min(255, r * 1.05 + 4);
          data[i+2] = Math.min(255, b * 1.05 + 4);
        }
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (filterId === 'ivory_elegance') {
      for (let i = 0; i < len; i += 4) {
        let r = data[i];
        let g = data[i+1];
        let b = data[i+2];

        data[i] = Math.min(255, r * 1.15 + 12);
        data[i+1] = Math.min(255, g * 1.12 + 10);
        data[i+2] = Math.min(255, b * 1.03 + 2);
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (filterId === 'undereye_corrector') {
      for (let i = 0; i < len; i += 4) {
        let r = data[i];
        let g = data[i+1];
        let b = data[i+2];

        const isShadow = r < 130 && g < 120 && b < 110;
        if (isShadow && r > 40) {
          data[i] = Math.min(255, r * 1.35 + 5);
          data[i+1] = Math.min(255, g * 1.32 + 5);
          data[i+2] = Math.min(255, b * 1.25 + 5);
        }
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (filterId === 'ultra_smooth') {
      const blurred = new Uint8ClampedArray(data);
      const rowBytes = width * 4;
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = (y * width + x) * 4;
          let rSum = 0, gSum = 0, bSum = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const kIdx = idx + (ky * rowBytes) + (kx * 4);
              rSum += data[kIdx];
              gSum += data[kIdx+1];
              bSum += data[kIdx+2];
            }
          }
          blurred[idx] = rSum / 9;
          blurred[idx+1] = gSum / 9;
          blurred[idx+2] = bSum / 9;
        }
      }
      for (let i = 0; i < len; i += 4) {
        let r = data[i];
        let g = data[i+1];
        let b = data[i+2];
        const isSkin = r > 95 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 15;
        if (isSkin) {
          data[i] = blurred[i] * 0.85 + r * 0.15;
          data[i+1] = blurred[i+1] * 0.85 + g * 0.15;
          data[i+2] = blurred[i+2] * 0.85 + b * 0.15;
        } else {
          data[i] = blurred[i] * 0.2 + r * 0.8;
          data[i+1] = blurred[i+1] * 0.2 + g * 0.8;
          data[i+2] = blurred[i+2] * 0.2 + b * 0.8;
        }
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (filterId === 'glass_skin') {
      for (let i = 0; i < len; i += 4) {
        let r = data[i];
        let g = data[i+1];
        let b = data[i+2];

        let bright = (r + g + b) / 3;
        if (bright > 110) {
          data[i] = Math.min(255, r * 1.15 + 10);
          data[i+1] = Math.min(255, g * 1.15 + 10);
          data[i+2] = Math.min(255, b * 1.20 + 15);
        } else {
          data[i] = Math.min(255, r * 1.05);
          data[i+1] = Math.min(255, g * 1.05);
          data[i+2] = Math.min(255, b * 1.08);
        }
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (filterId === 'silk_satin') {
      for (let i = 0; i < len; i += 4) {
        let r = data[i];
        let g = data[i+1];
        let b = data[i+2];

        let bright = (r + g + b) / 3;
        if (bright < 90) {
          data[i] = Math.min(255, r * 1.25 + 8);
          data[i+1] = Math.min(255, g * 1.22 + 8);
          data[i+2] = Math.min(255, b * 1.20 + 8);
        } else if (bright > 200) {
          data[i] = Math.max(0, r * 0.95);
          data[i+1] = Math.max(0, g * 0.95);
          data[i+2] = Math.max(0, b * 0.95);
        }
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (filterId === 'soft_glam') {
      for (let i = 0; i < len; i += 4) {
        let r = data[i];
        let g = data[i+1];
        let b = data[i+2];

        data[i] = Math.min(255, r * 1.15 + 8);
        data[i+1] = Math.min(255, g * 1.10 + 5);
        data[i+2] = Math.min(255, b * 1.12 + 6);
      }
      ctx.putImageData(imgData, 0, 0);

      ctx.fillStyle = 'rgba(239, 68, 110, 0.22)';
      ctx.beginPath();
      ctx.ellipse(width / 2, height * 0.62, width * 0.07, height * 0.028, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (filterId === 'cute_freckles') {
      for (let i = 0; i < len; i += 4) {
        let r = data[i];
        let g = data[i+1];
        let b = data[i+2];
        data[i] = Math.min(255, r * 1.12 + 5);
        data[i+1] = Math.min(255, g * 1.10 + 5);
        data[i+2] = Math.min(255, b * 1.10 + 5);
      }
      ctx.putImageData(imgData, 0, 0);

      const blushGradL = ctx.createRadialGradient(width * 0.36, height * 0.58, 2, width * 0.36, height * 0.58, width * 0.12);
      blushGradL.addColorStop(0, 'rgba(244, 63, 94, 0.3)');
      blushGradL.addColorStop(1, 'rgba(244, 63, 94, 0)');
      ctx.fillStyle = blushGradL;
      ctx.beginPath();
      ctx.arc(width * 0.36, height * 0.58, width * 0.12, 0, Math.PI * 2);
      ctx.fill();

      const blushGradR = ctx.createRadialGradient(width * 0.64, height * 0.58, 2, width * 0.64, height * 0.58, width * 0.12);
      blushGradR.addColorStop(0, 'rgba(244, 63, 94, 0.3)');
      blushGradR.addColorStop(1, 'rgba(244, 63, 94, 0)');
      ctx.fillStyle = blushGradR;
      ctx.beginPath();
      ctx.arc(width * 0.64, height * 0.58, width * 0.12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(139, 92, 26, 0.65)';
      const seed = 42;
      for (let i = 0; i < 22; i++) {
        const fx = width * 0.42 + (Math.sin(i * 352.1 + seed) * 0.16 * width);
        const fy = height * 0.55 + (Math.cos(i * 128.5 + seed) * 0.05 * height);
        ctx.beginPath();
        ctx.arc(fx, fy, 1.2 + Math.abs(Math.sin(i)) * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (filterId === 'sunset_glow') {
      for (let i = 0; i < len; i += 4) {
        let r = data[i];
        let g = data[i+1];
        let b = data[i+2];

        data[i] = Math.min(255, r * 1.28 + 15);
        data[i+1] = Math.min(255, g * 1.08 + 5);
        data[i+2] = Math.min(255, b * 0.80);
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (filterId === 'cyber_neon') {
      for (let i = 0; i < len; i += 4) {
        let r = data[i];
        let g = data[i+1];
        let b = data[i+2];

        const gray = (r + g + b) / 3;
        data[i] = Math.min(255, gray * 1.35 + 25);
        data[i+1] = Math.min(255, gray * 0.5);
        data[i+2] = Math.min(255, gray * 1.6 + 35);
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (filterId === 'warm_latte') {
      for (let i = 0; i < len; i += 4) {
        let r = data[i];
        let g = data[i+1];
        let b = data[i+2];

        data[i] = Math.min(255, r * 1.12 + 10);
        data[i+1] = Math.min(255, g * 1.02 + 5);
        data[i+2] = Math.min(255, b * 0.88);
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (filterId === 'retro_film') {
      for (let i = 0; i < len; i += 4) {
        let r = data[i];
        let g = data[i+1];
        let b = data[i+2];

        const noise = (Math.random() - 0.5) * 20;
        data[i] = Math.max(0, Math.min(255, r * 1.08 + noise));
        data[i+1] = Math.max(0, Math.min(255, g * 1.02 + noise));
        data[i+2] = Math.max(0, Math.min(255, b * 0.95 + noise));
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (filterId === 'moody_cold') {
      for (let i = 0; i < len; i += 4) {
        let r = data[i];
        let g = data[i+1];
        let b = data[i+2];

        data[i] = Math.max(0, r * 0.80 - 5);
        data[i+1] = Math.min(255, g * 1.05 + 5);
        data[i+2] = Math.min(255, b * 1.25 + 15);
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (filterId === 'big_head') {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext('2d')!;
      tempCtx.putImageData(imgData, 0, 0);

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(width, height) * 0.45;

      const outImgData = ctx.createImageData(width, height);
      const outData = outImgData.data;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const dx = x - centerX;
          const dy = y - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          let sx = x;
          let sy = y;

          if (distance < maxRadius) {
            const normDist = distance / maxRadius;
            const warp = Math.pow(normDist, 0.5);
            sx = centerX + dx * warp;
            sy = centerY + dy * warp;
          }

          const sxInt = Math.floor(sx);
          const syInt = Math.floor(sy);
          if (sxInt >= 0 && sxInt < width && syInt >= 0 && syInt < height) {
            const srcIdx = (syInt * width + sxInt) * 4;
            const destIdx = (y * width + x) * 4;
            outData[destIdx] = data[srcIdx];
            outData[destIdx+1] = data[srcIdx+1];
            outData[destIdx+2] = data[srcIdx+2];
            outData[destIdx+3] = data[srcIdx+3];
          }
        }
      }
      ctx.putImageData(outImgData, 0, 0);
    } else if (filterId === 'fish_eye') {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext('2d')!;
      tempCtx.putImageData(imgData, 0, 0);

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(width, height) * 0.5;

      const outImgData = ctx.createImageData(width, height);
      const outData = outImgData.data;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const dx = x - centerX;
          const dy = y - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          let sx = x;
          let sy = y;

          if (distance < maxRadius) {
            const theta = Math.atan2(dy, dx);
            const r = (distance / maxRadius);
            const rWarped = Math.sin(r * Math.PI / 2);
            sx = centerX + Math.cos(theta) * rWarped * maxRadius;
            sy = centerY + Math.sin(theta) * rWarped * maxRadius;
          }

          const sxInt = Math.floor(sx);
          const syInt = Math.floor(sy);
          if (sxInt >= 0 && sxInt < width && syInt >= 0 && syInt < height) {
            const srcIdx = (syInt * width + sxInt) * 4;
            const destIdx = (y * width + x) * 4;
            outData[destIdx] = data[srcIdx];
            outData[destIdx+1] = data[srcIdx+1];
            outData[destIdx+2] = data[srcIdx+2];
            outData[destIdx+3] = data[srcIdx+3];
          }
        }
      }
      ctx.putImageData(outImgData, 0, 0);
    } else if (filterId === 'rgb_glitch') {
      const outImgData = ctx.createImageData(width, height);
      const outData = outImgData.data;
      
      const offsetR = 12;
      const offsetB = -12;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const destIdx = (y * width + x) * 4;
          
          let rx = x + offsetR;
          if (rx < 0) rx = 0; if (rx >= width) rx = width - 1;
          const rIdx = (y * width + rx) * 4;

          let bx = x + offsetB;
          if (bx < 0) bx = 0; if (bx >= width) bx = width - 1;
          const bIdx = (y * width + bx) * 4;

          outData[destIdx] = data[rIdx];
          outData[destIdx+1] = data[destIdx+1];
          outData[destIdx+2] = data[bIdx+2];
          outData[destIdx+3] = 255;
        }
      }
      ctx.putImageData(outImgData, 0, 0);
    } else if (filterId === 'pixel_art') {
      const pxSize = 8;
      for (let y = 0; y < height; y += pxSize) {
        for (let x = 0; x < width; x += pxSize) {
          let rSum = 0, gSum = 0, bSum = 0, count = 0;
          for (let dy = 0; dy < pxSize && y + dy < height; dy++) {
            for (let dx = 0; dx < pxSize && x + dx < width; dx++) {
              const idx = ((y + dy) * width + (x + dx)) * 4;
              rSum += data[idx];
              gSum += data[idx+1];
              bSum += data[idx+2];
              count++;
            }
          }
          const rAvg = rSum / count;
          const gAvg = gSum / count;
          const bAvg = bSum / count;

          for (let dy = 0; dy < pxSize && y + dy < height; dy++) {
            for (let dx = 0; dx < pxSize && x + dx < width; dx++) {
              const idx = ((y + dy) * width + (x + dx)) * 4;
              data[idx] = rAvg;
              data[idx+1] = gAvg;
              data[idx+2] = bAvg;
            }
          }
        }
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (filterId === 'invert_alien') {
      for (let i = 0; i < len; i += 4) {
        data[i] = 255 - data[i];
        data[i+1] = 255 - data[i+1];
        data[i+2] = 255 - data[i+2];
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (filterId === 'thermal_camera') {
      for (let i = 0; i < len; i += 4) {
        let r = data[i];
        let g = data[i+1];
        let b = data[i+2];

        const bright = (r + g + b) / 3;

        if (bright < 64) {
          data[i] = 0;
          data[i+1] = 0;
          data[i+2] = bright * 4;
        } else if (bright < 128) {
          const norm = (bright - 64) / 64;
          data[i] = 0;
          data[i+1] = norm * 255;
          data[i+2] = 255 - (norm * 255);
        } else if (bright < 192) {
          const norm = (bright - 128) / 64;
          data[i] = norm * 255;
          data[i+1] = 255;
          data[i+2] = 0;
        } else {
          const norm = (bright - 192) / 63;
          data[i] = 255;
          data[i+1] = 255 - (norm * 255);
          data[i+2] = norm * 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }
  };

  const drawY2KStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, style: string) => {
    ctx.fillStyle = style;
    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    ctx.quadraticCurveTo(cx, cy, cx + r, cy);
    ctx.quadraticCurveTo(cx, cy, cx, cy + r);
    ctx.quadraticCurveTo(cx, cy, cx - r, cy);
    ctx.quadraticCurveTo(cx, cy, cx, cy - r);
    ctx.closePath();
    ctx.fill();
  };

  const drawCuteStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, style: string) => {
    ctx.fillStyle = style;
    ctx.beginPath();
    const spikes = 5;
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * r;
      y = cy + Math.sin(rot) * r;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * (r * 0.5);
      y = cy + Math.sin(rot) * (r * 0.5);
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.closePath();
    ctx.fill();
  };

  const drawLeafBranch = (ctx: CanvasRenderingContext2D, cx: number, cy: number, angleDegrees: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angleDegrees * Math.PI / 180);
    
    ctx.strokeStyle = '#5f6f52';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(0, 15);
    ctx.quadraticCurveTo(4, 0, 0, -15);
    ctx.stroke();
    
    ctx.fillStyle = '#808f70';
    for (let i = 0; i < 3; i++) {
      const leafY = -10 + (i * 9);
      ctx.beginPath();
      ctx.ellipse(-6, leafY, 4.5, 2.2, -Math.PI/6, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.ellipse(6, leafY, 4.5, 2.2, Math.PI/6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };

  const renderFrameThumbnail = (frameId: string) => {
    switch (frameId) {
      case 'polaroid_classic':
        return (
          <div className="w-full h-16 bg-slate-100 rounded-lg relative border border-slate-200 overflow-hidden mb-2 flex items-center justify-center p-1">
            <div className="w-full h-full bg-white border border-slate-100 rounded flex flex-col justify-between p-0.5 shadow-sm">
              <div className="w-full aspect-[4/3] bg-slate-200 rounded-sm"></div>
              <div className="h-1 w-2/3 bg-slate-300 rounded-full mx-auto mb-0.5"></div>
            </div>
          </div>
        );
      case 'retro_y2k':
        return (
          <div className="w-full h-16 bg-slate-900 rounded-lg relative border border-slate-700 overflow-hidden mb-2 p-1 flex items-center justify-center">
            <div className="w-full h-full rounded border border-pink-500 relative flex items-center justify-center">
              <span className="text-[7px] text-pink-400 font-bold scale-90">Y2K Retro</span>
              <div className="absolute top-0.5 left-0.5 text-[5px] text-cyan-300">✦</div>
              <div className="absolute bottom-0.5 right-0.5 text-[5px] text-cyan-300">✦</div>
            </div>
          </div>
        );
      case 'elegant_gold':
        return (
          <div className="w-full h-16 bg-slate-950 rounded-lg relative border border-slate-800 overflow-hidden mb-2 p-1 flex items-center justify-center">
            <div className="w-full h-full rounded border border-[#D4AF37] p-0.5 flex items-center justify-center">
              <div className="w-full h-full rounded border border-[#D4AF37] flex items-center justify-center">
                <span className="text-[5px] text-[#D4AF37] tracking-widest font-serif scale-90">GOLD</span>
              </div>
            </div>
          </div>
        );
      case 'floral_vibe':
        return (
          <div className="w-full h-16 bg-[#fbfbf9] rounded-lg relative border border-slate-200 overflow-hidden mb-2 p-1 flex items-center justify-center">
            <div className="w-full h-full rounded border border-emerald-100 relative flex items-center justify-center">
              <span className="text-[6px] text-emerald-700 font-serif italic">floral</span>
              <div className="absolute top-0.5 left-0.5 text-emerald-600 text-[6px]">🍃</div>
              <div className="absolute bottom-0.5 right-0.5 text-emerald-600 text-[6px]">🍃</div>
            </div>
          </div>
        );
      case 'birthday_party':
        return (
          <div className="w-full h-16 bg-amber-50 rounded-lg relative border border-amber-100 overflow-hidden mb-2 p-1 flex items-center justify-center">
            <div className="w-full h-full rounded border border-amber-300 relative flex flex-col justify-between items-center">
              <span className="text-[5px]">🎉</span>
              <span className="text-[6px] text-pink-500 font-bold scale-90">BDAY</span>
              <span className="text-[5px]">🍰</span>
            </div>
          </div>
        );
      case 'cyberpunk_sys':
        return (
          <div className="w-full h-16 bg-slate-950 rounded-lg relative border border-slate-800 overflow-hidden mb-2 p-1 flex items-center justify-center">
            <div className="w-full h-full rounded border border-lime-400 relative flex items-center justify-center">
              <span className="text-[5px] text-lime-400 font-mono scale-95">SYS_REC</span>
              <div className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full bg-red-500 animate-pulse"></div>
            </div>
          </div>
        );
      case 'pastel_kawaii':
        return (
          <div className="w-full h-16 bg-indigo-50 rounded-lg relative border border-indigo-100 overflow-hidden mb-2 p-1 flex items-center justify-center">
            <div className="w-full h-full rounded border border-purple-200 relative flex flex-col justify-between items-center p-0.5">
              <span className="text-[6px] text-amber-400">⭐</span>
              <span className="text-[6px] text-purple-600 font-bold">Cute</span>
              <span className="text-[6px]">☁️</span>
            </div>
          </div>
        );
      case 'vintage_newspaper':
        return (
          <div className="w-full h-16 bg-[#f4ebd0] rounded-lg relative border border-amber-200 overflow-hidden mb-2 p-1 flex items-center justify-center">
            <div className="w-full h-full border border-stone-400 p-0.5 flex flex-col justify-between">
              <div className="border-b border-stone-800 text-center py-0.5 leading-none">
                <span className="text-[4px] font-serif font-black uppercase tracking-tighter text-stone-900">DAILY NEWS</span>
              </div>
              <div className="text-[4px] text-stone-600 font-serif text-center truncate scale-90">RETRO POST</div>
            </div>
          </div>
        );
      case 'sakura_blossom':
        return (
          <div className="w-full h-16 bg-rose-50/50 rounded-lg relative border border-rose-200 overflow-hidden mb-2 p-1 flex items-center justify-center">
            <div className="w-full h-full border border-rose-300 relative flex items-center justify-center">
              <span className="text-[6px] text-rose-500 font-bold scale-90">SAKURA</span>
              <div className="absolute top-0.5 left-0.5 text-[6px]">🌸</div>
              <div className="absolute bottom-0.5 right-0.5 text-[6px]">🌸</div>
            </div>
          </div>
        );
      case 'disco_night':
        return (
          <div className="w-full h-16 bg-purple-950 rounded-lg relative border border-purple-800 overflow-hidden mb-2 p-1 flex items-center justify-center">
            <div className="w-full h-full border border-fuchsia-500 relative flex flex-col justify-between items-center p-0.5">
              <span className="text-[7px]">🕺</span>
              <span className="text-[5px] text-fuchsia-400 font-semibold uppercase tracking-widest scale-90">DISCO</span>
              <span className="text-[5px] text-cyan-400">✨</span>
            </div>
          </div>
        );
      case 'comic_pop':
        return (
          <div className="w-full h-16 bg-yellow-50 rounded-lg relative border border-yellow-200 overflow-hidden mb-2 p-0.5 flex items-center justify-center">
            <div className="w-full h-full border border-red-500 relative bg-[radial-gradient(#fde047_1px,transparent_1px)] [background-size:3px_3px] flex items-center justify-center">
              <span className="text-[7px] text-red-600 font-black italic bg-white border border-black px-0.5 transform rotate-[-4deg] scale-90">SNAP!</span>
            </div>
          </div>
        );
      case 'underwater_marine':
        return (
          <div className="w-full h-16 bg-sky-50 rounded-lg relative border border-sky-200 overflow-hidden mb-2 p-1 flex items-center justify-center">
            <div className="w-full h-full border border-cyan-400 relative bg-gradient-to-b from-sky-200 to-cyan-500 flex flex-col justify-between p-0.5">
              <span className="text-[5px] text-white">🫧</span>
              <span className="text-[6px] text-white font-bold text-center scale-90">MARINE</span>
              <span className="text-[6px] text-right">🐚</span>
            </div>
          </div>
        );
      case 'holiday_winter':
        return (
          <div className="w-full h-16 bg-blue-50/50 rounded-lg relative border border-blue-200 overflow-hidden mb-2 p-1 flex items-center justify-center">
            <div className="w-full h-full border border-blue-300 relative bg-gradient-to-b from-blue-50 to-blue-200 flex flex-col justify-between p-0.5">
              <span className="text-[6px] text-blue-500">❄️</span>
              <span className="text-[5px] text-blue-800 font-bold text-center scale-90">WINTER</span>
              <span className="text-[6px] text-right text-blue-500">❄️</span>
            </div>
          </div>
        );
      case 'multiplex_strip':
        return (
          <div className="w-full h-16 bg-slate-900 rounded-lg relative border border-slate-800 overflow-hidden mb-2 p-0.5 flex items-center justify-center gap-0.5">
            <div className="w-1 h-full flex flex-col justify-between py-0.5 bg-white scale-75 opacity-40">
              <div className="w-0.5 h-0.5 bg-black rounded-sm"></div>
              <div className="w-0.5 h-0.5 bg-black rounded-sm"></div>
              <div className="w-0.5 h-0.5 bg-black rounded-sm"></div>
            </div>
            <div className="flex-1 h-full flex flex-col gap-0.5 py-0.5">
              <div className="flex-1 bg-slate-800 rounded-sm"></div>
              <div className="flex-1 bg-slate-800 rounded-sm"></div>
              <div className="flex-1 bg-slate-800 rounded-sm"></div>
            </div>
            <div className="w-1 h-full flex flex-col justify-between py-0.5 bg-white scale-75 opacity-40">
              <div className="w-0.5 h-0.5 bg-black rounded-sm"></div>
              <div className="w-0.5 h-0.5 bg-black rounded-sm"></div>
              <div className="w-0.5 h-0.5 bg-black rounded-sm"></div>
            </div>
          </div>
        );
      case 'four_cut_strip':
        return (
          <div className="w-full h-16 bg-stone-900 rounded-lg relative border border-stone-800 overflow-hidden mb-2 p-0.5 flex items-center justify-center gap-0.5">
            <div className="w-1 h-full flex flex-col justify-between py-0.5 bg-stone-100 scale-75 opacity-40">
              <div className="w-0.5 h-0.5 bg-black rounded-sm"></div>
              <div className="w-0.5 h-0.5 bg-black rounded-sm"></div>
              <div className="w-0.5 h-0.5 bg-black rounded-sm"></div>
              <div className="w-0.5 h-0.5 bg-black rounded-sm"></div>
            </div>
            <div className="flex-1 h-full flex flex-col gap-0.5 py-0.5">
              <div className="flex-1 bg-stone-800 rounded-sm"></div>
              <div className="flex-1 bg-stone-800 rounded-sm"></div>
              <div className="flex-1 bg-stone-800 rounded-sm"></div>
              <div className="flex-1 bg-stone-800 rounded-sm"></div>
            </div>
            <div className="w-1 h-full flex flex-col justify-between py-0.5 bg-stone-100 scale-75 opacity-40">
              <div className="w-0.5 h-0.5 bg-black rounded-sm"></div>
              <div className="w-0.5 h-0.5 bg-black rounded-sm"></div>
              <div className="w-0.5 h-0.5 bg-black rounded-sm"></div>
              <div className="w-0.5 h-0.5 bg-black rounded-sm"></div>
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full h-16 bg-slate-100 rounded-lg relative border border-slate-200 overflow-hidden mb-2 flex items-center justify-center">
            <span className="text-sm">🖼️</span>
          </div>
        );
    }
  };

  const renderLayoutVisual = (layoutId: string) => {
    switch (layoutId) {
      case 'single':
        return (
          <div className="w-12 h-14 bg-white border border-slate-200/80 rounded-lg p-1 flex flex-col justify-between shadow-sm flex-shrink-0">
            <div className="w-full h-9 bg-indigo-50 border border-dashed border-indigo-200 rounded-sm"></div>
            <div className="w-5 h-1 bg-slate-200 mx-auto rounded-full"></div>
          </div>
        );
      case '4_cut_strip':
        return (
          <div className="w-12 h-14 bg-white border border-slate-200/80 rounded-lg p-1 flex flex-col justify-between gap-0.5 shadow-sm flex-shrink-0">
            <div className="w-full h-1.5 bg-indigo-50 border border-dashed border-indigo-200 rounded-[1px]"></div>
            <div className="w-full h-1.5 bg-indigo-50 border border-dashed border-indigo-200 rounded-[1px]"></div>
            <div className="w-full h-1.5 bg-indigo-50 border border-dashed border-indigo-200 rounded-[1px]"></div>
            <div className="w-full h-1.5 bg-indigo-50 border border-dashed border-indigo-200 rounded-[1px]"></div>
            <div className="w-5 h-1 bg-slate-200 mx-auto rounded-full mt-0.5"></div>
          </div>
        );
      case '2x2_grid':
        return (
          <div className="w-12 h-14 bg-white border border-slate-200/80 rounded-lg p-1 flex flex-col justify-between shadow-sm flex-shrink-0">
            <div className="grid grid-cols-2 gap-0.5 h-10">
              <div className="bg-indigo-50 border border-dashed border-indigo-200 rounded-sm"></div>
              <div className="bg-indigo-50 border border-dashed border-indigo-200 rounded-sm"></div>
              <div className="bg-indigo-50 border border-dashed border-indigo-200 rounded-sm"></div>
              <div className="bg-indigo-50 border border-dashed border-indigo-200 rounded-sm"></div>
            </div>
            <div className="w-5 h-1 bg-slate-200 mx-auto rounded-full"></div>
          </div>
        );
      case '5_photo_combo':
        return (
          <div className="w-12 h-14 bg-white border border-slate-200/80 rounded-lg p-1 flex flex-col justify-between shadow-sm flex-shrink-0">
            <div className="w-full h-6 bg-indigo-50 border border-dashed border-indigo-200 rounded-sm"></div>
            <div className="grid grid-cols-4 gap-0.5 h-3 mt-0.5">
              <div className="bg-indigo-50 border border-dashed border-indigo-150 rounded-[1px]"></div>
              <div className="bg-indigo-50 border border-dashed border-indigo-150 rounded-[1px]"></div>
              <div className="bg-indigo-50 border border-dashed border-indigo-150 rounded-[1px]"></div>
              <div className="bg-indigo-50 border border-dashed border-indigo-150 rounded-[1px]"></div>
            </div>
            <div className="w-4 h-0.5 bg-slate-200 mx-auto rounded-full mt-0.5"></div>
          </div>
        );
      default:
        return (
          <div className="w-12 h-14 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center flex-shrink-0 text-xs">
            🖼️
          </div>
        );
    }
  };

  const captureCurrentSlotFrame = (): string => {
    const tempCanvas = document.createElement('canvas');
    const source = isVirtual ? virtualCanvasRef.current : videoRef.current;
    
    if (source) {
      const srcWidth = isVirtual ? (source as HTMLCanvasElement).width : (source as HTMLVideoElement).videoWidth || 640;
      const srcHeight = isVirtual ? (source as HTMLCanvasElement).height : (source as HTMLVideoElement).videoHeight || 480;
      
      tempCanvas.width = srcWidth;
      tempCanvas.height = srcHeight;
      const tempCtx = tempCanvas.getContext('2d');
      
      if (tempCtx) {
        // Draw the clean feed synchronously on the capture canvas with filter applied but no frames or HUD elements
        drawCleanFeed(tempCtx, tempCanvas.width, tempCanvas.height, Date.now() * 0.002, isVirtual, virtualBackdrop, customImageObj, selectedFilter);
      }
      return tempCanvas.toDataURL('image/png');
    }
    return '';
  };

  const startCaptureSequence = () => {
    if (isCapturing) return;
    setIsCapturing(true);
    setActiveSlotIndex(0);
    setCapturedSlots([]);
    setReviewingPhoto(null);
    triggerCountdownForSlot(0);
  };

  const triggerCountdownForSlot = (slotIndex: number) => {
    let count = 3;
    setCountdown(count);

    const timer = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(timer);
        setCountdown(null);
        triggerFlash();

        const photoData = captureCurrentSlotFrame();
        setReviewingPhoto(photoData);
      }
    }, 1000);
  };

  const handleAcceptPhoto = () => {
    const nextSlots = [...capturedSlots];
    nextSlots[activeSlotIndex] = reviewingPhoto!;
    setCapturedSlots(nextSlots);
    setReviewingPhoto(null);

    const layoutSlotsCount = layouts.find(l => l.id === selectedLayout)?.slots || 1;
    if (activeSlotIndex + 1 < layoutSlotsCount) {
      const nextIndex = activeSlotIndex + 1;
      setActiveSlotIndex(nextIndex);
      triggerCountdownForSlot(nextIndex);
    } else {
      compileFinalLayout(nextSlots);
      setIsCapturing(false);
    }
  };

  const handleRetakePhoto = () => {
    setReviewingPhoto(null);
    triggerCountdownForSlot(activeSlotIndex);
  };

  const compileFinalLayout = async (slots: string[]) => {
    const canvas = resultCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Preload images
    const images: HTMLImageElement[] = [];
    await Promise.all(
      slots.map((src, i) => {
        return new Promise<void>((resolve) => {
          if (!src) {
            resolve();
            return;
          }
          const img = new Image();
          img.onload = () => {
            images[i] = img;
            resolve();
          };
          img.onerror = () => {
            resolve();
          };
          img.src = src;
        });
      })
    );

    // Determine dimensions
    let canvasW = 800;
    let canvasH = 1000;
    
    if (selectedLayout === '4_cut_strip') {
      canvasW = 600;
      canvasH = 1800;
    } else if (selectedLayout === '2x2_grid') {
      canvasW = 800;
      canvasH = 1000;
    } else if (selectedLayout === '5_photo_combo') {
      canvasW = 800;
      canvasH = 1050;
    }

    canvas.width = canvasW;
    canvas.height = canvasH;
    ctx.clearRect(0, 0, canvasW, canvasH);

    // Frame Theme styling
    const colorTheme = frameColors.find(c => c.id === selectedFrameColor) || frameColors[0];
    ctx.fillStyle = colorTheme.bg;
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Draw layouts
    if (selectedLayout === '4_cut_strip') {
      const px = canvasW * 0.08;
      const pyGap = canvasH * 0.025;
      const pWidth = canvasW - (px * 2);
      const pHeight = (canvasH - (pyGap * 5)) / 4;

      for (let i = 0; i < 4; i++) {
        const targetY = pyGap + i * (pHeight + pyGap);
        const img = images[i];
        if (img) {
          ctx.drawImage(img, 0, 0, img.width, img.height, px, targetY, pWidth, pHeight);
          ctx.strokeStyle = colorTheme.border;
          ctx.lineWidth = 4;
          ctx.strokeRect(px, targetY, pWidth, pHeight);
        } else {
          ctx.fillStyle = '#e2e8f0';
          ctx.fillRect(px, targetY, pWidth, pHeight);
        }
      }
    } else if (selectedLayout === '2x2_grid') {
      const padX = 60;
      const padY = 60;
      const gap = 30;
      const cellW = (canvasW - (padX * 2) - gap) / 2;
      const cellH = cellW;

      const coords = [
        { x: padX, y: padY },
        { x: padX + cellW + gap, y: padY },
        { x: padX, y: padY + cellH + gap },
        { x: padX + cellW + gap, y: padY + cellH + gap }
      ];

      for (let i = 0; i < 4; i++) {
        const coord = coords[i];
        const img = images[i];
        if (img) {
          const minDim = Math.min(img.width, img.height);
          const sx = (img.width - minDim) / 2;
          const sy = (img.height - minDim) / 2;
          ctx.drawImage(img, sx, sy, minDim, minDim, coord.x, coord.y, cellW, cellH);
          ctx.strokeStyle = colorTheme.border;
          ctx.lineWidth = 4;
          ctx.strokeRect(coord.x, coord.y, cellW, cellH);
        } else {
          ctx.fillStyle = '#e2e8f0';
          ctx.fillRect(coord.x, coord.y, cellW, cellH);
        }
      }
    } else if (selectedLayout === '5_photo_combo') {
      const padX = 60;
      const topY = 60;
      const mainW = canvasW - (padX * 2);
      const mainH = mainW * (3/4);

      const mainImg = images[0];
      if (mainImg) {
        ctx.drawImage(mainImg, 0, 0, mainImg.width, mainImg.height, padX, topY, mainW, mainH);
        ctx.strokeStyle = colorTheme.border;
        ctx.lineWidth = 4;
        ctx.strokeRect(padX, topY, mainW, mainH);
      } else {
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(padX, topY, mainW, mainH);
      }

      const smallGap = 15;
      const smallW = (canvasW - (padX * 2) - (smallGap * 3)) / 4;
      const smallH = smallW;
      const smallY = topY + mainH + 40;

      for (let i = 0; i < 4; i++) {
        const coordX = padX + i * (smallW + smallGap);
        const img = images[i + 1];
        if (img) {
          const minDim = Math.min(img.width, img.height);
          const sx = (img.width - minDim) / 2;
          const sy = (img.height - minDim) / 2;
          ctx.drawImage(img, sx, sy, minDim, minDim, coordX, smallY, smallW, smallH);
          ctx.strokeStyle = colorTheme.border;
          ctx.lineWidth = 3;
          ctx.strokeRect(coordX, smallY, smallW, smallH);
        } else {
          ctx.fillStyle = '#e2e8f0';
          ctx.fillRect(coordX, smallY, smallW, smallH);
        }
      }
    } else {
      const pad = 60;
      const pWidth = canvasW - (pad * 2);
      const pHeight = pWidth;
      const targetY = 60;

      const img = images[0];
      if (img) {
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;
        ctx.drawImage(img, sx, sy, minDim, minDim, pad, targetY, pWidth, pHeight);
        ctx.strokeStyle = colorTheme.border;
        ctx.lineWidth = 4;
        ctx.strokeRect(pad, targetY, pWidth, pHeight);
      } else {
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(pad, targetY, pWidth, pHeight);
      }
    }

    // Bottom Caption and Date styling
    ctx.fillStyle = colorTheme.text;
    ctx.textAlign = 'center';
    
    let textY = canvasH - 110;
    let dateY = canvasH - 55;

    if (selectedLayout === '4_cut_strip') {
      textY = canvasH - 120;
      dateY = canvasH - 60;
    }

    const displayText = customBottomText.trim() || 'Kenangan Indah ✨';
    ctx.font = `bold ${canvasW * 0.045}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(displayText, canvasW / 2, textY);

    if (printDate) {
      const dateStr = new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '-');
      
      ctx.font = `${canvasW * 0.03}px monospace`;
      ctx.fillText(`📅 ${dateStr}`, canvasW / 2, dateY);
    }

    // Apply the selected decorative theme frame overlay on the final composite canvas (ensures outer designs are rendered beautifully at full size without cropping)
    if (selectedFrame && selectedFrame !== 'normal') {
      drawActiveFrame(ctx, canvasW, canvasH, selectedFrame, customBottomText);
    }

    setShowResultModal(true);

    // Auto-save the compiled collage to the Gallery History Sidebar instantly
    const dataUrl = canvas.toDataURL('image/png');
    const date = new Date();
    const formattedDate = date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) + `, ${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;

    const newPhoto: CapturedPhoto = {
      id: 'photo_' + Date.now(),
      imagePath: dataUrl,
      createdAt: formattedDate
    };

    onPhotoSaved(newPhoto);
    setSaveSuccess(true);

    // Auto-generate QR Code in the background immediately
    generateQRCodeShare(dataUrl);
  };

  // Compile layout + active stickers into high resolution image for export & share
  const getCompiledDataURL = (format: 'png' | 'jpeg'): string => {
    const mainCanvas = resultCanvasRef.current;
    if (!mainCanvas) return '';
    
    // Create high-res offscreen canvas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = mainCanvas.width;
    tempCanvas.height = mainCanvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return '';
    
    // Draw base compiled collage
    tempCtx.drawImage(mainCanvas, 0, 0);
    
    // Draw each placed sticker on top in high resolution
    placedStickers.forEach(sticker => {
      const xPos = (sticker.x / 100) * tempCanvas.width;
      const yPos = (sticker.y / 100) * tempCanvas.height;
      
      tempCtx.save();
      // scale based on composite canvas width to keep proportional resizing on all screen sizes
      const baseSize = tempCanvas.width * 0.08; 
      const fontSize = Math.round(baseSize * sticker.scale);
      
      tempCtx.font = `${fontSize}px Arial, sans-serif`;
      tempCtx.textAlign = 'center';
      tempCtx.textBaseline = 'middle';
      
      // Draw a subtle dropshadow for the emoji sticker
      tempCtx.shadowColor = 'rgba(0, 0, 0, 0.25)';
      tempCtx.shadowBlur = 6;
      tempCtx.shadowOffsetX = 1;
      tempCtx.shadowOffsetY = 2;
      
      tempCtx.fillText(sticker.emoji, xPos, yPos);
      tempCtx.restore();
    });
    
    return format === 'png' ? tempCanvas.toDataURL('image/png') : tempCanvas.toDataURL('image/jpeg', 0.92);
  };

  // Sticker & Decoration state manipulation helpers
  const addSticker = (emoji: string) => {
    const newSticker: PlacedSticker = {
      id: 'sticker_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      emoji,
      x: 50, // center
      y: 50, // center
      scale: 1.0
    };
    setPlacedStickers(prev => [...prev, newSticker]);
    setSelectedStickerId(newSticker.id);
  };

  const adjustStickerScale = (id: string, delta: number) => {
    setPlacedStickers(prev => prev.map(s => s.id === id ? {
      ...s,
      scale: Math.max(0.4, Math.min(3.0, s.scale + delta))
    } : s));
  };

  const deleteSticker = (id: string) => {
    setPlacedStickers(prev => prev.filter(s => s.id !== id));
    if (selectedStickerId === id) {
      setSelectedStickerId(null);
    }
  };

  const handleStickerStart = (e: React.MouseEvent | React.TouchEvent, stickerId: string) => {
    e.stopPropagation();
    setSelectedStickerId(stickerId);
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const sticker = placedStickers.find(s => s.id === stickerId);
    if (!sticker) return;
    
    // Target the specific wrapper container of the canvas for absolute bounding calculations
    const wrapper = document.getElementById('sticker-container-wrapper');
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    
    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      const curX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const curY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
      
      // Calculate percentage inside the wrapper boundaries
      const pctX = ((curX - rect.left) / rect.width) * 100;
      const pctY = ((curY - rect.top) / rect.height) * 100;
      
      setPlacedStickers(prev => prev.map(s => s.id === stickerId ? {
        ...s,
        x: Math.max(2, Math.min(98, pctX)),
        y: Math.max(2, Math.min(98, pctY))
      } : s));
    };
    
    const handleEnd = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
    
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
  };

  const downloadPhoto = () => {
    const dataUrl = getCompiledDataURL('png');
    if (!dataUrl) return;
    
    const link = document.createElement('a');
    link.download = `photobooth_${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const downloadPhotoAsJPG = () => {
    const dataUrl = getCompiledDataURL('jpeg');
    if (!dataUrl) return;
    
    const link = document.createElement('a');
    link.download = `photobooth_${Date.now()}.jpg`;
    link.href = dataUrl;
    link.click();
  };

  const generateQRCodeShare = async (dataUrl: string) => {
    setIsUploadingShare(true);
    try {
      const blobRes = await fetch(dataUrl);
      const blob = await blobRes.blob();
      const formData = new FormData();
      formData.append('file', blob, `photobooth_${Date.now()}.png`);

      // Try tmpfiles.org first
      try {
        const res = await fetch('https://tmpfiles.org/api/v1/upload', {
          method: 'POST',
          body: formData
        });
        const resData = await res.json();
        if (resData && resData.data && resData.data.url) {
          const directDownloadUrl = resData.data.url.replace('https://tmpfiles.org/', 'https://tmpfiles.org/dl/');
          setShareUrl(directDownloadUrl);
          setIsUploadingShare(false);
          return;
        }
      } catch (e) {
        console.warn("tmpfiles.org failed, trying file.io...", e);
      }

      // Fallback to file.io
      const fallbackRes = await fetch('https://file.io', {
        method: 'POST',
        body: formData
      });
      const fallbackData = await fallbackRes.json();
      if (fallbackData && fallbackData.success && fallbackData.link) {
        setShareUrl(fallbackData.link);
      } else {
        throw new Error("All cloud upload services failed");
      }
    } catch (err) {
      console.warn("Gagal mengunggah foto ke cloud share, mengaktifkan tautan fallback:", err);
      // Fallback local origin or safe base URL
      setShareUrl(window.location.origin + '?downloadFallback=' + Date.now());
    } finally {
      setIsUploadingShare(false);
    }
  };

  const saveToSimulatedDatabase = () => {
    // Already auto-saved when compiled! Show success directly
    setSaveSuccess(true);
  };

  const getActiveFilterCss = () => {
    const f = filters.find(x => x.id === selectedFilter);
    return f ? f.cssFilter : 'none';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-7xl mx-auto px-4 py-2">
      
      {/* LEFT SIDE: Active camera & shot review (8 columns on large screen) */}
      <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
        
        {/* Upper Camera Mode Toggles */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
              Sumber Tangkapan Kamera
            </h2>
            <p className="text-[10px] text-slate-400 mt-0.5">Pilih kamera webcam atau kamera virtual jika akses ditolak.</p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => handleTabChange('physical')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'physical'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Kamera Webcam</span>
            </button>
            
            <button
              onClick={() => handleTabChange('virtual')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'virtual'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kamera Virtual / Upload</span>
            </button>
          </div>
        </div>

        {/* Studio Viewport Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden" id="studio-viewport-card">
          
          <div className="w-full aspect-[4/3] bg-slate-950 rounded-2xl relative overflow-hidden shadow-inner flex items-center justify-center select-none">
            
            {/* Hidden physical camera video helper used to feed the live canvas */}
            <video 
              ref={videoRef}
              autoPlay 
              playsInline 
              muted
              className="hidden"
            ></video>

            {/* If using physical camera and there is an error, display error overlay */}
            {!isVirtual && cameraError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-900 text-white z-20">
                <span className="text-4xl mb-3">⚠️</span>
                <p className="font-bold text-sm text-slate-100">Kamera Fisik Terblokir atau Tidak Ditemukan</p>
                <p className="text-xs text-slate-400 mt-1.5 max-w-sm leading-relaxed">
                  Browser memblokir akses kamera (karena dijalankan di dalam preview iframe aman).
                </p>
                <button
                  onClick={() => handleTabChange('virtual')}
                  className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-xl transition shadow-md"
                >
                  Beralih ke Kamera Virtual ✨
                </button>
              </div>
            )}

            {/* Live Interactive Canvas Viewport with Real-time Filters & Overlays */}
            <canvas
              ref={virtualCanvasRef}
              width={640}
              height={480}
              className="w-full h-full object-cover"
            ></canvas>

            {/* Simulated overlay card highlighting the layout slots configuration */}
            {isCapturing && (
              <div className="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur-sm border border-slate-800 text-white text-[10px] px-3 py-1.5 rounded-full flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                <span className="font-bold tracking-wide">
                  Slot ke-{activeSlotIndex + 1} dari {layouts.find(l => l.id === selectedLayout)?.slots || 1}
                </span>
              </div>
            )}

            {/* Countdowns overlay */}
            {countdown !== null && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-9xl font-black text-white drop-shadow-[0_8px_32px_rgba(0,0,0,0.85)] select-none transform transition-all duration-300">
                  {countdown}
                </span>
                <span className="text-white text-[11px] font-bold tracking-wider uppercase mt-6 bg-black/60 px-4 py-1.5 rounded-full backdrop-blur-sm shadow-md">
                  Bersiaplah! Jepretan otomatis...
                </span>
              </div>
            )}

            {/* Visual Flash Effect */}
            {showFlash && (
              <div className="absolute inset-0 bg-white z-40 transition-all duration-75"></div>
            )}

            {/* SHOT REVIEW OVERLAY (Lanjutkan / Ulangi Jepretan) */}
            {reviewingPhoto && (
              <div className="absolute inset-0 bg-slate-950/95 z-30 flex flex-col items-center justify-center p-4">
                <p className="text-white text-xs font-bold tracking-widest uppercase mb-4 text-center">
                  Tinjau Jepretan Slot ke-{activeSlotIndex + 1}
                </p>
                <div className="w-full max-w-sm aspect-[4/3] bg-black rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
                  <img 
                    src={reviewingPhoto} 
                    alt="Review capture" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex gap-4 mt-6 w-full max-w-xs">
                  <button
                    type="button"
                    onClick={handleRetakePhoto}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition border border-slate-700 flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Ulangi Foto</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleAcceptPhoto}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg shadow-teal-500/20"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Lanjutkan</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Trigger capture button and layout compilation triggers */}
          <div className="w-full flex justify-center gap-4 mt-5 flex-wrap">
            <button 
              disabled={isCapturing || !!reviewingPhoto}
              onClick={startCaptureSequence}
              className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all flex items-center gap-2.5 text-xs tracking-wider uppercase"
            >
              <Camera className="w-4 h-4" />
              <span>Mulai Jepret Beruntun ✨</span>
            </button>

            {capturedSlots.length > 0 && !isCapturing && (
              <button 
                type="button"
                onClick={() => {
                  compileFinalLayout(capturedSlots);
                  setShowResultModal(true);
                }}
                className="px-6 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-teal-100 hover:shadow-teal-200 transition-all flex items-center gap-2.5 text-xs tracking-wider uppercase"
              >
                <span>Tampilkan Hasil Sesi Foto 📸</span>
              </button>
            )}
          </div>
        </div>

        {/* Animated customizers if using virtual camera */}
        {isVirtual && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
            <div>
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Pilih Latar Belakang Virtual</span>
              </h3>
              <p className="text-[10px] text-slate-400">Gunakan latar belakang seni bawaan atau unggah milik sendiri.</p>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { id: 'sunset', label: '🌅 Golden Sunset' },
                { id: 'cyberpunk', label: '🌌 Cyberpunk Grid' },
                { id: 'aurorapastel', label: '🌈 Aura Pastel' },
                { id: 'disco', label: '🕺 Disco Beats' }
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() => setVirtualBackdrop(b.id as BackdropType)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold border transition-all ${
                    virtualBackdrop === b.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {b.label}
                </button>
              ))}

              <label className={`cursor-pointer px-3.5 py-2 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
                virtualBackdrop === 'custom'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              }`}>
                <Upload className="w-3.5 h-3.5" />
                <span>{customImageSrc ? 'Foto Kustom Aktif' : 'Unggah Foto'}</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="hidden" 
                />
              </label>
            </div>
          </div>
        )}

        {/* Real-time filters slider */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5 uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Pilih Efek Filter Kreatif</span>
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`flex-none px-4 py-2 text-xs font-bold rounded-full border transition whitespace-nowrap ${
                  selectedFilter === f.id
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* RIGHT SIDE: Layout Customizers & Styling Sidebars (4 columns) */}
      <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
        
        {/* Layout Select Panel */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              1. Pilih Layout Tata Letak
            </h3>
            <p className="text-[10px] text-slate-400">Pilih format susunan hasil foto grid.</p>
          </div>

          <div className="flex flex-col gap-2.5">
            {layouts.map((l) => (
              <button
                key={l.id}
                onClick={() => setSelectedLayout(l.id as any)}
                className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center gap-4 ${
                  selectedLayout === l.id
                    ? 'border-indigo-600 bg-indigo-50/20 ring-1 ring-indigo-500/25 shadow-sm'
                    : 'border-slate-150 bg-slate-50/25 hover:bg-slate-50'
                }`}
              >
                {renderLayoutVisual(l.id)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-800">{l.name}</h4>
                    <span className="text-[9px] bg-indigo-100/70 text-indigo-700 px-1.5 py-0.5 rounded-full font-bold">
                      {l.slots} Foto
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal">{l.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Frame Design Selection Panel */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              2. Pilih Desain Bingkai (Frame)
            </h3>
            <p className="text-[10px] text-slate-400">Pilih tema dekorasi bingkai unik untuk photostrip Anda.</p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
            {frames.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFrame(f.id)}
                className={`p-2 rounded-xl border text-left transition-all flex flex-col justify-between h-[115px] ${
                  selectedFrame === f.id
                    ? 'border-indigo-600 bg-indigo-50/25 ring-1 ring-indigo-500/20 shadow-sm'
                    : 'border-slate-100 bg-white hover:bg-slate-50'
                }`}
              >
                {renderFrameThumbnail(f.id)}
                <div className="mt-1 w-full">
                  <span className="text-[10px] font-bold text-slate-700 block truncate">{f.name}</span>
                  <span className="text-[8px] text-slate-400 block truncate">{f.category}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Color Sub-option */}
          <div className="border-t border-slate-100 pt-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Warna Bingkai Dasar</span>
            <div className="grid grid-cols-4 gap-2">
              {frameColors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedFrameColor(c.id)}
                  title={c.name}
                  className={`p-1.5 rounded-lg border text-center transition-all flex items-center justify-center gap-1.5 ${
                    selectedFrameColor === c.id
                      ? 'border-indigo-600 bg-indigo-50/20 ring-1 ring-indigo-500/20'
                      : 'border-slate-100 bg-white hover:bg-slate-50'
                  }`}
                >
                  <span 
                    className="w-4 h-4 rounded-full border border-slate-200 block" 
                    style={{ backgroundColor: c.bg }}
                  ></span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom text captions & dates */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              3. Sentuhan Teks & Tanggal
            </h3>
            <p className="text-[10px] text-slate-400">Tulis teks kenangan Anda di bagian bawah strip.</p>
          </div>

          <div className="space-y-3">
            <div>
              <label htmlFor="customBottomTextInput" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Teks Kustom
              </label>
              <input 
                id="customBottomTextInput"
                type="text" 
                maxLength={30}
                value={customBottomText}
                onChange={(e) => setCustomBottomText(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Kenangan Indah ✨"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <span className="text-xs font-bold text-slate-700 block">Cetak Tanggal Otomatis</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Tampilkan tanggal hari ini di foto</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={printDate} 
                  onChange={(e) => setPrintDate(e.target.checked)} 
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>

      </div>

      {/* FINAL COMPILATION OVERLAY MODAL */}
      {showResultModal && (
        <div className="fixed inset-0 bg-slate-950/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden transform scale-100 transition-all flex flex-col max-h-[90vh]">
            
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Hasil Jepretan Studio 🎉</h3>
                <p className="text-[11px] text-slate-400">Tinjau hasil layout grid photobooth Anda.</p>
              </div>
              <button 
                onClick={() => setShowResultModal(false)} 
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center text-xs transition"
              >
                ✕
              </button>
            </div>

            {/* Compiled Strip Scrollable Canvas Container with Sticker Layer */}
            <div 
              className="p-4 flex-1 overflow-y-auto bg-slate-50 flex flex-col items-center justify-center min-h-[350px]"
              onClick={() => setSelectedStickerId(null)}
            >
              <div className="bg-white p-3 rounded-2xl shadow-md border border-slate-200/60 max-w-[280px] w-full">
                <div 
                  id="sticker-container-wrapper" 
                  className="relative w-full overflow-hidden select-none"
                  style={{ touchAction: 'none' }}
                >
                  <canvas 
                    ref={resultCanvasRef} 
                    className="w-full h-auto object-contain rounded-lg pointer-events-none"
                  ></canvas>
                  
                  {/* Real-time interactive stickers layer */}
                  {placedStickers.map((sticker) => (
                    <div
                      key={sticker.id}
                      onMouseDown={(e) => handleStickerStart(e, sticker.id)}
                      onTouchStart={(e) => handleStickerStart(e, sticker.id)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStickerId(sticker.id);
                      }}
                      className={`absolute cursor-move select-none p-1 flex items-center justify-center transition-all ${
                        selectedStickerId === sticker.id 
                          ? 'ring-2 ring-indigo-500 ring-offset-2 rounded-lg bg-indigo-50/20 shadow-sm z-30 scale-110' 
                          : 'hover:scale-105 z-20'
                      }`}
                      style={{
                        left: `${sticker.x}%`,
                        top: `${sticker.y}%`,
                        transform: 'translate(-50%, -50%)',
                        fontSize: `${28 * sticker.scale}px`,
                        touchAction: 'none'
                      }}
                    >
                      <span>{sticker.emoji}</span>
                      
                      {/* Resize & delete controls appearing when sticker is selected */}
                      {selectedStickerId === sticker.id && (
                        <div 
                          className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white text-[9px] rounded-full px-2 py-0.5 flex items-center gap-2 shadow-lg border border-slate-700/50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button 
                            type="button"
                            onClick={() => adjustStickerScale(sticker.id, 0.15)}
                            className="hover:text-indigo-400 font-bold px-1 transition-all"
                            title="Perbesar"
                          >
                            ➕
                          </button>
                          <button 
                            type="button"
                            onClick={() => adjustStickerScale(sticker.id, -0.15)}
                            className="hover:text-indigo-400 font-bold px-1 transition-all"
                            title="Perkecil"
                          >
                            ➖
                          </button>
                          <span className="w-[1px] h-3 bg-slate-700"></span>
                          <button 
                            type="button"
                            onClick={() => deleteSticker(sticker.id)}
                            className="text-rose-400 hover:text-rose-300 font-bold px-1 transition-all"
                            title="Hapus"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticker Decorator Tray */}
            <div className="p-4 bg-slate-50 border-t border-slate-100/80">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                🎨 Tambah Stiker & Dekorasi Interaktif (Bisa Digeser!)
              </span>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
                {stickerTemplates.map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => addSticker(emoji)}
                    className="flex-none w-10 h-10 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl flex items-center justify-center text-lg shadow-sm transition-all active:scale-90"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-[9px] text-slate-400 leading-relaxed max-w-[250px]">
                  Pilih stiker di atas, geser langsung dengan jari/sentuhan Anda di foto. Gunakan kontrol ➕/➖ dan ✕ untuk ukuran & hapus.
                </p>
                
                {placedStickers.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const freshDataUrl = getCompiledDataURL('png');
                      generateQRCodeShare(freshDataUrl);
                    }}
                    className="text-[9px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/70 px-2 py-1 rounded-lg transition-all flex items-center gap-1 active:scale-95"
                  >
                    🔄 Update QR Stiker
                  </button>
                )}
              </div>
            </div>

            {/* QR Code sharing interface with direct download link */}
            {shareUrl && (
              <div className="p-4 bg-indigo-50/80 border-t border-b border-indigo-100 flex items-center gap-4">
                <div className="w-20 h-20 bg-white p-1 rounded-xl shadow-sm border border-slate-200/50 flex items-center justify-center flex-shrink-0">
                  {isUploadingShare ? (
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[8px] text-slate-400 mt-1 font-bold">Uploading...</span>
                    </div>
                  ) : (
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareUrl)}`}
                      alt="QR Code Unduhan"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                    <span>📲 Scan QR Code Unduh di HP</span>
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                    Pindai kode QR untuk membuka dan mengunduh foto ini langsung ke ponsel Anda.
                  </p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                      className="bg-white border border-slate-200 text-[9px] px-2 py-0.5 rounded text-slate-500 max-w-[150px] truncate select-all focus:outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(shareUrl);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] font-bold rounded transition whitespace-nowrap"
                    >
                      {copied ? 'Tersalin! ✅' : 'Salin'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Actions Panel */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-3">
              {/* Auto Save Notification Badge */}
              <div className="bg-teal-50 border border-teal-200 text-teal-800 rounded-xl p-2.5 text-center text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm">
                <Check className="w-4 h-4 text-teal-600 animate-bounce" />
                <span>Foto otomatis tersimpan di Riwayat Galeri!</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={downloadPhoto}
                  className="py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh PNG</span>
                </button>

                <button 
                  onClick={downloadPhotoAsJPG}
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh JPG</span>
                </button>
              </div>
              
              {/* Reset: Hapus & Buat Baru button control spanning full width */}
              <button
                onClick={() => {
                  setCapturedSlots([]);
                  setReviewingPhoto(null);
                  setActiveSlotIndex(0);
                  setShowResultModal(false);
                  setIsCapturing(false);
                  setPlacedStickers([]);
                  setSelectedStickerId(null);
                }}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 border border-slate-200/50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Hapus & Buat Baru 🔄</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
