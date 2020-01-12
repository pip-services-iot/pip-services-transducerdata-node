import { ConfigParams } from 'pip-services3-commons-node';

import { TransducerDataMemoryPersistence } from '../../src/persistence/TransducerDataMemoryPersistence';
import { TransducerDataPersistenceFixture } from './TransducerDataPersistenceFixture';

suite('TransducerDataMemoryPersistence', ()=> {
    let persistence: TransducerDataMemoryPersistence;
    let fixture: TransducerDataPersistenceFixture;
    
    setup((done) => {
        persistence = new TransducerDataMemoryPersistence();
        persistence.configure(new ConfigParams());
        
        fixture = new TransducerDataPersistenceFixture(persistence);
        
        persistence.open(null, done);
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