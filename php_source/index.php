<?php
/**
 * Halaman Utama - Studio Photobooth Kreatif
 */
require_once 'config.php';

// Proteksi halaman: pastikan pengguna sudah login
require_login();

$userId = $_SESSION['user_id'];
$username = $_SESSION['username'];

// Ambil riwayat foto pengguna dari database
$photos = [];
try {
    $stmt = $pdo->prepare("SELECT * FROM photos WHERE user_id = ? ORDER BY id DESC");
    $stmt->execute([$userId]);
    $photos = $stmt->fetchAll();
} catch (PDOException $e) {
    // Silent error atau tampilkan log sederhana
    $db_error = "Gagal memuat galeri: " . $e->getMessage();
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Studio - Photobooth Kreatif</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Caveat:wght@700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: #f8f9fa;
        }
        .font-cursive {
            font-family: 'Caveat', cursive;
        }
        .font-serif-elegant {
            font-family: 'Playfair Display', serif;
        }
        /* Kustomisasi scrollbar */
        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        ::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        ::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }
    </style>
</head>
<body class="min-h-screen flex flex-col bg-slate-50 text-slate-800">

    <!-- Top Navigation Bar -->
    <header class="bg-white border-b border-slate-100 sticky top-0 z-40 px-6 py-4 shadow-sm">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
            <div class="flex items-center gap-3">
                <span class="text-2xl">📸</span>
                <div>
                    <h1 class="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Photobooth Studio</h1>
                    <p class="text-xs text-slate-400">Kreasi Foto Instan & Modern</p>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <div class="text-right hidden sm:block">
                    <p class="text-xs text-slate-400">Halo, Fotografer!</p>
                    <p class="text-sm font-semibold text-slate-700">@<?php echo htmlspecialchars($username); ?></p>
                </div>
                <div class="h-8 w-px bg-slate-200 hidden sm:block"></div>
                <a href="logout.php" class="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-medium text-xs transition duration-150">
                    Keluar Akun
                </a>
            </div>
        </div>
    </header>

    <!-- Main Workspace Dashboard -->
    <main class="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Left Column: Studio Controller & Preview (8/12) -->
        <section class="lg:col-span-8 flex flex-col gap-6">
            
            <!-- Camera / Photo Stream Container -->
            <div class="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
                
                <!-- Webcam Live Feed Window with Frame Overlay Preview -->
                <div id="cameraContainer" class="w-full aspect-[4/3] max-w-xl bg-slate-900 rounded-2xl relative overflow-hidden shadow-inner flex items-center justify-center">
                    
                    <!-- HTML5 Live Video Stream -->
                    <video id="webcam" autoplay playsinline class="w-full h-full object-cover scale-x-[-1] transition-all duration-300"></video>
                    
                    <!-- Real-Time CSS Filter Preview Overlay (Diterapkan lewat JS) -->
                    <div id="filterOverlay" class="absolute inset-0 pointer-events-none mix-blend-normal"></div>
                    
                    <!-- Dynamic Frame Canvas Overlay (Pratinjau Frame secara realtime) -->
                    <canvas id="previewFrameCanvas" class="absolute inset-0 w-full h-full pointer-events-none z-10"></canvas>
                    
                    <!-- Countdown Timer Text Overlay -->
                    <div id="countdownOverlay" class="absolute inset-0 bg-black/40 z-20 hidden flex items-center justify-center">
                        <span id="countdownNumber" class="text-8xl font-black text-white scale-90 animate-ping">3</span>
                    </div>

                    <!-- No Camera Fallback Alert -->
                    <div id="cameraFallback" class="absolute inset-0 bg-slate-900 z-10 flex flex-col items-center justify-center p-6 text-center text-white hidden">
                        <span class="text-4xl mb-3">⚠️</span>
                        <p class="font-semibold text-lg">Akses Kamera Diperlukan</p>
                        <p class="text-xs text-slate-400 mt-1 max-w-xs">Pastikan perangkat Anda memiliki kamera aktif dan Anda telah mengizinkan akses kamera di peramban.</p>
                        <button onclick="initCamera()" class="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition">
                            Coba Hubungkan Ulang
                        </button>
                    </div>

                    <!-- Multi-Capture Progress Dot Overlay (Untuk Strip Mode) -->
                    <div id="stripCaptureIndicator" class="absolute top-4 left-4 z-20 bg-black/60 px-3 py-1.5 rounded-full text-white text-xs font-semibold flex items-center gap-2 hidden">
                        <span class="inline-block w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                        <span id="stripStepText">Mengambil foto 1 dari 3</span>
                    </div>
                </div>

                <!-- Custom Caption Input (Khanya Muncul jika memilih Polaroid Frame) -->
                <div id="captionControl" class="w-full max-w-xl mt-4 hidden">
                    <label for="polaroidText" class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Teks Kustom Polaroid</label>
                    <input type="text" id="polaroidText" maxlength="30" value="Kenangan Manis ✨" 
                           class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                           placeholder="Tulis caption polaroid di sini...">
                </div>

                <!-- Action Controls Panel -->
                <div class="w-full flex flex-wrap justify-center gap-3 mt-5">
                    <!-- Ambil Foto -->
                    <button id="btnCapture" onclick="startCapture()" 
                            class="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-md shadow-indigo-100 hover:shadow-indigo-200 transition flex items-center gap-2.5 text-sm">
                        <span>📸</span> Ambil Foto (3s Timer)
                    </button>
                    
                    <!-- Reset & Retake (Hidden by default) -->
                    <button id="btnRetake" onclick="resetStudio()" 
                            class="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl transition hidden text-sm">
                        Batal & Foto Ulang
                    </button>
                </div>
            </div>

            <!-- Filters Selection Widget -->
            <div class="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
                <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Pilih Filter Visual (Real-Time)</h3>
                <div class="flex gap-3 overflow-x-auto pb-2 snap-x scroll-smooth" id="filtersList">
                    <!-- Filter items dynamically generated by JavaScript -->
                </div>
            </div>

            <!-- Frames Selection Widget -->
            <div class="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
                <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Pilih Bingkai / Frame Kreatif</h3>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3" id="framesList">
                    <!-- Frame options dynamically generated by JavaScript -->
                </div>
            </div>

        </section>

        <!-- Right Column: Gallery & History Sidebar (4/12) -->
        <section class="lg:col-span-4 flex flex-col gap-6">
            
            <!-- User Profile Quick Card -->
            <div class="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-100 relative overflow-hidden">
                <div class="absolute -right-6 -bottom-6 text-9xl opacity-10">📸</div>
                <p class="text-xs text-indigo-100">Akun Pengguna Terhubung</p>
                <h3 class="text-xl font-bold mt-1">@<?php echo htmlspecialchars($username); ?></h3>
                <p class="text-xs text-indigo-200 mt-0.5"><?php echo htmlspecialchars($_SESSION['email']); ?></p>
                <div class="mt-4 flex gap-2">
                    <span class="px-2.5 py-1 bg-white/20 rounded-md text-[10px] font-bold tracking-wider uppercase">InfinityFree Ready</span>
                    <span class="px-2.5 py-1 bg-white/20 rounded-md text-[10px] font-bold tracking-wider uppercase">MySQL DB Active</span>
                </div>
            </div>

            <!-- Saved Photos History Gallery -->
            <div class="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex-1 flex flex-col min-h-[400px]">
                <div class="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                    <h3 class="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <span>🖼️</span> Galeri Hasil Foto Anda
                    </h3>
                    <span id="galleryCount" class="text-xs font-bold px-2.5 py-1 bg-slate-100 rounded-full text-slate-500">
                        <?php echo count($photos); ?> Foto
                    </span>
                </div>

                <!-- Empty State -->
                <div id="galleryEmptyState" class="flex-1 flex flex-col items-center justify-center p-6 text-center <?php echo count($photos) > 0 ? 'hidden' : ''; ?>">
                    <span class="text-4xl mb-2">✨</span>
                    <p class="font-medium text-slate-600 text-sm">Belum Ada Foto Disimpan</p>
                    <p class="text-xs text-slate-400 mt-1 max-w-[200px]">Ayo ambil foto pertamamu, pilih frame favorit, dan simpan ke galeri server!</p>
                </div>

                <!-- Photos List Grid -->
                <div id="sidebarGallery" class="grid grid-cols-2 gap-3 overflow-y-auto max-h-[480px] pr-1 <?php echo count($photos) === 0 ? 'hidden' : ''; ?>">
                    <?php foreach ($photos as $photo): ?>
                        <div class="group aspect-square rounded-xl overflow-hidden bg-slate-100 relative border border-slate-200 shadow-sm transition hover:shadow-md cursor-pointer" 
                             onclick="showModalPhoto('<?php echo htmlspecialchars($photo['image_path']); ?>', '<?php echo htmlspecialchars(date('d M Y, H:i', strtotime($photo['created_at']))); ?>')">
                            <img src="<?php echo htmlspecialchars($photo['image_path']); ?>" 
                                 alt="Photobooth Snap" 
                                 class="w-full h-full object-cover transform transition duration-300 group-hover:scale-105"
                                 referrerpolicy="no-referrer">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-200 p-2 flex items-end">
                                <p class="text-[10px] text-white font-medium truncate w-full"><?php echo date('d M Y', strtotime($photo['created_at'])); ?></p>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>

        </section>
    </main>

    <!-- Modal: Photo Capture View & Action (Save & Download) -->
    <div id="savePhotoModal" class="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 hidden backdrop-blur-sm">
        <div class="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden transform scale-95 transition-all duration-300">
            
            <div class="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                    <h3 class="font-bold text-slate-800 text-base">Hore! Fotomu Berhasil Diproses 🥳</h3>
                    <p class="text-xs text-slate-400">Silakan tinjau, unduh, atau simpan langsung ke server.</p>
                </div>
                <button onclick="closeSaveModal()" class="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center text-sm transition">
                    ✕
                </button>
            </div>

            <div class="p-6 flex flex-col items-center justify-center bg-slate-100/50">
                <!-- Rendered Canvas Result Container -->
                <div class="w-full max-w-sm aspect-square bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200 flex items-center justify-center relative">
                    <canvas id="renderedCanvas" class="w-full h-full object-contain"></canvas>
                </div>
            </div>

            <div class="p-5 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                <!-- Simpan ke Galeri Server (AJAX) -->
                <button id="btnSaveToGallery" onclick="saveToDatabase()"
                        class="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2">
                    <span>💾</span> Simpan ke Galeri Server
                </button>
                
                <!-- Download ke Perangkat Lokal -->
                <button id="btnDownloadLocal" onclick="downloadImage()"
                        class="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2">
                    <span>📥</span> Unduh ke HP/Laptop
                </button>
            </div>
        </div>
    </div>

    <!-- Modal: View Saved Photo Details -->
    <div id="viewPhotoModal" class="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 hidden backdrop-blur-sm">
        <div class="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden transform scale-95 transition-all duration-300">
            <div class="p-4 border-b border-slate-100 flex justify-between items-center">
                <span id="detailDate" class="text-xs font-bold text-slate-400 uppercase tracking-wider">Tanggal Foto</span>
                <button onclick="closeViewModal()" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs transition">
                    ✕
                </button>
            </div>
            <div class="p-4 bg-slate-50 flex items-center justify-center">
                <img id="detailImg" src="" alt="Detail Saved Photo" class="max-w-full max-h-[400px] object-contain rounded-xl shadow-md border border-slate-200" referrerpolicy="no-referrer">
            </div>
            <div class="p-4 flex gap-3">
                <a id="btnDetailDownload" href="" download="photobooth_captured.png"
                   class="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs text-center transition">
                    Unduh Foto Lagi
                </a>
                <button onclick="closeViewModal()" class="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition">
                    Tutup
                </button>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-white border-t border-slate-100 py-6 mt-12 text-center text-xs text-slate-400">
        <div class="max-w-7xl mx-auto px-4">
            <p>Photobooth Studio &copy; 2026. Dioptimalkan untuk PHP, MySQL, Canvas API, dan hosting gratis InfinityFree.</p>
        </div>
    </footer>


    <!-- ============================================ -->
    <!-- JAVASCRIPT CODE FOR CAMERA, CANVAS, FILTERS, FRAMES -->
    <!-- ============================================ -->
    <script>
        // State Sesi & Elemen
        const video = document.getElementById('webcam');
        const cameraContainer = document.getElementById('cameraContainer');
        const previewFrameCanvas = document.getElementById('previewFrameCanvas');
        const previewCtx = previewFrameCanvas.getContext('2d');
        const renderedCanvas = document.getElementById('renderedCanvas');
        const renderedCtx = renderedCanvas.getContext('2d');
        const countdownOverlay = document.getElementById('countdownOverlay');
        const countdownNumber = document.getElementById('countdownNumber');
        const cameraFallback = document.getElementById('cameraFallback');
        const captionControl = document.getElementById('captionControl');
        const polaroidText = document.getElementById('polaroidText');
        
        let localStream = null;
        let selectedFilter = 'normal';
        let selectedFrame = 'polaroid_classic';
        let isCapturing = false;

        // Data filter-filter visual (menggunakan standard CSS filters)
        const filters = [
            { id: 'normal', name: 'Normal', css: 'none' },
            { id: 'grayscale', name: 'Grayscale', css: 'grayscale(100%)' },
            { id: 'sepia', name: 'Sepia', css: 'sepia(100%)' },
            { id: 'vintage', name: 'Vintage Warm', css: 'sepia(40%) saturate(140%) contrast(110%) hue-rotate(-10deg)' },
            { id: 'cold', name: 'Cold Cyan', css: 'contrast(105%) saturate(110%) hue-rotate(180deg) sepia(20%)' },
            { id: 'bright', name: 'Brightness', css: 'brightness(125%) contrast(105%)' },
            { id: 'contrast', name: 'Contrast', css: 'contrast(150%) brightness(95%)' },
            { id: 'invert', name: 'Invert', css: 'invert(100%)' },
            { id: 'blur', name: 'Soft Blur', css: 'blur(1.5px)' }
        ];

        // Daftar 8 Frame Kreatif Modern
        const frames = [
            { id: 'polaroid_classic', name: 'Polaroid Klasik', category: 'Polaroid', desc: 'Sederhana dengan area teks tulis tangan' },
            { id: 'retro_y2k', name: 'Retro Neon Y2K', category: 'Retro / Neon', desc: 'Gradasi ungu-pink dengan corak bintang' },
            { id: 'elegant_gold', name: 'Minimalis Gold', category: 'Elegant', desc: 'Bingkai garis ganda emas tipis bersih' },
            { id: 'floral_vibe', name: 'Aesthetic Floral', category: 'Decorative', desc: 'Hiasan ranting daun hijau estetik' },
            { id: 'birthday_party', name: 'Tematik Birthday', category: 'Celebration', desc: 'Kue ulang tahun, balon, & konfeti' },
            { id: 'cyberpunk_sys', name: 'Cyberpunk Grid', category: 'Sci-Fi', desc: 'Sistem UI fiksi dengan warna hijau neon' },
            { id: 'pastel_kawaii', name: 'Pastel Cute', category: 'Kawaii', desc: 'Bintang kuning pastel dengan awan imut' },
            { id: 'multiplex_strip', name: '3-Photo Strip', category: 'Multiplex', desc: 'Tiga baris foto vertikal film bioskop' }
        ];

        // Multi-Capture Snapshot Cache (Untuk mode 3-Photo Strip)
        let capturedSnapshots = [];

        // 1. Inisialisasi Kamera Webcam
        async function initCamera() {
            try {
                if (localStream) {
                    localStream.getTracks().forEach(track => track.stop());
                }
                
                // Minta akses video dengan resolusi ideal
                localStream = await navigator.mediaDevices.getUserMedia({
                    video: { 
                        width: { ideal: 1080 },
                        height: { ideal: 1080 },
                        facingMode: 'user' 
                    },
                    audio: false
                });
                
                video.srcObject = localStream;
                cameraFallback.classList.add('hidden');
                video.classList.remove('hidden');
                
                // Sesuaikan ukuran Canvas Pratinjau Frame secara realtime setelah video termuat
                video.onloadedmetadata = () => {
                    resizePreviewCanvas();
                };
            } catch (err) {
                console.error("Gagal mendapatkan akses kamera: ", err);
                cameraFallback.classList.remove('hidden');
                video.classList.add('hidden');
            }
        }

        function resizePreviewCanvas() {
            previewFrameCanvas.width = video.videoWidth || 640;
            previewFrameCanvas.height = video.videoHeight || 480;
            drawActiveFrameOnCanvas(previewCtx, previewFrameCanvas.width, previewFrameCanvas.height, selectedFrame, true);
        }

        // Jalankan resizer saat resize jendela
        window.addEventListener('resize', () => {
            if (localStream) {
                resizePreviewCanvas();
            }
        });

        // 2. Render Panel Pilihan Filter & Frame
        function renderControls() {
            // Render Filters
            const filtersContainer = document.getElementById('filtersList');
            filtersContainer.innerHTML = '';
            filters.forEach(f => {
                const item = document.createElement('button');
                item.className = `flex-none snap-center px-4 py-2 text-xs font-semibold rounded-full border transition duration-150 whitespace-nowrap ${
                    selectedFilter === f.id 
                    ? 'bg-indigo-600 border-indigo-600 text-white' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`;
                item.innerText = f.name;
                item.onclick = () => selectFilter(f.id);
                filtersContainer.appendChild(item);
            });

            // Render Frames
            const framesContainer = document.getElementById('framesList');
            framesContainer.innerHTML = '';
            frames.forEach(fr => {
                const item = document.createElement('button');
                item.className = `flex flex-col items-start p-3.5 text-left rounded-2xl border transition duration-150 ${
                    selectedFrame === fr.id 
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm' 
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`;
                item.innerHTML = `
                    <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-600">${fr.category}</span>
                    <span class="text-xs font-bold text-slate-800 mt-0.5">${fr.name}</span>
                    <span class="text-[10px] text-slate-400 mt-1 line-clamp-1">${fr.desc}</span>
                `;
                item.onclick = () => selectFrame(fr.id);
                framesContainer.appendChild(item);
            });
        }

        function selectFilter(filterId) {
            selectedFilter = filterId;
            const activeFilter = filters.find(f => f.id === filterId);
            
            // Terapkan filter visual CSS ke elemen video
            video.style.filter = activeFilter ? activeFilter.css : 'none';
            
            renderControls();
        }

        function selectFrame(frameId) {
            selectedFrame = frameId;
            
            // Tampilkan/sembunyikan input teks polaroid berdasarkan frame yang dipilih
            if (frameId === 'polaroid_classic') {
                captionControl.classList.remove('hidden');
            } else {
                captionControl.classList.add('hidden');
            }
            
            // Gambar ulang overlay frame di preview canvas
            drawActiveFrameOnCanvas(previewCtx, previewFrameCanvas.width, previewFrameCanvas.height, frameId, true);
            renderControls();
        }

        // Teks caption polaroid memicu gambar ulang real-time
        polaroidText.addEventListener('input', () => {
            if (selectedFrame === 'polaroid_classic') {
                drawActiveFrameOnCanvas(previewCtx, previewFrameCanvas.width, previewFrameCanvas.height, selectedFrame, true);
            }
        });


        // ===================================================
        // MODUL GAMBAR FRAME DENGAN CANVAS API (DINAMIS & INDEPENDEN)
        // ===================================================
        function drawActiveFrameOnCanvas(ctx, width, height, frameId, isPreview = false) {
            ctx.clearRect(0, 0, width, height);
            
            if (frameId === 'polaroid_classic') {
                // 1. POLAROID CLASSIC
                // Sisi bawah lebih lebar untuk teks kustom
                const bottomGap = height * 0.18;
                const borderSize = width * 0.05;
                
                // Gambar border putih
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, width, height);
                
                // Tambahkan sedikit bayangan dalam bingkai foto
                ctx.strokeStyle = '#e2e8f0';
                ctx.lineWidth = 1;
                ctx.strokeRect(borderSize, borderSize, width - (borderSize * 2), height - borderSize - bottomGap);
                
                // Gambar Teks Cursive / Polaroid Caption di bawah
                ctx.fillStyle = '#1e293b';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                // Ukuran font adaptif terhadap lebar canvas
                const fontSize = Math.round(width * 0.05);
                ctx.font = `bold ${fontSize}px 'Caveat', 'Playfair Display', cursive`;
                
                const textVal = polaroidText.value || "Studio Memory ✨";
                ctx.fillText(textVal, width / 2, height - (bottomGap / 2));
                
            } else if (frameId === 'retro_y2k') {
                // 2. RETRO Y2K NEON GRADIENT
                const border = Math.round(width * 0.04);
                
                // Gradasi Ungu-Pink Neon yang Menawan
                const grad = ctx.createLinearGradient(0, 0, width, height);
                grad.addColorStop(0, '#ff007f');
                grad.addColorStop(0.5, '#7f00ff');
                grad.addColorStop(1, '#01f9ff');
                
                ctx.strokeStyle = grad;
                ctx.lineWidth = border;
                ctx.strokeRect(border/2, border/2, width - border, height - border);
                
                // Gambar dekorasi bintang retro (Y2K style)
                drawY2KStar(ctx, border * 2, border * 2, border * 0.8, '#ffffff');
                drawY2KStar(ctx, width - (border * 2), border * 2, border * 0.8, '#ffffff');
                drawY2KStar(ctx, border * 2, height - (border * 2.5), border * 0.8, '#ffffff');
                drawY2KStar(ctx, width - (border * 2), height - (border * 2.5), border * 0.8, '#ffffff');
                
                // Teks Gaya Retro Y2K
                ctx.fillStyle = '#ffffff';
                ctx.font = `bold ${Math.round(width * 0.035)}px 'Plus Jakarta Sans', sans-serif`;
                ctx.textAlign = 'center';
                ctx.shadowColor = '#ff007f';
                ctx.shadowBlur = 10;
                ctx.fillText('⚡ RETRO SHOT 2000 ⚡', width / 2, height - (border * 0.8));
                
                // Reset shadow agar tidak mengganggu rendering foto
                ctx.shadowBlur = 0;
                
            } else if (frameId === 'elegant_gold') {
                // 3. MINIMALIS ELEGAN GOLD
                const borderOuter = Math.round(width * 0.03);
                const borderInner = Math.round(width * 0.045);
                
                // Background hitam solid jika mau kontras tinggi, tapi dalam frame ini kita biarkan transparan
                // Hanya menggambar garis border emas tipis ganda
                ctx.strokeStyle = '#D4AF37'; // Emas kemilau
                ctx.lineWidth = 2;
                ctx.strokeRect(borderOuter, borderOuter, width - (borderOuter * 2), height - (borderOuter * 2));
                
                ctx.lineWidth = 1;
                ctx.strokeRect(borderInner, borderInner, width - (borderInner * 2), height - (borderInner * 2));
                
                // Teks Serif Elegan di Sisi Bawah Tengah
                ctx.fillStyle = '#D4AF37';
                ctx.textAlign = 'center';
                ctx.font = `italic ${Math.round(width * 0.03)}px 'Playfair Display', serif`;
                ctx.fillText('—  S t u d i o  E l e g a n c e  —', width / 2, height - borderInner - 12);
                
            } else if (frameId === 'floral_vibe') {
                // 4. AESTHETIC FLORAL
                const border = Math.round(width * 0.035);
                ctx.strokeStyle = '#e2dcd5'; // Warna cream lembut
                ctx.lineWidth = border;
                ctx.strokeRect(border/2, border/2, width - border, height - border);
                
                // Gambar daun estetik di empat sudut
                drawLeafBranch(ctx, border * 2, border * 2, 45);
                drawLeafBranch(ctx, width - (border * 2), border * 2, 135);
                drawLeafBranch(ctx, border * 2, height - (border * 2), -45);
                drawLeafBranch(ctx, width - (border * 2), height - (border * 2), -135);
                
                // Teks bawah bernuansa alam
                ctx.fillStyle = '#5f6f52';
                ctx.textAlign = 'center';
                ctx.font = `italic 600 ${Math.round(width * 0.03)}px 'Playfair Display', serif`;
                ctx.fillText('wildflower memories', width / 2, height - (border * 0.8));
                
            } else if (frameId === 'birthday_party') {
                // 5. TEMATIK CELEBRATION / BIRTHDAY
                const border = Math.round(width * 0.04);
                
                // Warna kuning ceria pesta
                ctx.strokeStyle = '#ffbe0b';
                ctx.lineWidth = border;
                ctx.strokeRect(border/2, border/2, width - border, height - border);
                
                // Konfeti lingkaran warna-warni di sekeliling bingkai
                const colors = ['#ff006e', '#8338ec', '#3a86f0', '#06d6a0', '#ff9f1c'];
                for (let i = 0; i < 30; i++) {
                    const x = (i % 2 === 0) ? Math.random() * border * 2 : width - (Math.random() * border * 2);
                    const y = Math.random() * height;
                    ctx.fillStyle = colors[i % colors.length];
                    ctx.beginPath();
                    ctx.arc(x, y, Math.random() * 6 + 3, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                // Tulisan Happy Birthday/Celebration di bawah
                ctx.fillStyle = '#ff006e';
                ctx.textAlign = 'center';
                ctx.font = `bold ${Math.round(width * 0.045)}px 'Plus Jakarta Sans', sans-serif`;
                ctx.fillText('🎉 HAPPY CELEBRATION 🎉', width / 2, height - (border * 0.8));
                
            } else if (frameId === 'cyberpunk_sys') {
                // 6. CYBERPUNK GREEN GRID
                const border = Math.round(width * 0.03);
                ctx.strokeStyle = '#39ff14'; // Hijau neon komputer jadul
                ctx.lineWidth = 2;
                ctx.strokeRect(border, border, width - (border * 2), height - (border * 2));
                
                // Gambar crosshair fiksi di tengah
                ctx.strokeStyle = 'rgba(57, 255, 20, 0.4)';
                ctx.lineWidth = 1;
                // Kiri atas siku
                ctx.beginPath();
                ctx.moveTo(border * 2, border * 3);
                ctx.lineTo(border * 2, border * 2);
                ctx.lineTo(border * 3, border * 2);
                ctx.stroke();
                
                // Kanan atas siku
                ctx.beginPath();
                ctx.moveTo(width - (border * 2), border * 3);
                ctx.lineTo(width - (border * 2), border * 2);
                ctx.lineTo(width - (border * 3), border * 2);
                ctx.stroke();
                
                // Info Status Cyberpunk
                ctx.fillStyle = '#39ff14';
                ctx.font = `10px 'Courier New', monospace`;
                ctx.textAlign = 'left';
                ctx.fillText('REC [●]', border * 1.5, border * 1.5);
                ctx.textAlign = 'right';
                ctx.fillText('SYS_BOOT v2.6', width - (border * 1.5), border * 1.5);
                
                ctx.textAlign = 'center';
                ctx.font = `bold 12px 'Courier New', monospace`;
                ctx.fillText('<< OVERLAY_SYS_ONLINE >>', width / 2, height - border - 8);
                
            } else if (frameId === 'pastel_kawaii') {
                // 7. PASTEL KAWAI / CUTE STAR
                const border = Math.round(width * 0.04);
                
                // Background ungu pastel lembut
                ctx.strokeStyle = '#e0aaff';
                ctx.lineWidth = border;
                ctx.strokeRect(border/2, border/2, width - border, height - border);
                
                // Gambar awan imut & bintang kuning
                drawCuteStar(ctx, border * 2, border * 2, 12, '#ffd166');
                drawCuteStar(ctx, width - (border * 2), border * 2, 10, '#ffd166');
                drawCuteStar(ctx, border * 3, height - (border * 2.5), 15, '#ffd166');
                drawCuteStar(ctx, width - (border * 3), height - (border * 2.5), 12, '#ffd166');
                
                // Awan putih imut di sudut bawah
                drawCloud(ctx, width / 2 - 40, height - (border * 0.8), 20);
                drawCloud(ctx, width / 2 + 40, height - (border * 0.8), 15);
                
                ctx.fillStyle = '#7b2cbf';
                ctx.textAlign = 'center';
                ctx.font = `bold ${Math.round(width * 0.035)}px 'Plus Jakarta Sans', sans-serif`;
                ctx.fillText('⭐️ Sweet Day ⭐️', width / 2, height - (border * 0.8));
                
            } else if (frameId === 'multiplex_strip') {
                // 8. MULTIPLEX FILM STRIP
                // Frame ini adalah 3 strip vertikal hitam ala bioskop kuno
                ctx.fillStyle = '#111827'; // Hitam pekat
                ctx.fillRect(0, 0, width, height);
                
                // Sisi kiri dan kanan diberi lubang strip (sprocket holes)
                const holeW = width * 0.03;
                const holeH = height * 0.04;
                const gap = height * 0.03;
                
                ctx.fillStyle = '#ffffff';
                for (let y = gap; y < height; y += holeH + gap) {
                    // Lubang Kiri
                    ctx.fillRect(width * 0.02, y, holeW, holeH);
                    // Lubang Kanan
                    ctx.fillRect(width - (width * 0.02) - holeW, y, holeW, holeH);
                }
            }
        }

        // --- HELPER UNTUK MENGGAMBAR ELEMEN CANVAS ---
        function drawY2KStar(ctx, cx, cy, r, fillStyle) {
            ctx.fillStyle = fillStyle;
            ctx.beginPath();
            ctx.moveTo(cx, cy - r);
            ctx.quadraticCurveTo(cx, cy, cx + r, cy);
            ctx.quadraticCurveTo(cx, cy, cx, cy + r);
            ctx.quadraticCurveTo(cx, cy, cx - r, cy);
            ctx.quadraticCurveTo(cx, cy, cx, cy - r);
            ctx.closePath();
            ctx.fill();
        }

        function drawCuteStar(ctx, cx, cy, r, fillStyle) {
            ctx.fillStyle = fillStyle;
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
        }

        function drawCloud(ctx, cx, cy, r) {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.arc(cx - r * 0.6, cy - r * 0.2, r * 0.8, 0, Math.PI * 2);
            ctx.arc(cx + r * 0.6, cy - r * 0.2, r * 0.8, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }

        function drawLeafBranch(ctx, cx, cy, angleDegrees) {
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(angleDegrees * Math.PI / 180);
            
            // Tangkai utama
            ctx.strokeStyle = '#5f6f52';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, 20);
            ctx.quadraticCurveTo(5, 0, 0, -20);
            ctx.stroke();
            
            // Gambar beberapa helai daun oval
            ctx.fillStyle = '#808f70';
            for (let i = 0; i < 3; i++) {
                const leafY = -15 + (i * 12);
                
                // Daun Kiri
                ctx.beginPath();
                ctx.ellipse(-8, leafY, 6, 3, -Math.PI/6, 0, Math.PI * 2);
                ctx.fill();
                
                // Daun Kanan
                ctx.beginPath();
                ctx.ellipse(8, leafY, 6, 3, Math.PI/6, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }


        // ============================================
        // SISTEM COUNTDOWN TIMER & PENGAMBILAN SNAPSHOT
        // ============================================
        function startCapture() {
            if (isCapturing) return;
            isCapturing = true;
            
            const captureBtn = document.getElementById('btnCapture');
            captureBtn.disabled = true;
            captureBtn.classList.add('opacity-50');

            // Cek apakah memilih mode multiplex_strip (membutuhkan 3 foto sequential)
            if (selectedFrame === 'multiplex_strip') {
                runMultiplexSequence();
            } else {
                runStandardCountdown();
            }
        }

        // Mode Standard: Ambil 1 Foto
        function runStandardCountdown() {
            let count = 3;
            countdownNumber.innerText = count;
            countdownOverlay.classList.remove('hidden');

            const timer = setInterval(() => {
                count--;
                if (count > 0) {
                    countdownNumber.innerText = count;
                    countdownNumber.classList.remove('scale-100');
                    // Memicu trigger restart animasi CSS
                    void countdownNumber.offsetWidth;
                    countdownNumber.classList.add('scale-100');
                } else {
                    clearInterval(timer);
                    countdownOverlay.classList.add('hidden');
                    
                    // Melakukan Jepretan (Flash)
                    triggerFlashEffect();
                    
                    // Simpan data frame video ke canvas hasil
                    captureSingleFrame();
                    
                    isCapturing = false;
                    captureBtnReset();
                }
            }, 1000);
        }

        // Mode Film Strip: Ambil 3 Foto Sequential
        async function runMultiplexSequence() {
            capturedSnapshots = [];
            const stepIndicator = document.getElementById('stripCaptureIndicator');
            const stepText = document.getElementById('stripStepText');
            
            stepIndicator.classList.remove('hidden');

            for (let shot = 1; shot <= 3; shot++) {
                stepText.innerText = `Bersiap untuk foto ${shot} dari 3`;
                
                // Countdown 3 detik per jepretan
                await new Promise(resolve => {
                    let count = 3;
                    countdownNumber.innerText = count;
                    countdownOverlay.classList.remove('hidden');
                    
                    const interval = setInterval(() => {
                        count--;
                        if (count > 0) {
                            countdownNumber.innerText = count;
                        } else {
                            clearInterval(interval);
                            countdownOverlay.classList.add('hidden');
                            triggerFlashEffect();
                            
                            // Simpan snapshot ke cache
                            const snapCanvas = document.createElement('canvas');
                            snapCanvas.width = video.videoWidth || 640;
                            snapCanvas.height = video.videoHeight || 480;
                            const snapCtx = snapCanvas.getContext('2d');
                            
                            // Terapkan filter ke snapshot
                            const activeFilter = filters.find(f => f.id === selectedFilter);
                            if (activeFilter && activeFilter.css !== 'none') {
                                snapCtx.filter = activeFilter.css;
                            }
                            
                            // Mirroring gambar video agar seperti cermin
                            snapCtx.translate(snapCanvas.width, 0);
                            snapCtx.scale(-1, 1);
                            snapCtx.drawImage(video, 0, 0, snapCanvas.width, snapCanvas.height);
                            
                            capturedSnapshots.push(snapCanvas);
                            resolve();
                        }
                    }, 1000);
                });
                
                // Beri jeda kecil antar-jepretan agar user bersiap
                if (shot < 3) {
                    await new Promise(r => setTimeout(r, 1500));
                }
            }

            // Gabungkan 3 foto di multiplex film strip canvas
            compileMultiplexStripResult();
            
            stepIndicator.classList.add('hidden');
            isCapturing = false;
            captureBtnReset();
        }

        function triggerFlashEffect() {
            // Flash visual putih sekejap
            const flash = document.createElement('div');
            flash.className = 'absolute inset-0 bg-white z-30 animate-out fade-out duration-300';
            cameraContainer.appendChild(flash);
            setTimeout(() => flash.remove(), 400);
        }

        function captureBtnReset() {
            const captureBtn = document.getElementById('btnCapture');
            captureBtn.disabled = false;
            captureBtn.classList.remove('opacity-50');
        }


        // ============================================
        // COMPILATION & RENDERING KE HIGH-RES CANVAS
        // ============================================
        
        // Render Standard Photo
        function captureSingleFrame() {
            // Kita render di resolusi tinggi 1200x1200px agar hasil cetak maksimal
            renderedCanvas.width = 1200;
            renderedCanvas.height = 1200;
            
            renderedCtx.clearRect(0, 0, 1200, 1200);

            // 1. Gambar video frame dengan filter aktif
            const activeFilter = filters.find(f => f.id === selectedFilter);
            if (activeFilter && activeFilter.css !== 'none') {
                renderedCtx.filter = activeFilter.css;
            }

            // Tentukan area gambar foto di dalam frame
            let photoX = 0;
            let photoY = 0;
            let photoW = 1200;
            let photoH = 1200;

            if (selectedFrame === 'polaroid_classic') {
                // Di polaroid, foto berjarak dari pinggir dan menyisakan bawah
                const border = 1200 * 0.05;
                const bottomGap = 1200 * 0.18;
                
                photoX = border;
                photoY = border;
                photoW = 1200 - (border * 2);
                photoH = 1200 - border - bottomGap;
            }

            // Mirror video agar natural sesuai preview webcam
            renderedCtx.save();
            renderedCtx.translate(photoX + photoW / 2, photoY + photoH / 2);
            renderedCtx.scale(-1, 1);
            
            // Menggambar streaming video ke Canvas
            // Menjaga aspect ratio video agar fit menutup area
            const vWidth = video.videoWidth;
            const vHeight = video.videoHeight;
            const vRatio = vWidth / vHeight;
            const targetRatio = photoW / photoH;
            
            let sx = 0, sy = 0, sw = vWidth, sh = vHeight;
            if (vRatio > targetRatio) {
                sw = vHeight * targetRatio;
                sx = (vWidth - sw) / 2;
            } else {
                sh = vWidth / targetRatio;
                sy = (vHeight - sh) / 2;
            }

            renderedCtx.drawImage(video, sx, sy, sw, sh, -photoW/2, -photoH/2, photoW, photoH);
            renderedCtx.restore();
            
            // Reset filter agar frame tidak ikut ter-filter
            renderedCtx.filter = 'none';

            // 2. Terapkan bingkai di atas foto
            drawActiveFrameOnCanvas(renderedCtx, 1200, 1200, selectedFrame, false);

            // Tampilkan modal hasil foto
            openSaveModal();
        }

        // Render 3-Photo Strip Vertikal
        function compileMultiplexStripResult() {
            renderedCanvas.width = 600;
            renderedCanvas.height = 1200; // Layout memanjang vertikal
            
            renderedCtx.clearRect(0, 0, 600, 1200);

            // Background hitam film strip
            renderedCtx.fillStyle = '#111827';
            renderedCtx.fillRect(0, 0, 600, 1200);

            // Area 3 foto berada di antara strip kiri/kanan
            const px = 600 * 0.08; // Margin kiri foto
            const pyGap = 1200 * 0.03; // Gap antar foto
            const pWidth = 600 - (px * 2);
            const pHeight = (1200 - (pyGap * 4)) / 3;

            // Gambar ke-3 snapshot
            for (let i = 0; i < 3; i++) {
                const targetY = pyGap + i * (pHeight + pyGap);
                const snapshot = capturedSnapshots[i];
                
                if (snapshot) {
                    renderedCtx.drawImage(snapshot, 0, 0, snapshot.width, snapshot.height, px, targetY, pWidth, pHeight);
                    // Gambar border putih tipis di sekeliling tiap foto agar menyala
                    renderedCtx.strokeStyle = '#374151';
                    renderedCtx.lineWidth = 2;
                    renderedCtx.strokeRect(px, targetY, pWidth, pHeight);
                }
            }

            // Gambar sprocket holes (lubang strip samping kiri dan kanan)
            drawActiveFrameOnCanvas(renderedCtx, 600, 1200, 'multiplex_strip', false);

            // Tampilkan modal hasil foto
            openSaveModal();
        }


        // ============================================
        // MANAJEMEN MODAL & AKSI DOWNLOAD / SAVE
        // ============================================
        function openSaveModal() {
            const modal = document.getElementById('savePhotoModal');
            modal.classList.remove('hidden');
            // Ganti tombol status jika sedang menyimpan
            const saveBtn = document.getElementById('btnSaveToGallery');
            saveBtn.disabled = false;
            saveBtn.innerHTML = '<span>💾</span> Simpan ke Galeri Server';
            saveBtn.className = "flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2";
        }

        function closeSaveModal() {
            document.getElementById('savePhotoModal').classList.add('hidden');
        }

        // Aksi Download Foto Lokal ke perangkat pengguna
        function downloadImage() {
            const link = document.createElement('a');
            link.download = `photobooth_studio_${Date.now()}.png`;
            link.href = renderedCanvas.toDataURL('image/png');
            link.click();
        }

        // Aksi AJAX: Kirim Base64 Gambar ke server save_photo.php
        function saveToDatabase() {
            const saveBtn = document.getElementById('btnSaveToGallery');
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<span>⏳</span> Sedang Menyimpan...';
            saveBtn.className = "flex-1 py-3 px-4 bg-emerald-400 text-white font-semibold rounded-xl text-sm cursor-not-allowed flex items-center justify-center gap-2";

            const base64Image = renderedCanvas.toDataURL('image/png');

            fetch('save_photo.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ image: base64Image })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Update tombol menjadi sukses
                    saveBtn.innerHTML = '<span>✅</span> Tersimpan di Server!';
                    saveBtn.className = "flex-1 py-3 px-4 bg-teal-600 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2";
                    
                    // Tambahkan foto ke gallery sidebar secara dinamis
                    addNewPhotoToSidebar(data.image_path, data.created_at);
                    
                    // Sembunyikan empty state jika sebelumnya ada
                    document.getElementById('galleryEmptyState').classList.add('hidden');
                    document.getElementById('sidebarGallery').classList.remove('hidden');
                    
                    // Tutup modal secara otomatis setelah 1.5 detik
                    setTimeout(() => {
                        closeSaveModal();
                    }, 1500);
                } else {
                    alert('Gagal menyimpan foto: ' + data.message);
                    saveBtn.disabled = false;
                    saveBtn.innerHTML = '<span>💾</span> Coba Simpan Lagi';
                    saveBtn.className = "flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2";
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Koneksi terganggu. Gagal terhubung ke database server.');
                saveBtn.disabled = false;
                saveBtn.innerHTML = '<span>💾</span> Coba Simpan Lagi';
                saveBtn.className = "flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2";
            });
        }

        // Menambahkan elemen foto ke sidebar secara instan setelah sukses AJAX
        function addNewPhotoToSidebar(path, dateFormatted) {
            const gallery = document.getElementById('sidebarGallery');
            
            const card = document.createElement('div');
            card.className = "group aspect-square rounded-xl overflow-hidden bg-slate-100 relative border border-slate-200 shadow-sm transition hover:shadow-md cursor-pointer";
            card.onclick = () => showModalPhoto(path, dateFormatted);
            card.innerHTML = `
                <img src="${path}" alt="Photobooth Snap" class="w-full h-full object-cover transform transition duration-300 group-hover:scale-105" referrerpolicy="no-referrer">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-200 p-2 flex items-end">
                    <p class="text-[10px] text-white font-medium truncate w-full">${dateFormatted.split(',')[0]}</p>
                </div>
            `;
            
            // Masukkan di tumpukan paling atas (terbaru)
            gallery.insertBefore(card, gallery.firstChild);

            // Perbarui counter
            const countBadge = document.getElementById('galleryCount');
            const currentCount = parseInt(countBadge.innerText) || 0;
            countBadge.innerText = `${currentCount + 1} Foto`;
        }

        // Lihat Detail Foto Tersimpan
        function showModalPhoto(path, date) {
            document.getElementById('detailImg').src = path;
            document.getElementById('detailDate').innerText = 'Foto Diambil pada: ' + date;
            document.getElementById('btnDetailDownload').href = path;
            document.getElementById('viewPhotoModal').classList.remove('hidden');
        }

        function closeViewModal() {
            document.getElementById('viewPhotoModal').classList.add('hidden');
        }


        // ============================================
        // BOOTSTRAP INITIALIZATION
        // ============================================
        document.addEventListener('DOMContentLoaded', () => {
            renderControls();
            initCamera();
        });
    </script>
</body>
</html>
