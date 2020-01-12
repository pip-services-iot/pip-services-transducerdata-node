let _ = require('lodash');
let async = require('async');
let moment = require('moment');

import { ConfigParams, Command } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { DependencyResolver } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { ICommandable } from 'pip-services3-commons-node';
import { CommandSet } from 'pip-services3-commons-node';
import { DateTimeConverter } from 'pip-services3-commons-node';
import { IntegerConverter } from 'pip-services3-commons-node';

import { TransducerDataV1 } from '../data/version1/TransducerDataV1';
import { TransducerDataSetV1 } from '../data/version1/TransducerDataSetV1';
import { ITransducerDataPersistence } from '../persistence/ITransducerDataPersistence';
import { ITransducerDataController } from './ITransducerDataController';
import { TransducerDataCommandSet } from './TransducerDataCommandSet';
import { TransducerDataValueV1 } from '../data/version1';

export class TransducerDataController implements  IConfigurable, IReferenceable, ICommandable, ITransducerDataController {
    private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        'dependencies.persistence', 'pip-services-transducerdata:persistence:*:*:1.0'
    );

    private _dependencyResolver: DependencyResolver = new DependencyResolver(TransducerDataController._defaultConfig);
    private _persistence: ITransducerDataPersistence;
    private _commandSet: TransducerDataCommandSet;
    private _intervalMin: number = 15; // in minutes
    private _interval: number = this._intervalMin * 60000; // in msecs

    public configure(config: ConfigParams): void {
        this._dependencyResolver.configure(config);

        this._intervalMin = config.getAsLongWithDefault('options.interval', this._intervalMin);
        this._interval = this._intervalMin * 60000;
    }

    public setReferences(references: IReferences): void {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired<ITransducerDataPersistence>('persistence');
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null)
            this._commandSet = new TransducerDataCommandSet(this);
        return this._commandSet;
    }

    private getFilterArrayParam(filter: FilterParams, singleParam: string, arrayParam: string): number[] {
        let value: any = filter.get(singleParam);
        if (value != null)
            return [ IntegerConverter.toInteger(value) ];
        
        value = filter.get(arrayParam);
        if (value == null)
            return null;
        if (_.isString(value))
            value = value.split(',');
        if (!_.isArray(value))
            return null;

        for (let index = 0; index < value.length; index++)
            value[index] = IntegerConverter.toInteger(value[index]);

        return value;
    }

    private filterValuesByIds(values: TransducerDataValueV1[], ids: number[]) {
        return _.filter(values, v => _.indexOf(ids, v.id) >= 0);
    }

    private filterValuesByTypes(values: TransducerDataValueV1[], types: number[]) {
        return _.filter(values, v => _.indexOf(types, v.type) >= 0);
    }

    private filterDataValues(data: TransducerDataSetV1[], filter: FilterParams): void {
        if (filter == null) return;

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

    public getData(correlationId: string, filter: FilterParams, paging: PagingParams, 
        callback: (err: any, page: DataPage<TransducerDataSetV1>) => void): void {
        this._persistence.getPageByFilter(correlationId, filter, paging, (err, page) => {
            if (page && page.data)
                this.filterDataValues(page.data, filter);
 
            callback(err, page);
        });
    }
    
    private calculateStartTime(time: Date): Date {
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

    private fixData(data: TransducerDataV1): TransducerDataV1 {
        data.time = DateTimeConverter.toDateTime(data.time);
        return data;
    }

    public addData(correlationId: string, data: TransducerDataV1,
        callback?: (err: any) => void): void {

        data = this.fixData(data);

        let startTime: Date = this.calculateStartTime(data.time);
        let endTime: Date = new Date(startTime.getTime() + this._interval);

        let dataSet: TransducerDataSetV1 = {
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

    public addDataBatch(correlationId: string, data: TransducerDataV1[],
        callback?: (err: any) => void): void {
        
        if (data == null || data.length == 0) {
            if (callback) callback(null);
            return;
        }

        let dataSets: TransducerDataSetV1[] = [];
        
        for (let dataItem of data) {
            dataItem = this.fixData(dataItem);

            let time = DateTimeConverter.toDateTime(dataItem.time);
            let startTime = this.calculateStartTime(time);
            let endTime = new Date(startTime.getTime() + this._interval);

            let dataSet: TransducerDataSetV1 = {
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
    
    public deleteData(correlationId: string, filter: FilterParams,
        callback?: (err: any) => void): void {  
        this._persistence.deleteByFilter(correlationId, filter, callback);
    }

}
