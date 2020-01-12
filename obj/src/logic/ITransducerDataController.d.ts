import { DataPage } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { ObjectDataV1 } from '../data/version1/ObjectDataV1';
import { ObjectDataSetV1 } from '../data/version1/ObjectDataSetV1';
export interface ITransducerDataController {
    getData(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<ObjectDataSetV1>) => void): void;
    addData(correlationId: string, data: ObjectDataV1, callback?: (err: any) => void): void;
    addDataBatch(correlationId: string, data: ObjectDataV1[], callback?: (err: any) => void): void;
    deleteData(correlationId: string, filter: FilterParams, callback?: (err: any) => void): void;
}
