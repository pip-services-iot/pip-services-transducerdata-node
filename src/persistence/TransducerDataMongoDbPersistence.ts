let _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdGenerator } from 'pip-services3-commons-node';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-node';

import { TransducerDataValueV1 } from '../data/version1/TransducerDataValueV1';
import { TransducerDataV1 } from '../data/version1/TransducerDataV1';
import { TransducerDataSetV1 } from '../data/version1/TransducerDataSetV1';
import { ITransducerDataPersistence } from './ITransducerDataPersistence';

export class TransducerDataMongoDbPersistence
    extends IdentifiableMongoDbPersistence<TransducerDataSetV1, string>
    implements ITransducerDataPersistence {

    constructor() {
        super('transducer_data');
        super.ensureIndex({ org_id: 1, object_id: 1 });
        super.ensureIndex({ start_time: -1, end_time: -1 });
    }

    private composeFilter(filter: any) {
        filter = filter || new FilterParams();

        let criteria = [];

        let orgId = filter.getAsNullableString('org_id');
        if (orgId != null)
            criteria.push({ org_id: orgId });

        let objectId = filter.getAsNullableString('object_id');
        if (objectId != null)
            criteria.push({ object_id: objectId });

        // Filter ids
        let objectIds = filter.getAsObject('object_ids');
        if (_.isString(objectIds))
            objectIds = objectIds.split(',');
        if (_.isArray(objectIds))
            criteria.push({ object_id: { $in: objectIds } });

        let fromTime = filter.getAsNullableDateTime('from_time');
        if (fromTime != null)
            criteria.push({ end_time: { $gte: fromTime } });

        let toTime = filter.getAsNullableDateTime('to_time');
        if (toTime != null)
            criteria.push({ start_time: { $lt: toTime } });

        return criteria.length > 0 ? { $and: criteria } : null;
    }

    private filterResults(filter: FilterParams,
        callback: (err: any, page: DataPage<TransducerDataSetV1>) => void): any {
        filter = filter || new FilterParams();

        let fromTime = filter.getAsNullableDateTime('from_time');
        let toTime = filter.getAsNullableDateTime('to_time');
        let bigPeriod = filter.getAsNullableBoolean('big_period');

        return (err: any, page: DataPage<TransducerDataSetV1>) => {
            // Skip for better performance when get big amount of data
            if (bigPeriod) {
                callback(err, page);
                return;
            }
            // Skip when error occured
            if (err != null || page == null) {
                callback(err, page);
                return;
            }

            // Filter out all elements without object id
            for (let item of page.data) {
                if (fromTime != null)
                    item.values = _.filter(item.values, s => s.time >= fromTime);
                if (toTime != null)
                    item.values = _.filter(item.values, s => s.time < toTime);
            }

            callback(err, page);
        };
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<TransducerDataSetV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter),
            paging, "-start_time", null, this.filterResults(filter, callback));
    }

    public addOne(correlationId: string, data: TransducerDataSetV1,
        callback: (err: any) => void): void {

        let filter = {
            //_id: mongoose.Types.ObjectId(),
            org_id: data.org_id,
            object_id: data.object_id,
            start_time: { $lte: data.start_time },
            end_time: { $gte: data.end_time }
        };

        let newItem = {
            $push: { 
                values: { $each: data.values } 
            },
            $setOnInsert: {
                _id: IdGenerator.nextLong(),
                org_id: data.org_id,
                object_id: data.object_id,
                start_time: data.start_time,
                end_time: data.end_time
            }
        };

        let options = {
            returnOriginal: false,
            upsert: true
        };

        this._collection.findOneAndUpdate(filter, newItem, options, (err) => {
            if (!err)
                this._logger.trace(correlationId, "Added data for " + data.object_id + " at " + data.start_time);

            if (callback) callback(err);
        });
    }

    public addBatch(correlationId: string, dataSet: TransducerDataSetV1[],
        callback: (err: any) => void): void {

        if (dataSet == null || dataSet.length == 0) {
            if (callback) callback(null);
            return;
        }

        let batch = this._collection.initializeUnorderedBulkOp();

        for (let data of dataSet) {
            batch
                .find({
                    org_id: data.org_id,
                    object_id: data.object_id,
                    start_time: { $lte: data.start_time },
                    end_time: { $gte: data.end_time }
                })
                .upsert()
                .updateOne({
                    $push: { 
                        values: { $each: data.values } 
                    },
                    $setOnInsert: {
                        _id: IdGenerator.nextLong(),
                        org_id: data.org_id,
                        object_id: data.object_id,
                        start_time: data.start_time,
                        end_time: data.end_time
                    }
                });
        }

        batch.execute((err) => {
            if (!err)
                this._logger.trace(correlationId, "Added " + dataSet.length + " data");

            if (callback) callback(null);
        });
    }

    public deleteByFilter(correlationId: string, filter: FilterParams,
        callback: (err: any) => void): void {
        super.deleteByFilter(correlationId, this.composeFilter(filter), callback);
    }

}
