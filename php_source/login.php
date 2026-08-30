<?php
/**
 * Halaman Login Pengguna
 */
require_once 'config.php';

// Jika sudah login, langsung alihkan ke dashboard studio
if (is_logged_in()) {
    header("Location: index.php");
    exit;
}

$error = '';

// Proses form login ketika dikirim
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $identity = sanitize_input($_POST['identity'] ?? ''); // Bisa berupa username atau email
    $password = $_POST['password'] ?? '';
    
    if (empty($identity) || empty($password)) {
        $error = 'Silakan isi username/email dan kata sandi Anda!';
    } else {
        try {
            // Cari pengguna berdasarkan username atau email
            $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? OR email = ?");
            $stmt->execute([$identity, $identity]);
            $user = $stmt->fetch();
            
            // Verifikasi kecocokan user dan password hash
            if ($user && password_verify($password, $user['password'])) {
                // Regenerasi session ID untuk menghindari session fixation attack
                session_regenerate_id(true);
                
                // Set sesi pengguna
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['email'] = $user['email'];
                
                // Alihkan ke studio utama
                header("Location: index.php");
                exit;
            } else {
                $error = 'Username/email atau kata sandi Anda salah!';
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
    <title>Masuk - Photobooth Studio</title>
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
            <h2 class="text-2xl font-bold text-gray-800">Selamat Datang Kembali</h2>
            <p class="text-sm text-gray-500 mt-1">Masuk untuk memulai sesi foto kreatif Anda</p>
        </div>

        <div class="p-8">
            <!-- Alert Notifikasi Error -->
            <?php if (!empty($error)): ?>
                <div class="mb-5 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                    ⚠️ <?php echo htmlspecialchars($error); ?>
                </div>
            <?php endif; ?>

            <!-- Form Login -->
            <form action="login.php" method="POST" class="space-y-5">
                <div>
                    <label for="identity" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Username atau Email</label>
                    <input type="text" id="identity" name="identity" required 
                           value="<?php echo isset($identity) ? htmlspecialchars($identity) : ''; ?>"
                           placeholder="Masukkan username atau email Anda"
                           class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-700 text-sm">
                </div>

                <div>
                    <div class="flex justify-between items-center mb-2">
                        <label for="password" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Kata Sandi</label>
                    </div>
                    <input type="password" id="password" name="password" required 
                           placeholder="Masukkan kata sandi Anda"
                           class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-700 text-sm">
                </div>

                <button type="submit" 
                        class="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition duration-200 text-sm">
                    Masuk Akun
                </button>
            </form>

            <div class="mt-8 pt-6 border-t border-gray-100 text-center">
                <p class="text-sm text-gray-500">
                    Belum memiliki akun? 
                    <a href="register.php" class="text-indigo-600 hover:text-indigo-800 font-semibold ml-1">Daftar sekarang</a>
                </p>
            </div>
        </div>
    </div>
</body>
</html>
