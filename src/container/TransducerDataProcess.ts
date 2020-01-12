import { IReferences } from 'pip-services3-commons-node';
import { ProcessContainer } from 'pip-services3-container-node';

import { TransducerDataServiceFactory } from '../build/TransducerDataServiceFactory';
import { DefaultRpcFactory } from 'pip-services3-rpc-node';

export class TransducerDataProcess extends ProcessContainer {

    public constructor() {
        super("transducer_data", "Transducer data microservice");
        this._factories.add(new TransducerDataServiceFactory);
        this._factories.add(new DefaultRpcFactory);
    }

}
