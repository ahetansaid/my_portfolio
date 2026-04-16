-- AlterTable
ALTER TABLE `site_stats` ADD COLUMN `currently_building` VARCHAR(300) NULL;

-- CreateTable
CREATE TABLE `playground_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(120) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `emoji` VARCHAR(10) NULL,
    `description` TEXT NOT NULL,
    `image_url` VARCHAR(500) NULL,
    `demo_url` VARCHAR(500) NULL,
    `repo_url` VARCHAR(500) NULL,
    `tags` JSON NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `is_published` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `playground_items_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
