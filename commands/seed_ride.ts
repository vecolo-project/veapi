import Logger from '../src/logger';
import {Container} from 'typedi';
import databaseLoader from '../src/loaders/database';
import RideService from '../src/api/services/RideService';
import UserService from '../src/api/services/UserService';
import {User} from '../src/api/entities/User';
import BikeService from '../src/api/services/BikeService';
import {Station} from '../src/api/entities/Station';
import StationService from '../src/api/services/StationService';
import {Bike} from '../src/api/entities/Bike';
import {Ride} from '../src/api/entities/Ride';
import {addDays, addMinutes, differenceInCalendarDays} from 'date-fns';

const rideCount = 10;
const start = new Date();
const end = new Date('2021-07-26');
const difference = differenceInCalendarDays(end, start);

const run = async () => {
    Container.set('logger', Logger);
    const log = Logger.info;
    const connection = await databaseLoader();
    log('Database connection loaded successfully!');

    const rideService: RideService = Container.get(RideService);
    const userService: UserService = Container.get(UserService);
    const bikeService: BikeService = Container.get(BikeService);
    const stationService: StationService = Container.get(StationService);

    const userIds: { id: number }[] = await userService.getRepo().createQueryBuilder('user')
        .select('id')
        .getRawMany();

    const stationIds: { id: number }[] = await stationService.getRepo().createQueryBuilder('station')
        .select('id')
        .getRawMany();

    for (let i = 0; i < 2; i++) {
        const user: User = await userService.findOne(userIds[Math.floor(Math.random() * 10000 % userIds.length)].id);
        if (user.subscriptions?.length == 0) {
            log(`User ${user.id} don't have subscription, skipping...`);
            i--;
            continue;
        }
        const startDate = addDays(start, Math.floor(Math.random() * difference));
        const rideDuration = Math.floor(Math.random() * 60);
        const endDate = addMinutes(startDate, rideDuration);

        const startStation: Station = await stationService.findOne(stationIds[Math.floor(Math.random() * 10000 % stationIds.length)].id);
        const endStation: Station = await stationService.getRepo().createQueryBuilder('station')
            .leftJoin('bike', 'b', 'b.stationId = station.id')
            .select()
            .addSelect('count(distinct b.id) as bikeCount')
            .groupBy('station.id, station.bikeCapacity')
            .having(`bikeCount < station.bikeCapacity`)
            .getOne();

        const availableBikes: Bike[] = await bikeService.getAllFromStation(startStation.id, {limit: 100, offset: 0});

        const ride: Ride = await rideService.startRide(
            availableBikes[Math.floor(Math.random() * 10000 % availableBikes.length)],
            startStation,
            user,
            startDate
        );
        await rideService.endRide(
            user,
            ride,
            endStation,
            Math.floor(20 * rideDuration * +Math.random() * 20),
            endDate
        );
        log(`Ride ${ride.id} inserted (${i + 1}/${rideCount})`);
    }


};


run().then(r => console.log('Rides Seeded'));
