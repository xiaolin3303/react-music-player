import React from 'react';
require('./progress.less');

let Progress = React.createClass({
	getDefaultProps() {
		return {
			barColor: '#2f9842'
		}
	},
	changeProgress(e) {
		let progressBar = this.refs.progressBar;
		let progress = (e.pageX - progressBar.offsetLeft) / progressBar.clientWidth;
		this.props.onProgressChange && this.props.onProgressChange(progress);
	},
    render() {
        return (
        	<div className="components-progress" ref="progressBar" onClick={this.changeProgress}>
        		<div className="progress" style={{width: `${this.props.progress}%`, background: this.props.barColor}}></div>
        	</div>
        );
    }
});

export default Progress;
