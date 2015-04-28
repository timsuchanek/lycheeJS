
lychee.define('sorbet.serve.api.Docs').requires([
  'lychee.data.JSON',
  'sorbet.data.Filesystem'
]).exports(function(lychee, sorbet, global, attachments) {

  var _JSON = lychee.data.JSON;
  var _filesystem = new sorbet.data.Filesystem('/');

  /*
   * HELPERS
   */

  var _to_header = function(status, data) {

    var origin = data.headers['Origin'] || '*';


    return {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin':  origin,
      'Access-Control-Allow-Methods': 'GET, PUT, POST',
      'Access-Control-Max-Age':       60 * 60,
      'Content-Control':              'no-transform',
      'Content-Type':                 'application/json'
    }

  };


  var _getDocs = function(moduleName) {
    var tree = {};
    var SRC_PREFIX = '/lychee/source/';
    var API_PREFIX = '/lychee/api/';

    moduleName = moduleName[0] === '/' ? moduleName : '/' + moduleName;

    var _walk = function() {

      var pointer = tree;
      var parentsCopy = this.parents.slice();

      this.pointerString = '';


      if (this.parents.length === 0) {

        tree[this.file] = {};

      } else {

        do {
          var dirName = parentsCopy.shift();
          pointer = pointer[dirName];
          this.pointerString += dirName + '/';
        } while (parentsCopy.length > 0);

      }


      this.pointerString += this.file;


      var files = _filesystem.dir(SRC_PREFIX + this.pointerString);


      if (files === null) {
        var packageName = this.file.split('.');
        packageName = packageName.slice(0, packageName.length - 1).join('.');

        var doc = _filesystem.read(API_PREFIX + this.pointerString.substring(0, this.pointerString.length - 3) + '.md');

        if (doc === null) {
          /**
           * try in the core or net folder. this make sense for all platform specific implementations,
           * because they have the same API
           */
          if (/platform/.test(this.pointerString)) {

            if (/net/.test(this.pointerString)) {
              doc = _filesystem.read(API_PREFIX + 'net/' + this.file.substring(0, this.file.length - 3) + '.md');
            } else {
              doc = _filesystem.read(API_PREFIX + 'core/' + this.file.substring(0, this.file.length - 3) + '.md');
            }

          }
        }

        if (moduleName === SRC_PREFIX + this.pointerString.substring(0, this.pointerString.length - 3)) {

          // remove file extension


          if (doc === null) {

            pointer[packageName] = false;

          } else {

            pointer[packageName] = lychee.serialize(doc);

          }

        } else {

          pointer[packageName] = doc !== null;
        }

        return;
      } else {

        pointer[this.file] = {};

        files.forEach(function(newFile) {

          var newWalkScope = {
            parents: this.parents.concat(this.file),
            file: newFile
          };

          _walk.call(newWalkScope);
        }, this);
      }

    }

    _filesystem.dir(SRC_PREFIX).forEach(function(id) {
      var walkScope = {
        parents: [],
        file: id
      };

      _walk.call(walkScope);
    });

    return tree;
  };



  /*
   * IMPLEMENTATION
   */

  var Module = {

    process: function(host, url, data, ready) {

      var method     = data.headers.method;
      var parameters = data.headers.parameters || null;
      var module     = parameters !== null && parameters.hasOwnProperty('module') ? parameters.module : null;

      /*
       * 1: OPTIONS
       */

      if (method === 'OPTIONS') {

        ready({
          status:  200,
          headers: {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin':  data.headers['Origin'],
            'Access-Control-Allow-Methods': 'GET, PUT, POST',
            'Access-Control-Max-Age':       60 * 60
          },
          payload: ''
        });



      /*
       * 2: GET
       */

      } else if (method === 'GET') {

        if (module !== null) {
          var docs = _getDocs(module);

          ready({
            status:  200,
            headers: _to_header(200, data),
            payload: _JSON.encode(docs)
          });

        } else {

          ready({
            status:  400,
            headers: _to_header(400, data),
            payload: _JSON.encode({
              error: 'module parameter is missing. Try eg. ?module=lychee.core.Asset'
            })
          });

        }


      /*
       * 3: PUT
       */

      } else {

        ready({
          status:  405,
          headers: { 'Content-Type': 'application/json' },
          payload: _JSON.encode({
            error: 'Method not allowed.'
          })
        });

      }

    }

  };


  return Module;

});