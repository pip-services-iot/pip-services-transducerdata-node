import { DataPage } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { TransducerDataV1 } from '../data/version1/TransducerDataV1';
import { TransducerDataSetV1 } from '../data/version1/TransducerDataSetV1';

export interface ITransducerDataController {
    getData(correlationId: string, filter: FilterParams, paging: PagingParams, 
        callback: (err: any, page: DataPage<TransducerDataSetV1>) => void): void;

    addData(correlationId: string, data: TransducerDataV1,
        callback?: (err: any) => void): void;

    addDataBatch(correlationId: string, data: TransducerDataV1[],
        callback?: (err: any) => void): void;
            
    deleteData(correlationId: string, filter: FilterParams,
        callback?: (err: any) => void): void;
}
