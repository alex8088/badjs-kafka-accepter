var  port =  global.pjconfig.dispatcher.port,
     address =  global.pjconfig.dispatcher.address,
     service =  global.pjconfig.dispatcher.subscribe;

//zookeeper
// var kafka = require('kafka-node'),
//     Producer = kafka.Producer,
//     client = new kafka.Client(address + ":" + port),
//     producer = new Producer(client);

//no zookeeper
var kafka = require('kafka-node'),
    Producer = kafka.Producer,
    client = new kafka.KafkaClient({kafkaHost: address + ":" + port}),
    producer = new Producer(client);

var log4js = require('log4js'),
    logger = log4js.getLogger();

    producer.on('ready', function () {
        logger.info('dispatcher of  kafka server starting...');
    });
      
    producer.on('error', function (err) {
        logger.debug('dispatcher error :' + err);
    });

/**
 * dispatcher
 * @returns {Stream}
 */
module.exports = function () {
    return {
        process : function (data){
            var messages = [];
            data.data.forEach(function (value){
                var str = JSON.stringify(value);
                messages.push(str);
            });
            var payloads = [
                { topic: 'topic1', messages: messages},
            ];
            producer.send(payloads, function (err, data) {
                logger.debug('dispatcher a message :' + str);
            });
        }
    }
};