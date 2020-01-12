let _ = require('lodash');
let async = require('async');
let restify = require('restify');
let assert = require('chai').assert;

import { ConfigParams, FilterParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

import { ObjectDataSetV1 } from '../../src/data/version1/ObjectDataSetV1';
import { TransducerDataMemoryPersistence } from '../../src/persistence/TransducerDataMemoryPersistence';
import { TransducerDataController } from '../../src/logic/TransducerDataController';

let now = new Date().getTime();
let interval = 300000;
let point1 = new Date(now);
let point2 = new Date(now + (interval / 2));
let point3 = new Date(now + interval);

suite('TransducerDataControllerV1', ()=> {    
    let persistence: TransducerDataMemoryPersistence;
    let controller: TransducerDataController;

    suiteSetup(() => {
        persistence = new TransducerDataMemoryPersistence();
        controller = new TransducerDataController();

        controller.configure(ConfigParams.fromTuples(
            'options.interval', 5 // Set interval to 5 mins
        ));

        let references: References = References.fromTuples(
            new Descriptor('pip-services-transducerdata', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('pip-services-transducerdata', 'controller', 'default', 'default', '1.0'), controller
        );
        controller.setReferences(references);
    });
    
    setup((done) => {
        persistence.clear(null, done);
    });
    
    
    test('CRUD Operations', (done) => {
        let data1: ObjectDataSetV1;

        async.series([
        // Create one data
            (callback) => {
                controller.addData(
                    null,
                    { org_id: '1', object_id: '1', time: point1, params: [ { id: 1, typ: 1, val: 1 }, { id: 2, typ: 2, val: 2 } ] },
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Create other data
            (callback) => {
                controller.addDataBatch(
                    null, 
                    [
                        { org_id: '1', object_id: '1', time: point2, params: [ { id: 1, typ: 1, val: 1 }, { id: 2, typ: 2, val: 2 } ] },
                        { org_id: '1', object_id: '1', time: point3, params: [ { id: 1, typ: 1, val: 1 }, { id: 2, typ: 2, val: 2 } ] }
                    ],
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Get all data
            (callback) => {
                controller.getData(
                    null,
                    FilterParams.fromTuples(
                        'param_ids', '0,1'
                    ),
                    null,
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 2);

                        let dataSet = page.data[0];
                        //assert.lengthOf(dataSet.values, 1);

                        let data = dataSet.values[0];
                        assert.lengthOf(data.params, 1);                        
                        assert.equal(1, data.params[0].id);

                        callback();
                    }
                );
            },
        // Delete data
            (callback) => {
                controller.deleteData(
                    null,
                    null,
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get delete data
            (callback) => {
                controller.getData(
                    null,
                    null,
                    null,
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 0);

                        callback();
                    }
                );
            }
        ], done);
    });
});