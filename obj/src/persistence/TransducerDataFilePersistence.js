"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_data_node_1 = require("pip-services3-data-node");
const TransducerDataMemoryPersistence_1 = require("./TransducerDataMemoryPersistence");
class TransducerDataFilePersistence extends TransducerDataMemoryPersistence_1.TransducerDataMemoryPersistence {
    constructor(path) {
        super();
        this._persister = new pip_services3_data_node_1.JsonFilePersister(path);
        this._loader = this._persister;
        this._saver = this._persister;
    }
    configure(config) {
        super.configure(config);
        this._persister.configure(config);
    }
}
exports.TransducerDataFilePersistence = TransducerDataFilePersistence;
//# sourceMappingURL=TransducerDataFilePersistence.js.map