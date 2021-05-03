import { EntityRepository, IDatabaseDriver, MikroORM } from "@mikro-orm/core";
import { User as ApplicationUser } from './entities/user';

declare global {
    namespace Express {

        interface User extends ApplicationUser {}

        interface Request {
            orm: MikroORM<IDatabaseDriver>;
            cardRepository?: EntityRepository<Card>;
            monsterRepository?: EntityRepository<Monster>;
            deckRepository?: EntityRepository<Deck>;
            userRepository?: EntityRepository<User>;
        }
    }
}