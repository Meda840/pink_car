-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identity` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone_number` VARCHAR(191) NOT NULL,
    `role` BOOLEAN NOT NULL,

    UNIQUE INDEX `Users_identity_key`(`identity`),
    UNIQUE INDEX `Users_username_key`(`username`),
    UNIQUE INDEX `Users_email_key`(`email`),
    UNIQUE INDEX `Users_phone_number_key`(`phone_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Passenger_Profile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `photo` VARCHAR(191) NULL,
    `biography` VARCHAR(191) NULL,

    UNIQUE INDEX `Passenger_Profile_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Driver_Profile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `drivingLicence` VARCHAR(191) NOT NULL,
    `photo` VARCHAR(191) NULL,
    `biography` VARCHAR(191) NULL,
    `location` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Driver_Profile_userId_key`(`userId`),
    UNIQUE INDEX `Driver_Profile_drivingLicence_key`(`drivingLicence`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Car` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mark` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `capacity` INTEGER NOT NULL,
    `isAutomatic` BOOLEAN NOT NULL,
    `year` INTEGER NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `isAvailable` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Trip` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `start` VARCHAR(191) NOT NULL,
    `destination` VARCHAR(191) NOT NULL,
    `price` DOUBLE NULL,
    `numberPassengers` INTEGER NULL,
    `description` VARCHAR(191) NULL,
    `driverId` INTEGER NOT NULL,
    `passengerId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_Driver_ProfileToPassenger_Profile` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_Driver_ProfileToPassenger_Profile_AB_unique`(`A`, `B`),
    INDEX `_Driver_ProfileToPassenger_Profile_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CarToDriver_Profile` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CarToDriver_Profile_AB_unique`(`A`, `B`),
    INDEX `_CarToDriver_Profile_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Passenger_Profile` ADD CONSTRAINT `Passenger_Profile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Driver_Profile` ADD CONSTRAINT `Driver_Profile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trip` ADD CONSTRAINT `Trip_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `Driver_Profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trip` ADD CONSTRAINT `Trip_passengerId_fkey` FOREIGN KEY (`passengerId`) REFERENCES `Passenger_Profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Driver_ProfileToPassenger_Profile` ADD CONSTRAINT `_Driver_ProfileToPassenger_Profile_A_fkey` FOREIGN KEY (`A`) REFERENCES `Driver_Profile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Driver_ProfileToPassenger_Profile` ADD CONSTRAINT `_Driver_ProfileToPassenger_Profile_B_fkey` FOREIGN KEY (`B`) REFERENCES `Passenger_Profile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CarToDriver_Profile` ADD CONSTRAINT `_CarToDriver_Profile_A_fkey` FOREIGN KEY (`A`) REFERENCES `Car`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CarToDriver_Profile` ADD CONSTRAINT `_CarToDriver_Profile_B_fkey` FOREIGN KEY (`B`) REFERENCES `Driver_Profile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
