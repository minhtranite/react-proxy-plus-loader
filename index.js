var loaderUtils = require("loader-utils");

module.exports = function () {
};
module.exports.pitch = function (remainingRequest) {
  this.cacheable && this.cacheable();
  var query = loaderUtils.parseQuery(this.query);
  var moduleRequest = "!!" + remainingRequest;

  return [
    'var React = require("react");',
    'var component;',
    'var desc = {',
    '  statics: {',
    '    resolve: function(params){',
    '      return new Promise(function(resolve, reject){',
    '        if(!component) {',
    '          require.ensure([], function() {',
    '            component = require(' + loaderUtils.stringifyRequest(this, moduleRequest) + ');',
    '            if(typeof component.resolve === \'function\'){',
    '              component.resolve(params).then(function(data){',
    '                resolve(data)',
    '              }, function(error){',
    '                reject(error)',
    '              })',
    '            } else {',
    '              resolve()',
    '            }',
    '          }' + (query.name ? ', ' + JSON.stringify(query.name) : '') + ');',
    '        } else {',
    '          if(typeof component.resolve === \'function\'){',
    '            component.resolve(params).then(function(data){',
    '              resolve(data)',
    '            }, function(error){',
    '              reject(error)',
    '            })',
    '          } else {',
    '            resolve()',
    '          }',
    '        }',
    '      })',
    '    }',
    '  }, ',
    '  loadComponent: function(callback) {',
    '    if(!component) {',
    '      require.ensure([], function() {',
    '        component = require(' + loaderUtils.stringifyRequest(this, moduleRequest) + ');',
    '        if(callback) callback(component);',
    '      }' + (query.name ? ', ' + JSON.stringify(query.name) : '') + ');',
    '    } else if(callback) callback(component);',
    '    return component;',
    '  },',
    '};',
    'var mixinReactProxy = require(' + loaderUtils.stringifyRequest(this, require.resolve("./mixinReactProxy")) + ');',
    'mixinReactProxy(React, desc);',
    'module.exports = React.createClass(desc);',
    'module.exports.Mixin = desc;'
  ].join("\n");
};
