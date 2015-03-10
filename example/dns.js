var dns = require("dns");

require("../").apply();

dns.resolve("www.baidu.com", function (error, ip) {
    if (error) {
        throw new Error(error);
    }
    console.log(ip[0]);
});