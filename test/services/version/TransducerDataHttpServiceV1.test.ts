let _ = require('lodash');
let async = require('async');
let restify = require('restify');
let assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

import { TransducerDataSetV1 } from '../../../src/data/version1/TransducerDataSetV1';
import { TransducerDataMemoryPersistence } from '../../../src/persistence/TransducerDataMemoryPersistence';
import { TransducerDataController } from '../../../src/logic/TransducerDataController';
import { TransducerDataHttpServiceV1 } from '../../../src/services/version1/TransducerDataHttpServiceV1';

let httpConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

let now = new Date().getTime();
let interval = 300000;
let point1 = new Date(now);
let point2 = new Date(now + (interval / 2));
let point3 = new Date(now + interval);

suite('TransducerDataHttpServiceV1', ()=> {    
    let service: TransducerDataHttpServiceV1;
    let rest: any;

    suiteSetup((done) => {
        let persistence = new TransducerDataMemoryPersistence();
        let controller = new TransducerDataController();

        controller.configure(ConfigParams.fromTuples(
            'options.interval', 5 // Set interval to 5 mins
        ));

        service = new TransducerDataHttpServiceV1();
        service.configure(httpConfig);

        let references: References = References.fromTuples(
            new Descriptor('pip-services-transducerdata', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('pip-services-transducerdata', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('pip-services-transducerdata', 'service', 'http', 'default', '1.0'), service
        );
        controller.setReferences(references);
        service.setReferences(references);

        service.open(null, done);
    });
    
    suiteTeardown((done) => {
        service.close(null, done);
    });

    setup(() => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*' });
    });
    
    
    test('CRUD Operations', (done) => {
        let data1: TransducerDataSetV1;

        async.series([
        // Create one data
            (callback) => {
                rest.post('/v1/transducer_data/add_data',
                    {
                        org_id: '1', 
                        data: { org_id: '1', object_id: '1', time: point1, params: [ { id: 1, typ: 1, val: 1 }, { id: 2, typ: 2, val: 2 } ] }
                    },
                    (err, req, res) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Create another data
            (callback) => {
                rest.post('/v1/transducer_data/add_data_batch',
                    {
                        org_id: '1', 
                        data: [
                            { org_id: '1', object_id: '1', time: point2, params: [ { id: 1, typ: 1, val: 1 }, { id: 2, typ: 2, val: 2 } ] },
                            { org_id: '1', object_id: '1', time: point3, params: [ { id: 1, typ: 1, val: 1 }, { id: 2, typ: 2, val: 2 } ] }
                        ]
                    },
                    (err, req, res) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Get all data
            (callback) => {
                rest.post('/v1/transducer_data/get_data',
                    {},
                    (err, req, res, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 2);

                        callback();
                    }
                );
            },
        // Delete data
            (callback) => {
                rest.post('/v1/transducer_data/delete_data',
                    {},
                    (err, req, res) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get delete data
            (callback) => {
                rest.post('/v1/transducer_data/get_data',
                    {},
                    (err, req, res, page) => {
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