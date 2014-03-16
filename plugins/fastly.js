// Fastly API questions

var
    P       = require('bluebird'),
    Request = require('request')
    ;

var Fastly = module.exports = function Fastly(opts)
{
    this.apikey = opts.apikey;

};

Fastly.prototype.matches = function matches(msg)
{
    return false;
};

Fastly.prototype.respond = function respond(msg)
{

};

Fastly.prototype.help = function help(msg)
{
    return 'fastly errors\n fastly 503s\nfastly requests\n';
};


Fastly.prototype.execute = function execute(uri)
{
    var deferred = P.defer();

    Request(
    {
        method:  'GET',
        url:     'https://api.fastly.com' + uri,
        headers: { 'x-fastly-key': this.apikey },
        json:    true
    }, function(err, response, body)
    {
        if (err) return deferred.reject(err);
        if (!response || (response.statusCode < 200) || (response.statusCode > 302))
        {
            return deferred.reject(new Error('Fastly status code ' + response.statusCode));
        }

        if (body.status !== 'success') return deferred.reject(new Error(body.msg));

        deferred.resolve(body);
    });

    return deferred.promise;
}