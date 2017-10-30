import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { MUSIC_LIST } from './config/config';
import { randomRange } from './utils/util';
import PubSub from 'pubsub-js';

import Header from './components/header';
import Player from './page/player';
import List from './page/list';

class Root extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
			musicList: MUSIC_LIST,
			currentMusitItem: {},
			repeatType: 'cycle'
		}
    }
    componentDidMount() {
		$("#player").jPlayer({
			supplied: "mp3",
			wmode: "window",
			useStateClassSkin: true
		});

		this.playMusic(this.state.musicList[0]);
		
		$("#player").bind($.jPlayer.event.ended, (e) => {
			this.playWhenEnd();
		});
		PubSub.subscribe('PLAY_MUSIC', (msg, item) => {
			this.playMusic(item);
		});
		PubSub.subscribe('DEL_MUSIC', (msg, item) => {
			this.setState({
				musicList: this.state.musicList.filter((music) => {
					return music !== item;
				})
			});
		});
		PubSub.subscribe('PLAY_NEXT', () => {
			this.playNext();
		});
		PubSub.subscribe('PLAY_PREV', () => {
			this.playNext('prev');
		});
		let repeatList = [
			'cycle',
			'once',
			'random'
		];
		PubSub.subscribe('CHANAGE_REPEAT', () => {
			let index = repeatList.indexOf(this.state.repeatType);
			index = (index + 1) % repeatList.length;
			this.setState({
				repeatType: repeatList[index]
			});
		});
	}
	componentWillUnmount() {
		PubSub.unsubscribe('PLAY_MUSIC');
		PubSub.unsubscribe('DEL_MUSIC');
		PubSub.unsubscribe('CHANAGE_REPEAT');
		PubSub.unsubscribe('PLAY_NEXT');
		PubSub.unsubscribe('PLAY_PREV');
	}
	playWhenEnd() {
		if (this.state.repeatType === 'random') {
			let index = this.findMusicIndex(this.state.currentMusitItem);
			let randomIndex = randomRange(0, this.state.musicList.length - 1);
			while(randomIndex === index) {
				randomIndex = randomRange(0, this.state.musicList.length - 1);
			}
			this.playMusic(this.state.musicList[randomIndex]);
		} else if (this.state.repeatType === 'once') {
			this.playMusic(this.state.currentMusitItem);
		} else {
			this.playNext();
		}
	}
	playNext(type = 'next') {
		let index = this.findMusicIndex(this.state.currentMusitItem);
		if (type === 'next') {		
			index = (index + 1) % this.state.musicList.length;
		} else {
			index = (index + this.state.musicList.length - 1) % this.state.musicList.length;
		}
		let musicItem = this.state.musicList[index];
		this.setState({
			currentMusitItem: musicItem
		});
		this.playMusic(musicItem);
	}
	findMusicIndex(music) {
		let index = this.state.musicList.indexOf(music);
		return Math.max(0, index);
	}
	playMusic(item) {
		$("#player").jPlayer("setMedia", {
			mp3: item.file
		}).jPlayer('play');
		this.setState({
			currentMusitItem: item
		});
	}
    render() {
        let value = this.state;

        const Home = () => (
            <Player
                currentMusicItem = { value.currentMusitItem }
                repeatType = { this.state.repeatType }
            />
        );

        const musicList = () => (
            <List
                currentMusicItem = { value.currentMusitItem }
                musicList = { this.state.musicList }
            />
        );

        return (
            <HashRouter>
                <div className="container">
                    <Header/>

                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/list" component={musicList} />
                    </Switch>
                </div>
            </HashRouter>
        );
    }
}

export default Root;