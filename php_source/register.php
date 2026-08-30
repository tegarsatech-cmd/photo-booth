<?php
/**
 * Halaman Registrasi Pengguna
 */
require_once 'config.php';

// Jika sudah login, langsung alihkan ke dashboard studio
if (is_logged_in()) {
    header("Location: index.php");
    exit;
}

$error = '';
$success = '';

// Proses form registrasi ketika dikirim
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = sanitize_input($_POST['username'] ?? '');
    $email    = sanitize_input($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';
    
    // Validasi dasar
    if (empty($username) || empty($email) || empty($password) || empty($confirm_password)) {
        $error = 'Semua kolom wajib diisi!';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Format email tidak valid!';
    } elseif (strlen($password) < 6) {
        $error = 'Kata sandi minimal harus 6 karakter!';
    } elseif ($password !== $confirm_password) {
        $error = 'Konfirmasi kata sandi tidak cocok!';
    } else {
        try {
            // Cek apakah username sudah terdaftar
            $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
            $stmt->execute([$username]);
            if ($stmt->fetch()) {
                $error = 'Username sudah digunakan oleh orang lain!';
            } else {
                // Cek apakah email sudah terdaftar
                $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
                $stmt->execute([$email]);
                if ($stmt->fetch()) {
                    $error = 'Email sudah terdaftar!';
                } else {
                    // Hash kata sandi untuk keamanan maksimal
                    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
                    
                    // Simpan user baru ke database
                    $stmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
                    if ($stmt->execute([$username, $email, $hashed_password])) {
                        $success = 'Pendaftaran berhasil! Silakan masuk ke akun Anda.';
                        // Reset input agar form kosong kembali
                        $username = $email = '';
                    } else {
                        $error = 'Terjadi kesalahan sistem, silakan coba lagi nanti.';
                    }
                }
            }
        } catch (PDOException $e) {
            $error = 'Error database: ' . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daftar - Photobooth Studio</title>
    <!-- Tailwind CSS CDN untuk kemudahan hosting di InfinityFree tanpa build step -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: radial-gradient(circle at top left, #fcfcfd 0%, #f4f5f7 100%);
        }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <!-- Header Visual -->
        <div class="px-8 pt-8 pb-6 text-center bg-gradient-to-br from-indigo-50 to-purple-50 border-b border-gray-100">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold text-xl mb-3 shadow-md shadow-indigo-200">
                📸
            </div>
            <h2 class="text-2xl font-bold text-gray-800">Buat Akun Baru</h2>
            <p class="text-sm text-gray-500 mt-1">Gabung dan simpan kenangan fotomu selamanya</p>
        </div>

        <div class="p-8">
            <!-- Alert Notifikasi -->
            <?php if (!empty($error)): ?>
                <div class="mb-5 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                    ⚠️ <?php echo htmlspecialchars($error); ?>
                </div>
            <?php endif; ?>

            <?php if (!empty($success)): ?>
                <div class="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium">
                    🎉 <?php echo htmlspecialchars($success); ?>
                    <div class="mt-2">
                        <a href="login.php" class="text-indigo-600 hover:text-indigo-800 font-bold underline">Masuk sekarang →</a>
                    </div>
                </div>
            <?php endif; ?>

            <!-- Form Registrasi -->
            <form action="register.php" method="POST" class="space-y-5">
                <div>
                    <label for="username" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Username</label>
                    <input type="text" id="username" name="username" required 
                           value="<?php echo isset($username) ? htmlspecialchars($username) : ''; ?>"
                           placeholder="Contoh: capture_fun"
                           class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-700 text-sm">
                </div>

                <div>
                    <label for="email" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Alamat Email</label>
                    <input type="email" id="email" name="email" required 
                           value="<?php echo isset($email) ? htmlspecialchars($email) : ''; ?>"
                           placeholder="Contoh: user@domain.com"
                           class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-700 text-sm">
                </div>

                <div>
                    <label for="password" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Kata Sandi</label>
                    <input type="password" id="password" name="password" required 
                           placeholder="Minimal 6 karakter"
                           class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-700 text-sm">
                </div>

                <div>
                    <label for="confirm_password" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Ulangi Kata Sandi</label>
                    <input type="password" id="confirm_password" name="confirm_password" required 
                           placeholder="Sama dengan kata sandi di atas"
                           class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-700 text-sm">
                </div>

                <button type="submit" 
                        class="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition duration-200 text-sm">
                    Daftar Akun
                </button>
            </form>

            <div class="mt-8 pt-6 border-t border-gray-100 text-center">
                <p class="text-sm text-gray-500">
                    Sudah memiliki akun? 
                    <a href="login.php" class="text-indigo-600 hover:text-indigo-800 font-semibold ml-1">Masuk di sini</a>
                </p>
            </div>
        </div>
    </div>
</body>
</html>
