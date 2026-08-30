<?php
/**
 * AJAX Handler untuk Menyimpan Hasil Foto ke Server & Database
 */
header('Content-Type: application/json');
require_once 'config.php';

// Pastikan user sudah login
if (!is_logged_in()) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Sesi Anda telah berakhir. Silakan login kembali.'
    ]);
    exit;
}

// Hanya menerima request POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'status' => 'error',
        'message' => 'Metode request tidak diizinkan.'
    ]);
    exit;
}

// Mendapatkan data JSON dari body request
$input = json_decode(file_get_contents('php://input'), true);
$imageData = $input['image'] ?? '';

if (empty($imageData)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Tidak ada data gambar yang diterima.'
    ]);
    exit;
}

// Validasi format Base64 (harus berupa data URL PNG)
if (strpos($imageData, 'data:image/png;base64,') !== 0) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Format gambar tidak valid. Harus berupa PNG Base64.'
    ]);
    exit;
}

try {
    // Membuat direktori penyimpanan jika belum ada
    $uploadDir = 'uploads/';
    if (!file_exists($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            throw new Exception("Gagal membuat direktori penyimpanan 'uploads/'. Harap periksa izin folder hosting Anda.");
        }
    }

    // Dekode data gambar Base64
    $filteredData = substr($imageData, strpos($imageData, ',') + 1);
    $decodedData = base64_decode($filteredData);
    
    if ($decodedData === false) {
        throw new Exception("Gagal melakukan dekode Base64.");
    }

    // Generate nama file unik menggunakan id user dan timestamp
    $userId = $_SESSION['user_id'];
    $fileName = 'photo_' . $userId . '_' . time() . '_' . bin2hex(random_bytes(4)) . '.png';
    $filePath = $uploadDir . $fileName;

    // Simpan file ke sistem file server
    if (file_put_contents($filePath, $decodedData) === false) {
        throw new Exception("Gagal menulis file gambar ke server. Periksa izin akses folder uploads/.");
    }

    // Simpan informasi path gambar ke database MySQL
    $stmt = $pdo->prepare("INSERT INTO photos (user_id, image_path) VALUES (?, ?)");
    if ($stmt->execute([$userId, $filePath])) {
        // Berhasil disimpan
        echo json_encode([
            'status' => 'success',
            'message' => 'Foto berhasil disimpan ke Galeri!',
            'image_path' => $filePath,
            'filename' => $fileName,
            'created_at' => date('d M Y, H:i')
        ]);
    } else {
        // Hapus file yang sudah terlanjur disimpan jika query gagal
        if (file_exists($filePath)) {
            unlink($filePath);
        }
        throw new Exception("Gagal mencatat data foto ke database.");
    }

} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Terjadi kesalahan: ' . $e->getMessage()
    ]);
}
?>
