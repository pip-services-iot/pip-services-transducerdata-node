"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const TransducerDataMongoDbPersistence_1 = require("../persistence/TransducerDataMongoDbPersistence");
const TransducerDataFilePersistence_1 = require("../persistence/TransducerDataFilePersistence");
const TransducerDataMemoryPersistence_1 = require("../persistence/TransducerDataMemoryPersistence");
const TransducerDataController_1 = require("../logic/TransducerDataController");
const TransducerDataHttpServiceV1_1 = require("../services/version1/TransducerDataHttpServiceV1");
class TransducerDataServiceFactory extends pip_services3_components_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(TransducerDataServiceFactory.MemoryPersistenceDescriptor, TransducerDataMemoryPersistence_1.TransducerDataMemoryPersistence);
        this.registerAsType(TransducerDataServiceFactory.FilePersistenceDescriptor, TransducerDataFilePersistence_1.TransducerDataFilePersistence);
        this.registerAsType(TransducerDataServiceFactory.MongoDbPersistenceDescriptor, TransducerDataMongoDbPersistence_1.TransducerDataMongoDbPersistence);
        this.registerAsType(TransducerDataServiceFactory.ControllerDescriptor, TransducerDataController_1.TransducerDataController);
        this.registerAsType(TransducerDataServiceFactory.HttpServiceDescriptor, TransducerDataHttpServiceV1_1.TransducerDataHttpServiceV1);
    }
}
exports.TransducerDataServiceFactory = TransducerDataServiceFactory;
TransducerDataServiceFactory.Descriptor = new pip_services3_commons_node_1.Descriptor("pip-services-transducerdata", "factory", "default", "default", "1.0");
TransducerDataServiceFactory.MemoryPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-transducerdata", "persistence", "memory", "*", "1.0");
TransducerDataServiceFactory.FilePersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-transducerdata", "persistence", "file", "*", "1.0");
TransducerDataServiceFactory.MongoDbPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-transducerdata", "persistence", "mongodb", "*", "1.0");
TransducerDataServiceFactory.ControllerDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-transducerdata", "controller", "default", "*", "1.0");
TransducerDataServiceFactory.HttpServiceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-transducerdata", "service", "http", "*", "1.0");
//# sourceMappingURL=TransducerDataServiceFactory.js.map