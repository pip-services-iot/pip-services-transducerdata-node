let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { Descriptor } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';
import { ConsoleLogger } from 'pip-services3-components-node';

import { TransducerDataSetV1 } from '../../src/data/version1/TransducerDataSetV1';
import { TransducerDataMemoryPersistence } from '../../src/persistence/TransducerDataMemoryPersistence';
import { TransducerDataController } from '../../src/logic/TransducerDataController';
import { TransducerDataLambdaFunction } from '../../src/container/TransducerDataLambdaFunction';

let now = new Date().getTime();
let interval = 300000;
let point1 = new Date(now);
let point2 = new Date(now + (interval / 2));
let point3 = new Date(now + interval);

suite('TransducerDataLambdaFunction', ()=> {
    let lambda: TransducerDataLambdaFunction;

    suiteSetup((done) => {
        let config = ConfigParams.fromTuples(
            'logger.descriptor', 'pip-services:logger:console:default:1.0',
            'persistence.descriptor', 'pip-services-transducerdata:persistence:memory:default:1.0',
            'controller.descriptor', 'pip-services-transducerdata:controller:default:default:1.0'
        );

        lambda = new TransducerDataLambdaFunction();
        lambda.configure(config);
        lambda.open(null, done);
    });
    
    suiteTeardown((done) => {
        lambda.close(null, done);
    });
    
    test('CRUD Operations', (done) => {
        let data1: TransducerDataSetV1;

        async.series([
        // Create one data
            (callback) => {
                lambda.act(
                    {
                        cmd: 'add_data',
                        data: { org_id: '1', object_id: '1', time: point1, params: [ { id: 1, typ: 1, val: 1 }, { id: 2, typ: 2, val: 2 } ] }
                    },
                    (err, result) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Create another data
            (callback) => {
                lambda.act(
                    {
                        cmd: 'add_data_batch',
                        data: [
                            { org_id: '1', object_id: '1', time: point2, params: [ { id: 1, typ: 1, val: 1 }, { id: 2, typ: 2, val: 2 } ] },
                            { org_id: '1', object_id: '1', time: point3, params: [ { id: 1, typ: 1, val: 1 }, { id: 2, typ: 2, val: 2 } ] }
                        ]
                    },
                    (err, result) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Get all data
            (callback) => {
                lambda.act(
                    {
                        cmd: 'get_data',
                    },
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.isTrue(page.data.length >= 1);

                        callback();
                    }
                );
            },
        // Delete data
            (callback) => {
                lambda.act(
                    {
                        cmd: 'delete_data',
                    },
                    (err, result) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get delete data
            (callback) => {
                lambda.act(
                    {
                        cmd: 'get_data',
                    },
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