var React = require("react");
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var Link = Router.Link;
var ProgressBar = require('./ProgressBar');
var EventEmitter = require('events').EventEmitter;
var ResolveStore = new EventEmitter();

require('./bootstrap.css');

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
  getInitialState: function () {
    return {
      resolvePercent: -1
    };
  },
  componentWillMount: function () {
    ResolveStore.on('begin', function () {
      this.setState({
        resolvePercent: 0
      });
    }.bind(this));

    ResolveStore.on('end', function () {
      this.setState({
        resolvePercent: 100
      });
    }.bind(this));
  },
  render: function () {
    return (
      <div>
        <nav className="navbar navbar-default">
          <div className="container">
            <div className="navbar-header">
              <a className="navbar-brand"
                href="https://github.com/vn38minhtran/react-proxy-plus-loader">React
                Proxy Plus</a>
            </div>
            <div className="collapse navbar-collapse">
              <ul className="nav navbar-nav navbar-right">
                <li><Link to='a'>Page A</Link></li>
                <li><Link to='b'>Page B</Link></li>
                <li><Link to='c'>Page C</Link></li>
                <li><Link to='d'>Page D</Link></li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="container">
          <RouteHandler {...this.props}/>
        </div>
        <ProgressBar percent={this.state.resolvePercent} increment={true}/>
      </div>
    );
  }
});

var routes = (
  <Route name='app' path={window.location.pathname} handler={App}>
    <DefaultRoute name='a' handler={A}/>
    <Route name='b' handler={B}/>
    <Route name='c' handler={C}/>
    <Route name='d' handler={D}/>
  </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  ResolveStore.emit('begin');
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
    ResolveStore.emit('end');
    React.render(<Handler resolveData={resolveData}/>, document.body);
  });
});