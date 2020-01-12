import { Descriptor } from 'pip-services3-commons-node';
import { CommandableLambdaFunction } from 'pip-services3-aws-node';
import { TransducerDataServiceFactory } from '../build/TransducerDataServiceFactory';

export class TransducerDataLambdaFunction extends CommandableLambdaFunction {
    public constructor() {
        super("transducer_data", "Transducer data function");
        this._dependencyResolver.put('controller', new Descriptor('pip-services-transducerdata', 'controller', 'default', '*', '*'));
        this._factories.add(new TransducerDataServiceFactory());
    }
}

export const handler = new TransducerDataLambdaFunction().getHandler();