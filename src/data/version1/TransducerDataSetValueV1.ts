import { TransducerDataValueV1 } from './TransducerDataValueV1';

export class TransducerDataSetValueV1 {
    public time: Date;
    public params?: TransducerDataValueV1[];
    public events?: TransducerDataValueV1[];
    public commands?: TransducerDataValueV1[];
    public states?: TransducerDataValueV1[];
}
