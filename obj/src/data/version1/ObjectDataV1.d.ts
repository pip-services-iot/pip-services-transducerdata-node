import { ObjectDataValueV1 } from './ObjectDataValueV1';
export declare class ObjectDataV1 {
    org_id: string;
    object_id: string;
    time: Date;
    params?: ObjectDataValueV1[];
    events?: ObjectDataValueV1[];
    commands?: ObjectDataValueV1[];
    states?: ObjectDataValueV1[];
}
