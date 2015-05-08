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