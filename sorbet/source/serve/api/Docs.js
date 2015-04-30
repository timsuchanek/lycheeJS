
lychee.define('sorbet.serve.api.Docs').requires([
  'lychee.data.JSON',
  'sorbet.data.Filesystem'
]).exports(function(lychee, sorbet, global, attachments) {

  var _JSON = lychee.data.JSON;
  var _filesystem = new sorbet.data.Filesystem('/');
  var SRC_PREFIX = '/lychee/source/';
  var API_PREFIX = '/lychee/api/';

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


  var _get_docs_tree = function(moduleName) {
    var tree = {};

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

        // For cases like Class.Name.Awesome.js
        var packageName = this.file.split('.');
        packageName = packageName.slice(0, packageName.length - 1).join('.');

        var path = _translate_platform(SRC_PREFIX + this.pointerString.substring(0, this.pointerString.length - 3));

        path = _source_to_api(path);


        var doc = _filesystem.read(path);


        if (doc === null) {

          pointer[packageName] = false;

        } else {

          if (moduleName === SRC_PREFIX + this.pointerString.substring(0, this.pointerString.length - 3)) {
            pointer[packageName] = lychee.serialize(doc);
          } else {
            pointer[packageName] = true;
          }

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

  var _get_docs_only = function(moduleName) {
    moduleName = moduleName[0] === '/' ? moduleName.slice(1, moduleName.length) : moduleName;
    moduleName = _translate_platform(moduleName);

    var doc = _filesystem.read(_source_to_api(moduleName));
    return {
      doc: lychee.serialize(doc)
    };
  };

  var _source_to_api = function(src) {
    var apiString = API_PREFIX + src.split('/source/')[1].replace('.js', '.md');
    if (apiString.substr(apiString.length - 3) !== '.md') {
      apiString += '.md';
    }
    return apiString;
  }

  var _translate_platform = function(moduleName) {
    /**
     * if we have a platform specific implementation,
     * take the implementation from lychee/api/core or lychee/api/net
     */

    var newName = moduleName;

    if (/platform/.test(moduleName)) {
      if (/net/.test(moduleName)) {
        newName = SRC_PREFIX + "net/" + moduleName.split('/').pop();
      } else {
        newName = SRC_PREFIX + "core/" + moduleName.split('/').pop();
      }
    }

    return newName;
  }



  /*
   * IMPLEMENTATION
   */

  var Module = {

    process: function(host, url, data, ready) {

      var method     = data.headers.method;
      var parameters = data.headers.parameters || null;
      var module     = parameters !== null && parameters.hasOwnProperty('module') ? parameters.module : null;
      var docsonly   = parameters !== null && parameters.hasOwnProperty('docsonly') ? parameters.docsonly : null;

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
          var docs = null;

          if (docsonly !== null) {
            docs = _get_docs_only(module);
          } else {
            docs = _get_docs_tree(module);
          }

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