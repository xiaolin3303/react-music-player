import React from 'react';
import Progress from '../components/progress';
import { Link } from 'react-router-dom';
import PubSub from 'pubsub-js';
import './player.less';

let duration = null;

class Player extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			progress: 0,
			volume: 0,
			isPlay: true,
			leftTime: ''
		}
	}
	componentDidMount() {
		$("#player").bind($.jPlayer.event.timeupdate, (e) => {
			duration = e.jPlayer.status.duration;
			this.setState({
				progress: e.jPlayer.status.currentPercentAbsolute,
				volume: e.jPlayer.options.volume * 100,
				leftTime: this.formatTime(duration * (1 - e.jPlayer.status.currentPercentAbsolute / 100))
			});
		});
	}
	componentWillUnmount() {
		$("#player").unbind($.jPlayer.event.timeupdate);
	}
	formatTime(time) {
		time = Math.floor(time);
		let miniute = Math.floor(time / 60);
		let seconds = Math.floor(time % 60);

		return miniute + ':' + (seconds < 10 ? '0' + seconds : seconds);
	}
	changeProgressHandler(progress) {
		$("#player").jPlayer("play", duration * progress);
		this.setState({
			isPlay: true
		});
	}
	changeVolumeHandler(progress) {
		$("#player").jPlayer("volume", progress);
	}
	play() {
		if (this.state.isPlay) {
			$("#player").jPlayer("pause");
		} else {
			$("#player").jPlayer("play");
		}
		this.setState({
			isPlay: !this.state.isPlay
		});
	}
	next() {
		PubSub.publish('PLAY_NEXT');
	}
	prev() {
		PubSub.publish('PLAY_PREV');
	}
	changeRepeat() {
		PubSub.publish('CHANAGE_REPEAT');
	}
    render() {
		let {title, artist, cover} = this.props;
        return (
			<div className="player-page">
                <h1 className="caption"><Link to="/list">我的私人音乐坊 &gt;</Link></h1>
                <div className="mt20 row">
                	<div className="controll-wrapper">
                		<h2 className="music-title">{this.props.currentMusicItem.title}</h2>
                		<h3 className="music-artist mt10">{this.props.currentMusicItemartist}</h3>
                		<div className="row mt20">
                			<div className="left-time -col-auto">-{this.state.leftTime}</div>
                			<div className="volume-container">
                				<i className="icon-volume rt" style={{top: 5, left: -5}}></i>
                				<div className="volume-wrapper">
					                <Progress
										progress={this.state.volume}
										onProgressChange={this.changeVolumeHandler.bind(this)}
										barColor='#aaa'
					                >
					                </Progress>
                				</div>
                			</div>
                		</div>
                		<div style={{height: 10, lineHeight: '10px'}}>
			                <Progress
								progress={this.state.progress}
								onProgressChange={this.changeProgressHandler.bind(this)}
			                >
			                </Progress>
                		</div>
                		<div className="mt35 row">
                			<div>
	                			<i className="icon prev" title="上一曲" onClick={this.prev.bind(this)}></i>
	                			<i className={`icon ml20 ${this.state.isPlay ? 'pause' : 'play'}`} onClick={this.play.bind(this)}></i>
	                			<i className="icon next ml20" title="下一曲" onClick={this.next.bind(this)}></i>
                			</div>
                			<div className="-col-auto">
                				<i className={`icon repeat-${this.props.repeatType}`} onClick={this.changeRepeat}></i>
                			</div>
                		</div>
                	</div>
                	<div className="-col-auto cover">
                		<img className={`${this.state.isPlay ? 'playing' : 'pausing'}`} src={this.props.currentMusicItem.cover} alt={this.props.currentMusicItem.title}/>
                	</div>
                </div>
            </div>
        );
    }
}

export default Player;
