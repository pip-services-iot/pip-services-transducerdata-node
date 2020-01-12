"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
let moment = require('moment');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const TransducerDataCommandSet_1 = require("./TransducerDataCommandSet");
class TransducerDataController {
    constructor() {
        this._dependencyResolver = new pip_services3_commons_node_2.DependencyResolver(TransducerDataController._defaultConfig);
        this._intervalMin = 15; // in minutes
        this._interval = this._intervalMin * 60000; // in msecs
    }
    configure(config) {
        this._dependencyResolver.configure(config);
        this._intervalMin = config.getAsLongWithDefault('options.interval', this._intervalMin);
        this._interval = this._intervalMin * 60000;
    }
    setReferences(references) {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired('persistence');
    }
    getCommandSet() {
        if (this._commandSet == null)
            this._commandSet = new TransducerDataCommandSet_1.TransducerDataCommandSet(this);
        return this._commandSet;
    }
    getFilterArrayParam(filter, singleParam, arrayParam) {
        let value = filter.get(singleParam);
        if (value != null)
            return [pip_services3_commons_node_4.IntegerConverter.toInteger(value)];
        value = filter.get(arrayParam);
        if (value == null)
            return null;
        if (_.isString(value))
            value = value.split(',');
        if (!_.isArray(value))
            return null;
        for (let index = 0; index < value.length; index++)
            value[index] = pip_services3_commons_node_4.IntegerConverter.toInteger(value[index]);
        return value;
    }
    filterValuesByIds(values, ids) {
        return _.filter(values, v => _.indexOf(ids, v.id) >= 0);
    }
    filterValuesByTypes(values, types) {
        return _.filter(values, v => _.indexOf(types, v.type) >= 0);
    }
    filterDataValues(data, filter) {
        if (filter == null)
            return;
        let paramIds = this.getFilterArrayParam(filter, 'param_id', 'param_ids');
        let paramTypes = this.getFilterArrayParam(filter, 'param_type', 'param_types');
        let eventIds = this.getFilterArrayParam(filter, 'event_id', 'event_ids');
        let eventTypes = this.getFilterArrayParam(filter, 'event_type', 'event_types');
        let commandIds = this.getFilterArrayParam(filter, 'command_id', 'command_ids');
        let commandTypes = this.getFilterArrayParam(filter, 'command_type', 'command_types');
        let stateIds = this.getFilterArrayParam(filter, 'state_id', 'state_ids');
        let stateTypes = this.getFilterArrayParam(filter, 'state_type', 'state_types');
        if (paramIds == null && paramTypes == null
            && eventIds == null && eventTypes == null
            && commandIds == null && commandTypes == null
            && stateIds == null && stateTypes == null)
            return;
        for (let dataSet of data) {
            for (let value of dataSet.values) {
                if (paramIds)
                    value.params = this.filterValuesByIds(value.params, paramIds);
                if (paramTypes)
                    value.params = this.filterValuesByTypes(value.params, paramTypes);
                if (eventIds)
                    value.events = this.filterValuesByIds(value.events, eventIds);
                if (eventTypes)
                    value.events = this.filterValuesByTypes(value.events, eventTypes);
                if (commandIds)
                    value.commands = this.filterValuesByIds(value.commands, commandIds);
                if (commandTypes)
                    value.commands = this.filterValuesByTypes(value.commands, commandTypes);
                if (stateIds)
                    value.states = this.filterValuesByIds(value.states, stateIds);
                if (stateTypes)
                    value.states = this.filterValuesByTypes(value.states, stateTypes);
            }
        }
    }
    getData(correlationId, filter, paging, callback) {
        this._persistence.getPageByFilter(correlationId, filter, paging, (err, page) => {
            if (page && page.data)
                this.filterDataValues(page.data, filter);
            callback(err, page);
        });
    }
    calculateStartTime(time) {
        let year = time.getUTCFullYear();
        let month = time.getUTCMonth();
        let day = time.getUTCDate();
        let hour = time.getUTCHours();
        let min = time.getUTCMinutes();
        let sec = time.getUTCSeconds();
        let msec = time.getUTCMilliseconds();
        let dayStartUtc = Date.UTC(year, month, day);
        let timeUtc = Date.UTC(year, month, day, hour, min, sec, msec);
        let offset = timeUtc - dayStartUtc;
        offset = offset - (offset % this._interval);
        return new Date(dayStartUtc + offset);
    }
    fixData(data) {
        data.time = pip_services3_commons_node_3.DateTimeConverter.toDateTime(data.time);
        return data;
    }
    addData(correlationId, data, callback) {
        data = this.fixData(data);
        let startTime = this.calculateStartTime(data.time);
        let endTime = new Date(startTime.getTime() + this._interval);
        let dataSet = {
            id: null,
            org_id: data.org_id,
            object_id: data.object_id,
            start_time: startTime,
            end_time: endTime,
            values: []
        };
        dataSet.values.push({
            time: data.time,
            params: data.params,
            events: data.events,
            commands: data.commands,
            states: data.states
        });
        this._persistence.addOne(correlationId, dataSet, callback);
    }
    addDataBatch(correlationId, data, callback) {
        if (data == null || data.length == 0) {
            if (callback)
                callback(null);
            return;
        }
        let dataSets = [];
        for (let dataItem of data) {
            dataItem = this.fixData(dataItem);
            let time = pip_services3_commons_node_3.DateTimeConverter.toDateTime(dataItem.time);
            let startTime = this.calculateStartTime(time);
            let endTime = new Date(startTime.getTime() + this._interval);
            let dataSet = {
                id: null,
                org_id: dataItem.org_id,
                object_id: dataItem.object_id,
                start_time: startTime,
                end_time: endTime,
                values: []
            };
            dataSet.values.push({
                time: dataItem.time,
                params: dataItem.params,
                events: dataItem.events,
                commands: dataItem.commands,
                states: dataItem.states
            });
            dataSets.push(dataSet);
        }
        this._persistence.addBatch(correlationId, dataSets, callback);
    }
    deleteData(correlationId, filter, callback) {
        this._persistence.deleteByFilter(correlationId, filter, callback);
    }
}
exports.TransducerDataController = TransducerDataController;
TransducerDataController._defaultConfig = pip_services3_commons_node_1.ConfigParams.fromTuples('dependencies.persistence', 'pip-services-transducerdata:persistence:*:*:1.0');
//# sourceMappingURL=TransducerDataController.js.map