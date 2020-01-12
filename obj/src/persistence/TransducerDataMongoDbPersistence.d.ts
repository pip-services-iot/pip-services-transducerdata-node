import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-node';
import { TransducerDataSetV1 } from '../data/version1/TransducerDataSetV1';
import { ITransducerDataPersistence } from './ITransducerDataPersistence';
export declare class TransducerDataMongoDbPersistence extends IdentifiableMongoDbPersistence<TransducerDataSetV1, string> implements ITransducerDataPersistence {
    constructor();
    private composeFilter;
    private filterResults;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<TransducerDataSetV1>) => void): void;
    addOne(correlationId: string, data: TransducerDataSetV1, callback: (err: any) => void): void;
    addBatch(correlationId: string, dataSet: TransducerDataSetV1[], callback: (err: any) => void): void;
    deleteByFilter(correlationId: string, filter: FilterParams, callback: (err: any) => void): void;
}
