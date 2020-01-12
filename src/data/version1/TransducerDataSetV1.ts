import { IStringIdentifiable } from 'pip-services3-commons-node';
import { TransducerDataSetValueV1 } from './TransducerDataSetValueV1';

export class TransducerDataSetV1 implements IStringIdentifiable {
    public id: string;
    public org_id: string;
    public object_id: string;
    public start_time: Date;
    public end_time: Date;
    public values: TransducerDataSetValueV1[];
}
