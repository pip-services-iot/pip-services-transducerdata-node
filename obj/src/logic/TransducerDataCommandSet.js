"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const pip_services3_commons_node_5 = require("pip-services3-commons-node");
const pip_services3_commons_node_6 = require("pip-services3-commons-node");
const pip_services3_commons_node_7 = require("pip-services3-commons-node");
const pip_services3_commons_node_8 = require("pip-services3-commons-node");
const ObjectDataV1Schema_1 = require("../data/version1/ObjectDataV1Schema");
class TransducerDataCommandSet extends pip_services3_commons_node_1.CommandSet {
    constructor(logic) {
        super();
        this._logic = logic;
        // Register commands to the database
        this.addCommand(this.makeGetDataCommand());
        this.addCommand(this.makeAddDataCommand());
        this.addCommand(this.makeAddDataBatchCommand());
        this.addCommand(this.makeDeleteDataCommand());
    }
    makeGetDataCommand() {
        return new pip_services3_commons_node_2.Command("get_data", new pip_services3_commons_node_5.ObjectSchema(true)
            .withOptionalProperty('filter', new pip_services3_commons_node_7.FilterParamsSchema())
            .withOptionalProperty('paging', new pip_services3_commons_node_8.PagingParamsSchema()), (correlationId, args, callback) => {
            let filter = pip_services3_commons_node_3.FilterParams.fromValue(args.get("filter"));
            let paging = pip_services3_commons_node_4.PagingParams.fromValue(args.get("paging"));
            this._logic.getData(correlationId, filter, paging, callback);
        });
    }
    makeAddDataCommand() {
        return new pip_services3_commons_node_2.Command("add_data", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('data', new ObjectDataV1Schema_1.ObjectDataV1Schema()), (correlationId, args, callback) => {
            let data = args.get("data");
            this._logic.addData(correlationId, data, (err) => {
                if (callback)
                    callback(err, null);
            });
        });
    }
    makeAddDataBatchCommand() {
        return new pip_services3_commons_node_2.Command("add_data_batch", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('data', new pip_services3_commons_node_6.ArraySchema(new ObjectDataV1Schema_1.ObjectDataV1Schema())), (correlationId, args, callback) => {
            let data = args.get("data");
            this._logic.addDataBatch(correlationId, data, (err) => {
                if (callback)
                    callback(err, null);
            });
        });
    }
    makeDeleteDataCommand() {
        return new pip_services3_commons_node_2.Command("delete_data", new pip_services3_commons_node_5.ObjectSchema(true)
            .withOptionalProperty('filter', new pip_services3_commons_node_7.FilterParamsSchema()), (correlationId, args, callback) => {
            let filter = pip_services3_commons_node_3.FilterParams.fromValue(args.get("filter"));
            this._logic.deleteData(correlationId, filter, (err) => {
                if (callback)
                    callback(err, null);
            });
        });
    }
}
exports.TransducerDataCommandSet = TransducerDataCommandSet;
//# sourceMappingURL=TransducerDataCommandSet.js.map