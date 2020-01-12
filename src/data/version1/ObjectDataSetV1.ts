import { IStringIdentifiable } from 'pip-services3-commons-node';
import { ObjectDataSetValueV1 } from './ObjectDataSetValueV1';

export class ObjectDataSetV1 implements IStringIdentifiable {
    public id: string;
    public org_id: string;
    public object_id: string;
    public start_time: Date;
    public end_time: Date;
    public values: ObjectDataSetValueV1[];
}
