import { ConfigParams } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { JsonFilePersister } from 'pip-services3-data-node';

import { TransducerDataMemoryPersistence } from './TransducerDataMemoryPersistence';
import { ObjectDataSetV1 } from '../data/version1/ObjectDataSetV1';

export class TransducerDataFilePersistence extends TransducerDataMemoryPersistence {
	protected _persister: JsonFilePersister<ObjectDataSetV1>;

    public constructor(path?: string) {
        super();

        this._persister = new JsonFilePersister<ObjectDataSetV1>(path);
        this._loader = this._persister;
        this._saver = this._persister;
    }

    public configure(config: ConfigParams): void {
        super.configure(config);
        this._persister.configure(config);
    }

}