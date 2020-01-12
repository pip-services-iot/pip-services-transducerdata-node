"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
class TransducerDataValueV1Schema extends pip_services3_commons_node_1.ObjectSchema {
    constructor() {
        super();
        this.withRequiredProperty('id', pip_services3_commons_node_2.TypeCode.Integer);
        this.withOptionalProperty('typ', pip_services3_commons_node_2.TypeCode.Integer);
        this.withRequiredProperty('val', pip_services3_commons_node_2.TypeCode.Float);
    }
}
exports.TransducerDataValueV1Schema = TransducerDataValueV1Schema;
//# sourceMappingURL=TransducerDataValueV1Schema.js.map