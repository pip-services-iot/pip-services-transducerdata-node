let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { ObjectDataSetV1 } from '../../src/data/version1/ObjectDataSetV1';

import { ITransducerDataPersistence } from '../../src/persistence/ITransducerDataPersistence';

let now = new Date().getTime();
let interval = 300000;
let time1 = new Date(now);
let time2 = new Date(now + interval);
let time3 = new Date(now + 2 * interval);
let point1 = new Date(now);
let point2 = new Date(now + (interval / 2));
let point3 = new Date(now + interval);

export class TransducerDataPersistenceFixture {
    private _persistence: ITransducerDataPersistence;
    
    constructor(persistence) {
        assert.isNotNull(persistence);
        this._persistence = persistence;
    }

    private testAddTransducerData(done) {
        async.series([
            (callback) => {
                this._persistence.addBatch(
                    null,
                    [
                        { id: null, org_id: '1', object_id: '1', start_time: time1, end_time: time2, values: [ { time: point1, params: [{ id: 1, typ: 1, val: 1 }] } ] },
                        { id: null, org_id: '1', object_id: '1', start_time: time1, end_time: time2, values: [ { time: point2, params: [{ id: 1, typ: 1, val: 1 }] } ] },
                        { id: null, org_id: '1', object_id: '1', start_time: time2, end_time: time3, values: [ { time: point3, params: [{ id: 1, typ: 1, val: 1 }] } ] },
                        { id: null, org_id: '2', object_id: '2', start_time: time1, end_time: time2, values: [ { time: point1,  params: [{ id: 1, typ: 1, val: 1 }] } ] }
                    ],
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        ], done);
    }
                
    public testCrudOperations(done) {
        let data1: ObjectDataSetV1;

        async.series([
        // Create items
            (callback) => {
                this.testAddTransducerData(callback);
            },
        // Get all data
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    new FilterParams(),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 3);

                        data1 = page.data[0];

                        callback();
                    }
                );
            },
        // Delete data
            (callback) => {
                this._persistence.deleteByFilter(
                    null,
                    FilterParams.fromTuples('object_id', '1'),
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get delete data
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    new FilterParams(),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 1);

                        callback();
                    }
                );
            }
        ], done);
    }

    public testGetWithFilter(done) {
        async.series([
        // Create data
            (callback) => {
                this.testAddTransducerData(callback);
            },
        // Get data filtered by organization
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        org_id: '1'
                    }),
                    new PagingParams(),
                    (err, data) => {
                        assert.isNull(err);

                        assert.isObject(data);
                        assert.lengthOf(data.data, 2);

                        callback();
                    }
                );
            },
        // Get data by object_ids
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        object_ids: '2'
                    }),
                    new PagingParams(),
                    (err, data) => {
                        assert.isNull(err);

                        assert.isObject(data);
                        assert.lengthOf(data.data, 1);

                        callback();
                    }
                );
            },
        // Get data filtered time
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        from_time: time1,
                        to_time: time2
                    }),
                    new PagingParams(),
                    (err, data) => {
                        assert.isNull(err);

                        assert.isObject(data);
                        assert.lengthOf(data.data, 2);

                        callback();
                    }
                );
            },
        ], done);
    }

    public testFilterData(done) {
        let startTicks = new Date(2017, 1, 1, 0, 0, 0).getTime();

        async.series([
        // Create data
            (callback) => {
                let startTime = new Date(startTicks);
                let endTime = new Date(startTicks + 15 * 60000);

                let times = [];
                for (let i = 0; i < 10; i++)
                    times.push(new Date(startTicks + i * 5000));

                async.each(times, (time, callback) => {
                    this._persistence.addOne(
                        null,
                        { id: null, org_id: '1', object_id: '1', start_time: startTime, end_time: endTime, values: [{ time: time, params: [] }] },
                        callback
                    )
                }, callback);
            },
        // Get data filtered by organization
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        org_id: '1',
                        object_id: '1',
                        from_time: new Date(startTicks),
                        to_time: new Date(startTicks + 3 * 5000)
                    }),
                    new PagingParams(),
                    (err, data) => {
                        assert.isNull(err);

                        assert.isObject(data);
                        //assert.lengthOf(data.data, 1);

                        let dataItem = data.data[0];
                        // assert.lengthOf(data.data, 3);
                        assert.isTrue(data.data.length >= 1);

                        callback();
                    }
                );
            }
        ], done);
    }
    
}
