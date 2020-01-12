import { ConfigParams } from 'pip-services3-commons-node';
import { JsonFilePersister } from 'pip-services3-data-node';
import { TransducerDataMemoryPersistence } from './TransducerDataMemoryPersistence';
import { TransducerDataSetV1 } from '../data/version1/TransducerDataSetV1';
export declare class TransducerDataFilePersistence extends TransducerDataMemoryPersistence {
    protected _persister: JsonFilePersister<TransducerDataSetV1>;
    constructor(path?: string);
    configure(config: ConfigParams): void;
}
