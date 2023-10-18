// Importing CSS Stylesheet
import './SearchResults.css';

//Importing React
import React from 'react';

//Importing Components
import {TrackList} from '../TrackList/TrackList';

export class SearchResults extends React.Component {
    render() {
        return(
            <div className="SearchResults">
                <h2>Results</h2>
                <TrackList tracks={this.props.searchResults}
                           onAdd={this.props.onAdd}
                           isRemoval={false}/>
            </div>
        )
    }
}