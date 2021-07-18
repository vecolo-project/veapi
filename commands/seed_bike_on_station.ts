import Logger from '../src/logger';
import {Container} from 'typedi';
import databaseLoader from '../src/loaders/database';
import BikeService from '../src/api/services/BikeService';
import {Bike} from '../src/api/entities/Bike';
import StationService from '../src/api/services/StationService';

const fillStationPercent = 90;

const run = async () => {
    Container.set('logger', Logger);
    const log = Logger.info;
    const connection = await databaseLoader();
    log('Database connection loaded successfully!');

    const bikeService: BikeService = Container.get(BikeService);
    const stationService: StationService = Container.get(StationService);

    const bikeList: Bike[] = await bikeService.getRepo().find({where: {station: null}});
    for (const bike of bikeList) {
        const station = await stationService.getRepo().createQueryBuilder('station')
            .leftJoin('bike', 'b', 'b.stationId = station.id')
            .select()
            .addSelect('count(distinct b.id) as bikeCount')
            .groupBy('station.id, station.bikeCapacity')
            .having(`bikeCount < ROUND(station.bikeCapacity * ${fillStationPercent} / 100)`)
            .getOne();
        if (!station) {
            log('Can\'t fill anymore station !');
            return;
        }
        bike.station = station;
        await bikeService.update(bike.id, bike);
        log(`Bike ${bike.id} attached to station ${station.id}`);
    }
};


run().then(r => console.log('Bikes on station Seeded'));
