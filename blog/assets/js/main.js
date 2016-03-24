/**
 *
 * 全局配置文件
 */

require.config({
	baseUrl : "assets/js",
    paths : {
    	"common" : "common",
    	"jquery" : "lib/jquery",
    	"bootstrap" : "lib/bootstrap",
        "cookie" : "jqPlugs/cookie",
        "core" : "jqPlugs/core",
        "heaven" : "jqPlugs/heaven",
    },
    shim : {
            "bootstrap": ["jquery"]
        },
});

