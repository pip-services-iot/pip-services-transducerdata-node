import { ObjectDataValueV1 } from './ObjectDataValueV1';

export class ObjectDataV1 {
    public org_id: string;
    public object_id: string;
    public time: Date;
    public params?: ObjectDataValueV1[];
    public events?: ObjectDataValueV1[];
    public commands?: ObjectDataValueV1[];
    public states?: ObjectDataValueV1[];
}
