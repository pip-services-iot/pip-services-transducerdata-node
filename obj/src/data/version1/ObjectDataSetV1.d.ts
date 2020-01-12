import { IStringIdentifiable } from 'pip-services3-commons-node';
import { ObjectDataSetValueV1 } from './ObjectDataSetValueV1';
export declare class ObjectDataSetV1 implements IStringIdentifiable {
    id: string;
    org_id: string;
    object_id: string;
    start_time: Date;
    end_time: Date;
    values: ObjectDataSetValueV1[];
}
