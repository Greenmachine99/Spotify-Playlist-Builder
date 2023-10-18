// Importing CSS Stylesheet
import './TrackList.css';

// Importing React
import React from 'react';

// Importing Components
import {Track} from '../Track/Track';

export class TrackList extends React.Component {
    render() {
        return (
            <div className="TrackList">
                {   
                    this.props.tracks.map(track => {
                        return <Track track={track}
                                      key={track.id} 
                                      onAdd={this.props.onAdd}
                                      onRemove={this.props.onRemove}
                                      isRemoval={this.props.isRemoval}/> 
                    })
                }
            </div>
        )
    }
}