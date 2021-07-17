import Logger from '../src/logger';
import BikeModelService from '../src/api/services/BikeModelService';
import {Container} from 'typedi';
import databaseLoader from '../src/loaders/database';
import BikeService from '../src/api/services/BikeService';
import {BikeModel} from '../src/api/entities/BikeModel';
import {Bike, BikeStatus} from '../src/api/entities/Bike';

const fillCount = 1700;

const run = async () => {
    Container.set('logger', Logger);
    const log = Logger.info;
    const connection = await databaseLoader();
    log('Database connection loaded successfully!');

    const bikeModelService: BikeModelService = Container.get(BikeModelService);
    const bikeService: BikeService = Container.get(BikeService);

    const modelList: BikeModel[] = await bikeModelService.getRepo().find();
    const enumStatus = [
        BikeStatus.OFF,
        BikeStatus.RECHARGING,
        BikeStatus.IN_RIDE,
        BikeStatus.MAINTAINING,
    ];

    for (let i = 0; i < fillCount; i++) {
        let matriculate;
        while (!matriculate) {
            matriculate = Math.floor(100000 + Math.random() * 100000).toString();
            if (await bikeService.getRepo().findOne({where: {matriculate}})) {
                matriculate = undefined;
            }
        }
        const bike: Partial<Bike> = {
            matriculate,
            model: modelList[Math.floor(Math.random() * 1000) % modelList.length],
            status: enumStatus[Math.floor(Math.random() * 100) % enumStatus.length],
            recharging: true,
            batteryPercent: Math.floor(Math.random() * 100),
            station: null
        };
        await bikeService.getRepo().save(bike);
    }

};


run().then(r => console.log('Bikes Seeded'));
