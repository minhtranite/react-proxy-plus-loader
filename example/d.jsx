/** @jsx React.DOM */

var React = require("react");
var D = React.createClass({
  render: function () {
    return (
      <div>
        <p>This is component D.</p>

        <p>Resolve Data: </p>
        <pre>{JSON.stringify(this.props.resolveData)}</pre>
      </div>
    );
  }
});

module.exports = D;
