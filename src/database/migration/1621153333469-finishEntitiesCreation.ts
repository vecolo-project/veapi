import { MigrationInterface, QueryRunner } from 'typeorm';

export class finishEntitiesCreation1621153333469 implements MigrationInterface {
  name = 'finishEntitiesCreation1621153333469';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `bike` DROP COLUMN `updated_at`');
    await queryRunner.query('ALTER TABLE `bike` DROP COLUMN `created_at`');
    await queryRunner.query(
      'ALTER TABLE `bike` ADD `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)'
    );
    await queryRunner.query(
      'ALTER TABLE `bike` ADD `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)'
    );
    await queryRunner.query(
      'ALTER TABLE `plan` CHANGE `price` `price` decimal(15,2) NOT NULL DEFAULT 0'
    );
    await queryRunner.query(
      'ALTER TABLE `plan` CHANGE `costPerMinute` `costPerMinute` decimal(15,2) NOT NULL DEFAULT 0'
    );
    await queryRunner.query(
      'ALTER TABLE `invoice` CHANGE `amount` `amount` decimal(15,2) NOT NULL DEFAULT 0'
    );
    await queryRunner.query(
      "ALTER TABLE `station_monitoring` CHANGE `status` `status` enum ('ACTIVE', 'MAINTAINING', 'OFF') NOT NULL DEFAULT 'OFF'"
    );
    await queryRunner.query(
      'ALTER TABLE `station_monitoring` CHANGE `batteryPercent` `batteryPercent` double NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `station_monitoring` CHANGE `chargingPower` `chargingPower` double NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `bike_model` CHANGE `batteryCapacity` `batteryCapacity` double NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `bike_model` CHANGE `weight` `weight` double NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `bike_model` CHANGE `maxPower` `maxPower` double NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `bike_model` CHANGE `maxSpeed` `maxSpeed` double NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `bike_model` CHANGE `maxDistance` `maxDistance` double NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `bike` CHANGE `batteryPercent` `batteryPercent` double NOT NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `bike` CHANGE `batteryPercent` `batteryPercent` double(22) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `bike_model` CHANGE `maxDistance` `maxDistance` double(22) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `bike_model` CHANGE `maxSpeed` `maxSpeed` double(22) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `bike_model` CHANGE `maxPower` `maxPower` double(22) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `bike_model` CHANGE `weight` `weight` double(22) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `bike_model` CHANGE `batteryCapacity` `batteryCapacity` double(22) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `station_monitoring` CHANGE `chargingPower` `chargingPower` double(22) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `station_monitoring` CHANGE `batteryPercent` `batteryPercent` double(22) NOT NULL'
    );
    await queryRunner.query(
      "ALTER TABLE `station_monitoring` CHANGE `status` `status` enum ('ACTIVE', 'MAINTAINING', 'CHARGING', 'OFF') NOT NULL DEFAULT 'OFF'"
    );
    await queryRunner.query(
      'ALTER TABLE `invoice` CHANGE `amount` `amount` decimal(15,2) NOT NULL DEFAULT 0.00'
    );
    await queryRunner.query(
      'ALTER TABLE `plan` CHANGE `costPerMinute` `costPerMinute` decimal(15,2) NOT NULL DEFAULT 0.00'
    );
    await queryRunner.query(
      'ALTER TABLE `plan` CHANGE `price` `price` decimal(15,2) NOT NULL DEFAULT 0.00'
    );
    await queryRunner.query('ALTER TABLE `bike` DROP COLUMN `createdAt`');
    await queryRunner.query('ALTER TABLE `bike` DROP COLUMN `updatedAt`');
    await queryRunner.query(
      'ALTER TABLE `bike` ADD `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)'
    );
    await queryRunner.query(
      'ALTER TABLE `bike` ADD `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)'
    );
  }
}
