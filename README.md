# react-proxy-plus-loader

Based on [react-proxy-loader](https://github.com/webpack/react-proxy-loader), adapted for `react-router` [resolve data](https://github.com/rackt/react-router/blob/master/examples/async-data/app.js).

## Demo

https://vn38minhtran.github.io/react-proxy-plus-loader

## Installation

`npm install react-proxy-loader --save`

## Usage

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

``` js
var A = require("./a");
var B = require("react-proxy-plus!./b");
var C = require("react-proxy-plus!./c");
var D = React.createClass({
  mixins: [require("react-proxy-plus?async!./d").Mixin],
  renderUnavailable: function () {
    return <p>Loading...</p>;
  }
});
```

### Chunk name

You can give the chunk a name with the `name` query parameter:

``` js
var Component = require("react-proxy-plus?name=chunkName!./Component");
```

### With react-router

``` js
var React = require("react");
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var Link = Router.Link;

var A = require("./a");
var B = require("react-proxy-plus!./b");
var C = require("react-proxy-plus!./c");
var D = React.createClass({
  mixins: [require("react-proxy-plus?async!./d").Mixin],
  renderUnavailable: function () {
    return <p>Loading...</p>;
  }
});

var App = React.createClass({
  render: function () {
    return (
      <div>
        <ul>
          <li><Link to='a'>Page A</Link></li>
          <li><Link to='b'>Page B</Link></li>
          <li><Link to='c'>Page C</Link></li>
          <li><Link to='d'>Page D</Link></li>
        </ul>
        <RouteHandler {...this.props}/>
      </div>
    );
  }
});

var routes = (
  <Route name='app' path='/' handler={App}>
    <DefaultRoute name='a' handler={A}/>
    <Route name='b' handler={B}/>
    <Route name='c' handler={C}/>
    <Route name='d' handler={D}/>
  </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  var resolveData = {};
  var promises = state.routes.filter(function (route) {
    return route.handler.resolve;
  }).map(function (route) {
    return new Promise(function (resolve) {
      resolve(route.handler.resolve(state.params).then(function (routeData) {
        resolveData[route.name] = routeData;
        return routeData;
      }));
    });
  });

  Promise.all(promises).then(function () {
    React.render(<Handler resolveData={resolveData}/>, document.body);
  });
});
```

## Run example
```
git clone https://github.com/vn38minhtran/react-proxy-plus-loader.git
cd react-proxy-plus-loader
npm install
cd example
webpack-dev-server --hot --inline --colors
```

# License

MIT (http://www.opensource.org/licenses/mit-license.php)
