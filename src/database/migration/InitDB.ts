import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDB1621280558787 implements MigrationInterface {
  name = 'InitDB1621280558787';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `session` (`id` int NOT NULL AUTO_INCREMENT, `value` varchar(255) NOT NULL, `expireDate` datetime NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `userId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `plan` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `price` decimal(15,2) NOT NULL DEFAULT 0, `costPerMinute` decimal(15,2) NOT NULL DEFAULT 0, `isUnlimited` tinyint NOT NULL DEFAULT 0, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `subscription` (`id` int NOT NULL AUTO_INCREMENT, `startDate` date NOT NULL, `monthDuration` int NOT NULL, `autoRenew` tinyint NOT NULL DEFAULT 0, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `planId` int NULL, `userId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `invoice` (`id` int NOT NULL AUTO_INCREMENT, `billingDate` date NOT NULL, `amount` decimal(15,2) NOT NULL DEFAULT 0, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `userId` int NULL, `subscriptionId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      "CREATE TABLE `issue` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, `content` text NOT NULL, `attachedFiles` varchar(255) NOT NULL, `type` enum ('BIKE', 'STATION') NOT NULL DEFAULT 'BIKE', `status` enum ('CREATED', 'DONE', 'IN PROGRESS') NOT NULL DEFAULT 'CREATED', `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `creatorId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'CREATE TABLE `issue_thread` (`id` int NOT NULL AUTO_INCREMENT, `content` text NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `authorId` int NULL, `issueId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      "CREATE TABLE `station_monitoring` (`id` int NOT NULL AUTO_INCREMENT, `isActive` tinyint NOT NULL DEFAULT 0, `status` enum ('ACTIVE', 'MAINTAINING', 'OFF') NOT NULL DEFAULT 'OFF', `batteryPercent` double NOT NULL, `chargingPower` double NOT NULL, `usedBikeSlot` int NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `stationId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'CREATE TABLE `station_maintenance_thread` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, `content` text NOT NULL, `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `stationBreakdownId` int NULL, `userId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `bike_manufacturer` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `phone` varchar(255) NOT NULL, `address` varchar(255) NOT NULL, UNIQUE INDEX `IDX_cfe40bafa7d89552bea3804cb1` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `bike_model` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `batteryCapacity` double NOT NULL, `weight` double NOT NULL, `maxPower` double NOT NULL, `maxSpeed` double NOT NULL, `maxDistance` double NOT NULL, `description` text NOT NULL, `image` varchar(255) NOT NULL, `icon` varchar(255) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `biekManufacturerId` int NULL, UNIQUE INDEX `IDX_279c2b880bd73eb3e4378de14c` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `bike_maintenance_thread` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, `content` text NOT NULL, `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `bikeBreakdownId` int NULL, `userId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      "CREATE TABLE `bike` (`id` int NOT NULL AUTO_INCREMENT, `matriculate` varchar(255) NOT NULL, `batteryPercent` double NOT NULL, `recharging` tinyint NOT NULL DEFAULT 0, `status` enum ('OFF', 'MAINTAINING', 'IN_RIDE', 'RECHARING') NOT NULL DEFAULT 'OFF', `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `stationId` int NULL, `modelId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'CREATE TABLE `station` (`id` int NOT NULL AUTO_INCREMENT, `batteryCapacity` int NOT NULL, `bikeCapacity` int NOT NULL, `streetNumber` int NOT NULL, `streetName` varchar(255) NOT NULL, `city` varchar(255) NOT NULL, `zipcode` varchar(255) NOT NULL, `coordinateX` int NOT NULL, `coordinateY` int NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `ride` (`id` int NOT NULL AUTO_INCREMENT, `duration` int NOT NULL, `rideLength` int NOT NULL, `invoiceAmount` int NOT NULL, `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `startStationId` int NULL, `endStationId` int NULL, `userId` int NULL, `bikeId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      "CREATE TABLE `user` (`id` int NOT NULL AUTO_INCREMENT, `firstName` varchar(255) NOT NULL, `lastName` varchar(255) NOT NULL, `birthDate` date NOT NULL, `isActive` tinyint NOT NULL DEFAULT 1, `email` varchar(255) NOT NULL, `password` varchar(255) NULL, `pseudo` varchar(255) NOT NULL, `resetPasswordToken` varchar(255) NULL, `newsletter` tinyint NOT NULL DEFAULT 0, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `role` enum ('ADMIN', 'CLIENT', 'STAFF', 'STATION') NOT NULL DEFAULT 'CLIENT', UNIQUE INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'CREATE TABLE `article` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, `content` text NOT NULL, `cover` varchar(255) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `authorId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `session` ADD CONSTRAINT `FK_3d2f174ef04fb312fdebd0ddc53` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `subscription` ADD CONSTRAINT `FK_6b6d0e4dc88105a4a11103dd2cd` FOREIGN KEY (`planId`) REFERENCES `plan`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `subscription` ADD CONSTRAINT `FK_cc906b4bc892b048f1b654d2aa0` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `invoice` ADD CONSTRAINT `FK_f8e849201da83b87f78c7497dde` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `invoice` ADD CONSTRAINT `FK_1ca5dce89a3293e6b88cd14c0ca` FOREIGN KEY (`subscriptionId`) REFERENCES `subscription`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `issue` ADD CONSTRAINT `FK_c45ed95b87402ee9e4b3c8dc81f` FOREIGN KEY (`creatorId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `issue_thread` ADD CONSTRAINT `FK_3d7783301d844fd0662be2e2c12` FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `issue_thread` ADD CONSTRAINT `FK_ad292289122f03b3b0dee720ecb` FOREIGN KEY (`issueId`) REFERENCES `issue`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `station_monitoring` ADD CONSTRAINT `FK_7dbe51843af72c7a9aa07ccb1fe` FOREIGN KEY (`stationId`) REFERENCES `station`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `station_maintenance_thread` ADD CONSTRAINT `FK_01cfdb2bcaaccd90dd10e67a58a` FOREIGN KEY (`stationBreakdownId`) REFERENCES `station`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `station_maintenance_thread` ADD CONSTRAINT `FK_48161fff9f96d02d2fb5dcabb20` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `bike_model` ADD CONSTRAINT `FK_58890ebe484c5170e8cbfec4632` FOREIGN KEY (`biekManufacturerId`) REFERENCES `bike_manufacturer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `bike_maintenance_thread` ADD CONSTRAINT `FK_1ae68bf7d756b2d1170a774873a` FOREIGN KEY (`bikeBreakdownId`) REFERENCES `bike`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `bike_maintenance_thread` ADD CONSTRAINT `FK_e9179d5c566c85e41cd265cbdd9` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `bike` ADD CONSTRAINT `FK_5d42265bfc04e9bc800416ee5b3` FOREIGN KEY (`stationId`) REFERENCES `station`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `bike` ADD CONSTRAINT `FK_434c39c48566ad3de7ec621ca61` FOREIGN KEY (`modelId`) REFERENCES `bike_model`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `ride` ADD CONSTRAINT `FK_cb33e04b103feefa3ef5938ba1e` FOREIGN KEY (`startStationId`) REFERENCES `station`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `ride` ADD CONSTRAINT `FK_9cfe718b1f69fcda6bf7102243a` FOREIGN KEY (`endStationId`) REFERENCES `station`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `ride` ADD CONSTRAINT `FK_9ae4b85478d3d8adb6e8f6f7172` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `ride` ADD CONSTRAINT `FK_6608766e195dacfe423e74c1ac9` FOREIGN KEY (`bikeId`) REFERENCES `bike`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `article` ADD CONSTRAINT `FK_a9c5f4ec6cceb1604b4a3c84c87` FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `article` DROP FOREIGN KEY `FK_a9c5f4ec6cceb1604b4a3c84c87`'
    );
    await queryRunner.query(
      'ALTER TABLE `ride` DROP FOREIGN KEY `FK_6608766e195dacfe423e74c1ac9`'
    );
    await queryRunner.query(
      'ALTER TABLE `ride` DROP FOREIGN KEY `FK_9ae4b85478d3d8adb6e8f6f7172`'
    );
    await queryRunner.query(
      'ALTER TABLE `ride` DROP FOREIGN KEY `FK_9cfe718b1f69fcda6bf7102243a`'
    );
    await queryRunner.query(
      'ALTER TABLE `ride` DROP FOREIGN KEY `FK_cb33e04b103feefa3ef5938ba1e`'
    );
    await queryRunner.query(
      'ALTER TABLE `bike` DROP FOREIGN KEY `FK_434c39c48566ad3de7ec621ca61`'
    );
    await queryRunner.query(
      'ALTER TABLE `bike` DROP FOREIGN KEY `FK_5d42265bfc04e9bc800416ee5b3`'
    );
    await queryRunner.query(
      'ALTER TABLE `bike_maintenance_thread` DROP FOREIGN KEY `FK_e9179d5c566c85e41cd265cbdd9`'
    );
    await queryRunner.query(
      'ALTER TABLE `bike_maintenance_thread` DROP FOREIGN KEY `FK_1ae68bf7d756b2d1170a774873a`'
    );
    await queryRunner.query(
      'ALTER TABLE `bike_model` DROP FOREIGN KEY `FK_58890ebe484c5170e8cbfec4632`'
    );
    await queryRunner.query(
      'ALTER TABLE `station_maintenance_thread` DROP FOREIGN KEY `FK_48161fff9f96d02d2fb5dcabb20`'
    );
    await queryRunner.query(
      'ALTER TABLE `station_maintenance_thread` DROP FOREIGN KEY `FK_01cfdb2bcaaccd90dd10e67a58a`'
    );
    await queryRunner.query(
      'ALTER TABLE `station_monitoring` DROP FOREIGN KEY `FK_7dbe51843af72c7a9aa07ccb1fe`'
    );
    await queryRunner.query(
      'ALTER TABLE `issue_thread` DROP FOREIGN KEY `FK_ad292289122f03b3b0dee720ecb`'
    );
    await queryRunner.query(
      'ALTER TABLE `issue_thread` DROP FOREIGN KEY `FK_3d7783301d844fd0662be2e2c12`'
    );
    await queryRunner.query(
      'ALTER TABLE `issue` DROP FOREIGN KEY `FK_c45ed95b87402ee9e4b3c8dc81f`'
    );
    await queryRunner.query(
      'ALTER TABLE `invoice` DROP FOREIGN KEY `FK_1ca5dce89a3293e6b88cd14c0ca`'
    );
    await queryRunner.query(
      'ALTER TABLE `invoice` DROP FOREIGN KEY `FK_f8e849201da83b87f78c7497dde`'
    );
    await queryRunner.query(
      'ALTER TABLE `subscription` DROP FOREIGN KEY `FK_cc906b4bc892b048f1b654d2aa0`'
    );
    await queryRunner.query(
      'ALTER TABLE `subscription` DROP FOREIGN KEY `FK_6b6d0e4dc88105a4a11103dd2cd`'
    );
    await queryRunner.query(
      'ALTER TABLE `session` DROP FOREIGN KEY `FK_3d2f174ef04fb312fdebd0ddc53`'
    );
    await queryRunner.query('DROP TABLE `article`');
    await queryRunner.query(
      'DROP INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` ON `user`'
    );
    await queryRunner.query('DROP TABLE `user`');
    await queryRunner.query('DROP TABLE `ride`');
    await queryRunner.query('DROP TABLE `station`');
    await queryRunner.query('DROP TABLE `bike`');
    await queryRunner.query('DROP TABLE `bike_maintenance_thread`');
    await queryRunner.query(
      'DROP INDEX `IDX_279c2b880bd73eb3e4378de14c` ON `bike_model`'
    );
    await queryRunner.query('DROP TABLE `bike_model`');
    await queryRunner.query(
      'DROP INDEX `IDX_cfe40bafa7d89552bea3804cb1` ON `bike_manufacturer`'
    );
    await queryRunner.query('DROP TABLE `bike_manufacturer`');
    await queryRunner.query('DROP TABLE `station_maintenance_thread`');
    await queryRunner.query('DROP TABLE `station_monitoring`');
    await queryRunner.query('DROP TABLE `issue_thread`');
    await queryRunner.query('DROP TABLE `issue`');
    await queryRunner.query('DROP TABLE `invoice`');
    await queryRunner.query('DROP TABLE `subscription`');
    await queryRunner.query('DROP TABLE `plan`');
    await queryRunner.query('DROP TABLE `session`');
  }
}
