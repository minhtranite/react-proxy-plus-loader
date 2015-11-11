module.exports = function(React, desc) {
	desc.displayName = "ReactProxy";
	desc.componentRefName = 'component';
	desc.render = function() {
		var Component = this.state.component;
		if(Component) {
			var props = this.props;
			props.ref = desc.componentRefName;
			return React.createElement(Component, props, this.props.children);
		} else if(this.renderUnavailable) {
			return this.renderUnavailable();
		} else {
			return null;
		}
	};
	desc.getInitialState = function() {
		return { component: this.loadComponent() };
	};
	desc.componentDidMount = function() {
		if(!this.state.component) {
			this.loadComponent(function(component) {
				if(this.isMounted()) {
					this.setState({ component: component });
				}
			}.bind(this));
		}
	};
};
