import { CommandSet } from 'pip-services3-commons-node';
import { ICommand } from 'pip-services3-commons-node';
import { Command } from 'pip-services3-commons-node';
import { Schema } from 'pip-services3-commons-node';
import { Parameters } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { ObjectSchema } from 'pip-services3-commons-node';
import { ArraySchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';
import { FilterParamsSchema } from 'pip-services3-commons-node';
import { PagingParamsSchema } from 'pip-services3-commons-node';
import { DateTimeConverter } from 'pip-services3-commons-node';

import { ObjectDataV1 } from '../data/version1/ObjectDataV1';
import { ObjectDataV1Schema } from '../data/version1/ObjectDataV1Schema';
import { ObjectDataSetV1 } from '../data/version1/ObjectDataSetV1';
import { ITransducerDataController } from './ITransducerDataController';

export class TransducerDataCommandSet extends CommandSet {
    private _logic: ITransducerDataController;

    constructor(logic: ITransducerDataController) {
        super();

        this._logic = logic;

        // Register commands to the database
		this.addCommand(this.makeGetDataCommand());
		this.addCommand(this.makeAddDataCommand());
		this.addCommand(this.makeAddDataBatchCommand());
		this.addCommand(this.makeDeleteDataCommand());
    }

	private makeGetDataCommand(): ICommand {
		return new Command(
			"get_data",
			new ObjectSchema(true)
				.withOptionalProperty('filter', new FilterParamsSchema())
				.withOptionalProperty('paging', new PagingParamsSchema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let filter = FilterParams.fromValue(args.get("filter"));
                let paging = PagingParams.fromValue(args.get("paging"));
                this._logic.getData(correlationId, filter, paging, callback);
            }
		);
	}
	
	private makeAddDataCommand(): ICommand {
		return new Command(
			"add_data",
			new ObjectSchema(true)
				.withRequiredProperty('data', new ObjectDataV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let data = args.get("data");
			    this._logic.addData(correlationId, data, (err) => {
				   	if (callback) callback(err, null);
			   });
            }
		);
	}

	private makeAddDataBatchCommand(): ICommand {
		return new Command(
			"add_data_batch",
			new ObjectSchema(true)
				.withRequiredProperty('data', new ArraySchema(new ObjectDataV1Schema())),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let data = args.get("data");
			    this._logic.addDataBatch(correlationId, data, (err) => {
				   	if (callback) callback(err, null);
			   });
            }
		);
	}
	
	private makeDeleteDataCommand(): ICommand {
		return new Command(
			"delete_data",
			new ObjectSchema(true)
				.withOptionalProperty('filter', new FilterParamsSchema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let filter = FilterParams.fromValue(args.get("filter"));
                this._logic.deleteData(correlationId, filter, (err) => {
				   if (callback) callback(err, null);
			   });
			}
		);
	}

}