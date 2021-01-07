'use strict';

var jsc3l_config = function() {};
jsc3l_config.confEndPointsOur = ["https://node-001.cchosting.org","https://node-002.cchosting.org","https://node-003.cchosting.org","https://node-004.cchosting.org","https://node-cc-001.cchosting.org/","https://api.monnaie-leman.org"];
jsc3l_config.confEndPointsOther = ["https://ipfs.io","https://ipfs.infura.io","https://ipfs.jes.xxx","https://siderus.io","https://hardbin.com","https://ipfs.infura.io","https://xmine128.tk"];

jsc3l_config.configRepo = "/ipns/QmaAAZor2uLKnrzGCwyXTSwogJqmPjJgvpYgpmtz5XcSmR/configs";  // IPNS of the list of available ComChain currency configs
jsc3l_config.nodesRepo = "/ipns/QmcRWARTpuEf9E87cdA4FfjBkv7rKTJyfvsLFTzXsGATbL"; // IPNS of the list of available ComChain end-points
jsc3l_config.custoRepo = "/ipns/QmaAAZor2uLKnrzGCwyXTSwogJqmPjJgvpYgpmtz5XcSmR/resources/";// IPNS of the configuration for the different currencies
jsc3l_config.ping = jsc3l_config.configRepo+'/ping.json';





module.exports = jsc3l_config;

