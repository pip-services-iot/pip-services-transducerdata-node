import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMemoryPersistence } from 'pip-services3-data-node';
import { ObjectDataSetV1 } from '../data/version1/ObjectDataSetV1';
import { ITransducerDataPersistence } from './ITransducerDataPersistence';
export declare class TransducerDataMemoryPersistence extends IdentifiableMemoryPersistence<ObjectDataSetV1, string> implements ITransducerDataPersistence {
    constructor();
    private contains;
    private composeFilter;
    private filterResults;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<ObjectDataSetV1>) => void): void;
    addOne(correlationId: string, data: ObjectDataSetV1, callback: (err: any) => void): void;
    addBatch(correlationId: string, data: ObjectDataSetV1[], callback: (err: any) => void): void;
    deleteByFilter(correlationId: string, filter: FilterParams, callback: (err: any) => void): void;
}
