"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_container_node_1 = require("pip-services3-container-node");
const TransducerDataServiceFactory_1 = require("../build/TransducerDataServiceFactory");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
class TransducerDataProcess extends pip_services3_container_node_1.ProcessContainer {
    constructor() {
        super("transducer_data", "Transducer data microservice");
        this._factories.add(new TransducerDataServiceFactory_1.TransducerDataServiceFactory);
        this._factories.add(new pip_services3_rpc_node_1.DefaultRpcFactory);
    }
}
exports.TransducerDataProcess = TransducerDataProcess;
//# sourceMappingURL=TransducerDataProcess.js.map