import { ObjectSchema } from 'pip-services3-commons-node';
import { ArraySchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';

import { TransducerDataValueV1Schema } from './TransducerDataValueV1Schema';

export class TransducerDataV1Schema extends ObjectSchema {
    public constructor() {
        super();
        this.withRequiredProperty('org_id', TypeCode.String);
        this.withRequiredProperty('object_id', TypeCode.String);
        this.withRequiredProperty('time', TypeCode.DateTime);
        this.withOptionalProperty('params', new ArraySchema(new TransducerDataValueV1Schema()));
        this.withOptionalProperty('events', new ArraySchema(new TransducerDataValueV1Schema()));
        this.withOptionalProperty('commands', new ArraySchema(new TransducerDataValueV1Schema()));
        this.withOptionalProperty('states', new ArraySchema(new TransducerDataValueV1Schema()));
    }
}
