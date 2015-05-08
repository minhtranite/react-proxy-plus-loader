/** @jsx React.DOM */

var React = require("react");
var A = React.createClass({
  statics: {
    resolve: function () {
      return Promise.resolve({
        name: 'React',
        createBy: 'Facebook'
      });
    }
  },
  render: function () {
    return (
      <div>
        <p>This is component A.</p>

        <p>Resolve Data: </p>
        <pre>{JSON.stringify(this.props.resolveData)}</pre>
      </div>
    );
  }
});

module.exports = A;
