import { IStringIdentifiable } from 'pip-services3-commons-node';
import { TransducerDataSetValueV1 } from './TransducerDataSetValueV1';
export declare class TransducerDataSetV1 implements IStringIdentifiable {
    id: string;
    org_id: string;
    object_id: string;
    start_time: Date;
    end_time: Date;
    values: TransducerDataSetValueV1[];
}
