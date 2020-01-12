import { CommandSet } from 'pip-services3-commons-node';
import { ITransducerDataController } from './ITransducerDataController';
export declare class TransducerDataCommandSet extends CommandSet {
    private _logic;
    constructor(logic: ITransducerDataController);
    private makeGetDataCommand;
    private makeAddDataCommand;
    private makeAddDataBatchCommand;
    private makeDeleteDataCommand;
}
