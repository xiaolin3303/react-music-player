import React from 'react';
import { MUSIC_LIST } from '../config/config';
import ListItem from '../components/listitem';

class List extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let Items = null;
        if(this.props.musicList) {
            Items = this.props.musicList.map((item) => {
                return (
                    <ListItem
                        key={item.id}
                        data={item}
                        focus={this.props.currentMusicItem === item}
                    ></ListItem>
                );
            });
        }
        return (
            <ul>
                { Items }
            </ul>
        );
    }
}

export default List;
