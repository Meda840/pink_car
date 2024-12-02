/*
  Warnings:

  - You are about to drop the `_driver_profiletopassenger_profile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_driver_profiletopassenger_profile` DROP FOREIGN KEY `_Driver_ProfileToPassenger_Profile_A_fkey`;

-- DropForeignKey
ALTER TABLE `_driver_profiletopassenger_profile` DROP FOREIGN KEY `_Driver_ProfileToPassenger_Profile_B_fkey`;

-- DropTable
DROP TABLE `_driver_profiletopassenger_profile`;

-- CreateTable
CREATE TABLE `_FavoritePassengers` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_FavoritePassengers_AB_unique`(`A`, `B`),
    INDEX `_FavoritePassengers_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_FavoriteDrivers` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_FavoriteDrivers_AB_unique`(`A`, `B`),
    INDEX `_FavoriteDrivers_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_FavoritePassengers` ADD CONSTRAINT `_FavoritePassengers_A_fkey` FOREIGN KEY (`A`) REFERENCES `Driver_Profile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FavoritePassengers` ADD CONSTRAINT `_FavoritePassengers_B_fkey` FOREIGN KEY (`B`) REFERENCES `Passenger_Profile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FavoriteDrivers` ADD CONSTRAINT `_FavoriteDrivers_A_fkey` FOREIGN KEY (`A`) REFERENCES `Driver_Profile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FavoriteDrivers` ADD CONSTRAINT `_FavoriteDrivers_B_fkey` FOREIGN KEY (`B`) REFERENCES `Passenger_Profile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
