-- Database: photobooth_db
-- Buat database jika belum ada
CREATE DATABASE IF NOT EXISTS `photobooth_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `photobooth_db`;

-- 1. Tabel users untuk sistem autentikasi
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabel photos untuk menyimpan riwayat jepretan pengguna
CREATE TABLE IF NOT EXISTS `photos` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `image_path` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_photos_users` 
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tambah indeks untuk query riwayat yang cepat
CREATE INDEX `idx_user_photos` ON `photos` (`user_id`);
CREATE INDEX `idx_created_at` ON `photos` (`created_at`);
