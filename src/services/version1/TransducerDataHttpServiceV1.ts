import { Descriptor } from 'pip-services3-commons-node';
import { CommandableHttpService } from 'pip-services3-rpc-node';

export class TransducerDataHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('v1/transducer_data');
        this._dependencyResolver.put('controller', new Descriptor('pip-services-transducerdata', 'controller', 'default', '*', '1.0'));
    }
}