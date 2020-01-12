let TransducerDataProcess = require('../obj/src/container/TransducerDataProcess').TransducerDataProcess;

try {
    new TransducerDataProcess().run(process.argv);
} catch (ex) {
    console.error(ex);
}
