<?php
/**
 * Konfigurasi Database & Sesi
 * Photobooth Studio PHP-MySQL
 */

// Menyalakan error reporting untuk mempermudah debugging (bisa dimatikan saat production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Memulai session jika belum aktif
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Konfigurasi Database (Sesuaikan dengan data dari InfinityFree cPanel jika di-hosting)
define('DB_HOST', 'localhost');          // Untuk InfinityFree, ganti dengan host mysql (contoh: sql200.epizy.com)
define('DB_USER', 'root');               // Ganti dengan username database (contoh: epiz_12345678_db)
define('DB_PASS', '');                   // Ganti dengan password database
define('DB_NAME', 'photobooth_db');      // Ganti dengan nama database (contoh: epiz_12345678_photobooth)

try {
    // Membuat koneksi PDO dengan opsi UTF-8 dan error handling exception
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
} catch (PDOException $e) {
    // Menampilkan pesan error jika koneksi gagal
    die("Koneksi database gagal: " . $e->getMessage());
}

/**
 * Helper untuk membersihkan input data agar terhindar dari XSS
 */
function sanitize_input($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

/**
 * Helper untuk memeriksa apakah user sudah login
 */
function is_logged_in() {
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

/**
 * Helper untuk membatasi akses halaman bagi tamu (guest)
 */
function require_login() {
    if (!is_logged_in()) {
        header("Location: login.php");
        exit;
    }
}
?>
