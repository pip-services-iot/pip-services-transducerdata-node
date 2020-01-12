import { TransducerDataValueV1 } from './TransducerDataValueV1';
export declare class TransducerDataV1 {
    org_id: string;
    object_id: string;
    time: Date;
    params?: TransducerDataValueV1[];
    events?: TransducerDataValueV1[];
    commands?: TransducerDataValueV1[];
    states?: TransducerDataValueV1[];
}
