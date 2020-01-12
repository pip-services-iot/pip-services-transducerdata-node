"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_data_node_1 = require("pip-services3-data-node");
class TransducerDataMemoryPersistence extends pip_services3_data_node_1.IdentifiableMemoryPersistence {
    constructor() {
        super();
    }
    contains(array1, array2) {
        if (array1 == null || array2 == null)
            return false;
        for (let i1 = 0; i1 < array1.length; i1++) {
            for (let i2 = 0; i2 < array2.length; i2++)
                if (array1[i1] == array2[i1])
                    return true;
        }
        return false;
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let objectId = filter.getAsNullableString('object_id');
        let orgId = filter.getAsNullableString('org_id');
        let objectIds = filter.getAsObject('object_ids');
        let fromTime = filter.getAsNullableDateTime('from_time');
        let toTime = filter.getAsNullableDateTime('to_time');
        // Process ids filter
        if (_.isString(objectIds))
            objectIds = objectIds.split(',');
        if (!_.isArray(objectIds))
            objectIds = null;
        return (item) => {
            if (objectId && item.object_id != objectId)
                return false;
            if (objectIds && _.indexOf(objectIds, item.object_id) < 0)
                return false;
            if (orgId && item.org_id != orgId)
                return false;
            if (fromTime && item.end_time.getTime() < fromTime.getTime())
                return false;
            if (toTime && item.start_time.getTime() >= toTime.getTime())
                return false;
            return true;
        };
    }
    filterResults(filter, callback) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let fromTime = filter.getAsNullableDateTime('from_time');
        let toTime = filter.getAsNullableDateTime('to_time');
        return (err, page) => {
            // Skip when error occured
            if (err != null || page == null) {
                callback(err, page);
                return;
            }
            // Filter out all elements without object id
            for (let item of page.data) {
                if (fromTime != null)
                    item.values = _.filter(item.values, s => s.time >= fromTime);
                if (toTime != null)
                    item.values = _.filter(item.values, s => s.time < toTime);
            }
            callback(err, page);
        };
    }
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, this.filterResults(filter, callback));
    }
    addOne(correlationId, data, callback) {
        let item = this._items.find((x) => {
            return x.org_id == data.org_id
                && x.object_id == data.object_id
                && x.start_time.getTime() >= data.start_time.getTime()
                && x.end_time.getTime() >= data.end_time.getTime();
        });
        if (item == null) {
            item = {
                id: pip_services3_commons_node_2.IdGenerator.nextLong(),
                org_id: data.org_id,
                object_id: data.object_id,
                start_time: data.start_time,
                end_time: data.end_time
            };
            this._items.push(item);
        }
        item.values = item.values || [];
        item.values.push(...data.values);
        this._logger.trace(correlationId, "Added data for " + data.object_id + " at " + data.start_time);
        this.save(correlationId, (err) => {
            if (callback)
                callback(err);
        });
    }
    addBatch(correlationId, data, callback) {
        async.each(data, (d, callback) => {
            this.addOne(correlationId, d, callback);
        }, callback);
    }
    deleteByFilter(correlationId, filter, callback) {
        super.deleteByFilter(correlationId, this.composeFilter(filter), callback);
    }
}
exports.TransducerDataMemoryPersistence = TransducerDataMemoryPersistence;
//# sourceMappingURL=TransducerDataMemoryPersistence.js.map