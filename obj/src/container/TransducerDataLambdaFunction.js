"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_aws_node_1 = require("pip-services3-aws-node");
const TransducerDataServiceFactory_1 = require("../build/TransducerDataServiceFactory");
class TransducerDataLambdaFunction extends pip_services3_aws_node_1.CommandableLambdaFunction {
    constructor() {
        super("transducer_data", "Transducer data function");
        this._dependencyResolver.put('controller', new pip_services3_commons_node_1.Descriptor('pip-services-transducerdata', 'controller', 'default', '*', '*'));
        this._factories.add(new TransducerDataServiceFactory_1.TransducerDataServiceFactory());
    }
}
exports.TransducerDataLambdaFunction = TransducerDataLambdaFunction;
exports.handler = new TransducerDataLambdaFunction().getHandler();
//# sourceMappingURL=TransducerDataLambdaFunction.js.map