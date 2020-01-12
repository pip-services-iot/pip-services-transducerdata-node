"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const ObjectDataValueV1Schema_1 = require("./ObjectDataValueV1Schema");
class ObjectDataV1Schema extends pip_services3_commons_node_1.ObjectSchema {
    constructor() {
        super();
        this.withRequiredProperty('org_id', pip_services3_commons_node_3.TypeCode.String);
        this.withRequiredProperty('object_id', pip_services3_commons_node_3.TypeCode.String);
        this.withRequiredProperty('time', pip_services3_commons_node_3.TypeCode.DateTime);
        this.withOptionalProperty('params', new pip_services3_commons_node_2.ArraySchema(new ObjectDataValueV1Schema_1.ObjectDataValueV1Schema()));
        this.withOptionalProperty('events', new pip_services3_commons_node_2.ArraySchema(new ObjectDataValueV1Schema_1.ObjectDataValueV1Schema()));
        this.withOptionalProperty('commands', new pip_services3_commons_node_2.ArraySchema(new ObjectDataValueV1Schema_1.ObjectDataValueV1Schema()));
        this.withOptionalProperty('states', new pip_services3_commons_node_2.ArraySchema(new ObjectDataValueV1Schema_1.ObjectDataValueV1Schema()));
    }
}
exports.ObjectDataV1Schema = ObjectDataV1Schema;
//# sourceMappingURL=ObjectDataV1Schema.js.map