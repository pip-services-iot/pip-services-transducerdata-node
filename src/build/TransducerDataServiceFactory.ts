import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';

import { TransducerDataMongoDbPersistence } from '../persistence/TransducerDataMongoDbPersistence';
import { TransducerDataFilePersistence } from '../persistence/TransducerDataFilePersistence';
import { TransducerDataMemoryPersistence } from '../persistence/TransducerDataMemoryPersistence';
import { TransducerDataController } from '../logic/TransducerDataController';
import { TransducerDataHttpServiceV1 } from '../services/version1/TransducerDataHttpServiceV1';

export class TransducerDataServiceFactory extends Factory {
	public static Descriptor = new Descriptor("pip-services-transducerdata", "factory", "default", "default", "1.0");
	public static MemoryPersistenceDescriptor = new Descriptor("pip-services-transducerdata", "persistence", "memory", "*", "1.0");
	public static FilePersistenceDescriptor = new Descriptor("pip-services-transducerdata", "persistence", "file", "*", "1.0");
	public static MongoDbPersistenceDescriptor = new Descriptor("pip-services-transducerdata", "persistence", "mongodb", "*", "1.0");
	public static ControllerDescriptor = new Descriptor("pip-services-transducerdata", "controller", "default", "*", "1.0");
	public static HttpServiceDescriptor = new Descriptor("pip-services-transducerdata", "service", "http", "*", "1.0");
	
	constructor() {
		super();
		this.registerAsType(TransducerDataServiceFactory.MemoryPersistenceDescriptor, TransducerDataMemoryPersistence);
		this.registerAsType(TransducerDataServiceFactory.FilePersistenceDescriptor, TransducerDataFilePersistence);
		this.registerAsType(TransducerDataServiceFactory.MongoDbPersistenceDescriptor, TransducerDataMongoDbPersistence);
		this.registerAsType(TransducerDataServiceFactory.ControllerDescriptor, TransducerDataController);
		this.registerAsType(TransducerDataServiceFactory.HttpServiceDescriptor, TransducerDataHttpServiceV1);
	}
	
}
