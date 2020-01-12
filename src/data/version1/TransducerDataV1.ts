import { TransducerDataValueV1 } from './TransducerDataValueV1';

export class TransducerDataV1 {
    public org_id: string;
    public object_id: string;
    public time: Date;
    public params?: TransducerDataValueV1[];
    public events?: TransducerDataValueV1[];
    public commands?: TransducerDataValueV1[];
    public states?: TransducerDataValueV1[];
}
