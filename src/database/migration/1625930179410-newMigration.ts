import {MigrationInterface, QueryRunner} from "typeorm";

export class newMigration1625930179410 implements MigrationInterface {
    name = 'newMigration1625930179410'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `plan` CHANGE `price` `price` decimal(15,2) NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `plan` CHANGE `costPerMinute` `costPerMinute` decimal(15,2) NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `plan` CHANGE `freeMinutes` `freeMinutes` decimal(15,2) NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `invoice` CHANGE `amount` `amount` decimal(15,2) NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `station_monitoring` CHANGE `batteryPercent` `batteryPercent` double NOT NULL");
        await queryRunner.query("ALTER TABLE `station_monitoring` CHANGE `chargingPower` `chargingPower` double NOT NULL");
        await queryRunner.query("ALTER TABLE `bike_model` CHANGE `batteryCapacity` `batteryCapacity` double NOT NULL");
        await queryRunner.query("ALTER TABLE `bike_model` CHANGE `weight` `weight` double NOT NULL");
        await queryRunner.query("ALTER TABLE `bike_model` CHANGE `maxPower` `maxPower` double NOT NULL");
        await queryRunner.query("ALTER TABLE `bike_model` CHANGE `maxSpeed` `maxSpeed` double NOT NULL");
        await queryRunner.query("ALTER TABLE `bike_model` CHANGE `maxDistance` `maxDistance` double NOT NULL");
        await queryRunner.query("ALTER TABLE `bike` CHANGE `batteryPercent` `batteryPercent` double NOT NULL");
        await queryRunner.query("ALTER TABLE `station` CHANGE `coordinateX` `coordinateX` double NOT NULL");
        await queryRunner.query("ALTER TABLE `station` CHANGE `coordinateY` `coordinateY` double NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `station` CHANGE `coordinateY` `coordinateY` double(22) NOT NULL");
        await queryRunner.query("ALTER TABLE `station` CHANGE `coordinateX` `coordinateX` double(22) NOT NULL");
        await queryRunner.query("ALTER TABLE `bike` CHANGE `batteryPercent` `batteryPercent` double(22) NOT NULL");
        await queryRunner.query("ALTER TABLE `bike_model` CHANGE `maxDistance` `maxDistance` double(22) NOT NULL");
        await queryRunner.query("ALTER TABLE `bike_model` CHANGE `maxSpeed` `maxSpeed` double(22) NOT NULL");
        await queryRunner.query("ALTER TABLE `bike_model` CHANGE `maxPower` `maxPower` double(22) NOT NULL");
        await queryRunner.query("ALTER TABLE `bike_model` CHANGE `weight` `weight` double(22) NOT NULL");
        await queryRunner.query("ALTER TABLE `bike_model` CHANGE `batteryCapacity` `batteryCapacity` double(22) NOT NULL");
        await queryRunner.query("ALTER TABLE `station_monitoring` CHANGE `chargingPower` `chargingPower` double(22) NOT NULL");
        await queryRunner.query("ALTER TABLE `station_monitoring` CHANGE `batteryPercent` `batteryPercent` double(22) NOT NULL");
        await queryRunner.query("ALTER TABLE `invoice` CHANGE `amount` `amount` decimal(15,2) NOT NULL DEFAULT 0.00");
        await queryRunner.query("ALTER TABLE `plan` CHANGE `freeMinutes` `freeMinutes` decimal(15,2) NOT NULL DEFAULT 0.00");
        await queryRunner.query("ALTER TABLE `plan` CHANGE `costPerMinute` `costPerMinute` decimal(15,2) NOT NULL DEFAULT 0.00");
        await queryRunner.query("ALTER TABLE `plan` CHANGE `price` `price` decimal(15,2) NOT NULL DEFAULT 0.00");
    }

}
