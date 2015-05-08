/** @jsx React.DOM */

var React = require("react");
var B = React.createClass({
  statics: {
    resolve: function () {
      var f1 = function () {
        return Promise.resolve({name: 'Object first'});
      };
      var f2 = function () {
        return new Promise(function (resolve) {
          setTimeout(function () {
            resolve({name: 'Object second'});
          }, 2000);
        });
      };
      return Promise.all([f1(), f2()]);
    }
  },
  render: function () {
    return (
      <div>
        <p>This is component B.</p>

        <p>Resolve Data: </p>
        <pre>{JSON.stringify(this.props.resolveData)}</pre>
      </div>
    );
  }
});

module.exports = B;
