var fs = require("fs");

require("../").apply();

process.addAsyncListener({
    create: function (context, store) {
        console.log("-callback created %o", process.hrtime());
    },
    before: function (context, store) {
        console.log("-before callback %o", process.hrtime());
    },
    after: function (context, store) {
        console.log("-after callback %o", process.hrtime());
    }
}, {});

fs.readFile("/etc/hostname", function (error, data) {
    console.log("My host name is [%s]", data.toString().replace("\n", ""));
});




