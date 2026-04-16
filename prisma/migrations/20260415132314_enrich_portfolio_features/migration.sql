-- AlterTable
ALTER TABLE `contact_messages` ADD COLUMN `is_read` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `projects` ADD COLUMN `architecture_url` VARCHAR(500) NULL,
    ADD COLUMN `case_study_md` LONGTEXT NULL,
    ADD COLUMN `demo_url` VARCHAR(500) NULL,
    ADD COLUMN `impact_metrics` JSON NULL,
    ADD COLUMN `is_featured` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `prod_url` VARCHAR(500) NULL,
    ADD COLUMN `repo_url` VARCHAR(500) NULL,
    ADD COLUMN `tagline` VARCHAR(300) NULL;

-- AlterTable
ALTER TABLE `skill_items` ADD COLUMN `level` INTEGER NOT NULL DEFAULT 3;

-- CreateTable
CREATE TABLE `project_social_links` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `project_id` INTEGER NOT NULL,
    `platform` ENUM('linkedin', 'twitter', 'youtube', 'devto', 'medium', 'github', 'other') NOT NULL,
    `url` VARCHAR(500) NOT NULL,
    `title` VARCHAR(255) NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,

    INDEX `project_social_links_project_id_idx`(`project_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `testimonials` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `author_name` VARCHAR(150) NOT NULL,
    `author_role` VARCHAR(150) NULL,
    `author_company` VARCHAR(150) NULL,
    `author_avatar` VARCHAR(500) NULL,
    `linkedin_url` VARCHAR(500) NULL,
    `content` TEXT NOT NULL,
    `rating` INTEGER NOT NULL DEFAULT 5,
    `is_published` BOOLEAN NOT NULL DEFAULT false,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `services` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(200) NOT NULL,
    `slug` VARCHAR(150) NOT NULL,
    `icon` VARCHAR(50) NULL,
    `description` TEXT NOT NULL,
    `price_range` VARCHAR(100) NULL,
    `duration` VARCHAR(100) NULL,
    `deliverables` JSON NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `is_published` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `services_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `availability_status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('available', 'on_mission', 'unavailable') NOT NULL DEFAULT 'available',
    `message` VARCHAR(500) NULL,
    `next_available_date` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bookings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `company` VARCHAR(200) NULL,
    `phone` VARCHAR(50) NULL,
    `topic` VARCHAR(300) NOT NULL,
    `message` TEXT NULL,
    `preferred_date` DATETIME(3) NULL,
    `duration` INTEGER NOT NULL DEFAULT 30,
    `status` ENUM('pending', 'confirmed', 'cancelled', 'completed') NOT NULL DEFAULT 'pending',
    `admin_notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `bookings_status_created_at_idx`(`status`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `site_stats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `projects_shipped` INTEGER NOT NULL DEFAULT 0,
    `years_experience` INTEGER NOT NULL DEFAULT 0,
    `domains_covered` INTEGER NOT NULL DEFAULT 0,
    `clients_served` INTEGER NOT NULL DEFAULT 0,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `project_social_links` ADD CONSTRAINT `project_social_links_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
