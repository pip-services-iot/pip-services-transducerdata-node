import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IGetter } from 'pip-services3-data-node';
import { IWriter } from 'pip-services3-data-node';

import { TransducerDataV1 } from '../data/version1/TransducerDataV1';
import { TransducerDataSetV1 } from '../data/version1/TransducerDataSetV1';

export interface ITransducerDataPersistence extends IGetter<TransducerDataSetV1, string>, IWriter<TransducerDataSetV1, string> {
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, 
        callback: (err: any, page: DataPage<TransducerDataSetV1>) => void): void;

    addOne(correlationId: string, data: TransducerDataSetV1,
        callback: (err: any) => void): void;

    addBatch(correlationId: string, data: TransducerDataSetV1[],
        callback: (err: any) => void): void;
            
    deleteByFilter(correlationId: string, filter: FilterParams,
        callback: (err: any) => void): void;
}
