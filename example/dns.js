var dns = require("dns");

require("../").apply();

process.addAsyncListener({
    create: function (context, store) {
        var hrtime = process.hrtime();
        store.begin = hrtime[0] * 1E9 + hrtime[1];
    },
    after: function (context, store) {
        var hrtime = process.hrtime();
        var diffNs = hrtime[0] * 1E9 + hrtime[1] - store.begin;
        console.log("diff is %d ns!", diffNs);
    }
}, {})

dns.resolve("www.oneapm.com", function (error, ip) {
    if (error) {
        throw new Error(error);
    }
    console.log(ip[0]);
});