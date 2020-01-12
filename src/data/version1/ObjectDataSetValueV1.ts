import { ObjectDataValueV1 } from './ObjectDataValueV1';

export class ObjectDataSetValueV1 {
    public time: Date;
    public params?: ObjectDataValueV1[];
    public events?: ObjectDataValueV1[];
    public commands?: ObjectDataValueV1[];
    public states?: ObjectDataValueV1[];
}
