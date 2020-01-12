import { ConfigParams } from 'pip-services3-commons-node';

import { TransducerDataFilePersistence } from '../../src/persistence/TransducerDataFilePersistence';
import { TransducerDataPersistenceFixture } from './TransducerDataPersistenceFixture';

suite('TransducerDataFilePersistence', ()=> {
    let persistence: TransducerDataFilePersistence;
    let fixture: TransducerDataPersistenceFixture;
    
    setup((done) => {
        persistence = new TransducerDataFilePersistence('./data/transducer_data.test.json');

        fixture = new TransducerDataPersistenceFixture(persistence);

        persistence.open(null, (err) => {
            persistence.clear(null, done);
        });
    });
    
    teardown((done) => {
        persistence.close(null, done);
    });
        
    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });

    test('Get with Filters', (done) => {
        fixture.testGetWithFilter(done);
    });

    test('Filter Data', (done) => {
        fixture.testFilterData(done);
    });
    
});