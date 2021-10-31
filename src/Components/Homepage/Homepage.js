import React, {useState, useEffect} from 'react';
import {getArtist, CONSTANTS, getEvents} from '../Utilities/Utils';
import Event from '../Event/Event';
import Artist from '../Artist/Artist';
import './Homepage.css';

const Homepage = () => {
    const [query, setQuery] = useState("");
    const [artist, setArtist] = useState({});
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState({});
    const [favorites, setFavorites] = useState([]);
    const [searchResult, setSearchResult] = useState("");

    /**
     * This Hook used to get and update favorites from localStorage
     */
    useEffect(() => {
        const persistData = localStorage.getItem('favorites');
        const persistentFavorites = persistData !== null ? JSON.parse(persistData) : [];
        setFavorites(persistentFavorites);
    }, []);

    /**
     * This Hook is for storing favorites in localStorage so it will be persistent
     */
    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    /**
     * This Hook is to prevent from calling the rest api every time the use type a char
     * When the user pause typing, after 500ms, I will search and call the rest API
     */
    useEffect(() => {
        const timeOutId = setTimeout(() => query && handleSearch(query), CONSTANTS.SEARCH_DELAY_BEFORE_REST_CALL);
        return () => clearTimeout(timeOutId);
    }, [query]);

    /**
     * Handle the search, by fetching artistData and events when there is existing artist
     * @param query
     * @returns {Promise<void>}
     */
    const handleSearch = async (query) => {
        getArtist(query).then(artistData => {
            if (artistData.error || !artistData)
                throw new Error(artistData.error)
            getEvents(query).then(eventData => {
                if (eventData.error)
                    throw new Error(eventData.error)
                if (artistData && eventData) {
                    setArtist(artistData);
                    setEvents(eventData);
                    setSearchResult('');
                }
            }).catch(err => {
                const errMsg = 'No Events been found for this artist';
                console.error(errMsg);
                setSearchResult(errMsg);
            });
        }).catch(err =>  {
            const errMsg = 'No Artist been found for the supllied query';
          console.error(errMsg);
          setSearchResult(errMsg);
        });
    }

    /**
     * Return the searchBar JSx, onChange, I'm updating the the query through setState
     * @returns {JSX.Element}
     */
    const searchJsx = () => {
        return (
            <div className='searchBar'>
                <input name='search_term' type='text' value={query} placeholder='Search For Artist'
                       className='form-control mr-sm-0' onChange={event => setQuery(event.target.value)}>
                </input>
            </div>
        );
    }

    /**
     * This is a callBack when an event been selected, in this case I should update the selected event
     * @param event
     */
    const handleSelected = (event) => {
        setSelectedEvent(event);
    }

    /**
     * Add and remove favorites when clicking the button of the selected event
     */
    const addRemoveFavorite = () => {
        const isExist = favorites.some(favorite => favorite.id === selectedEvent.id);
        if(isExist) {
            const tmpFavorites = favorites.filter(favorite => favorite.id !== selectedEvent.id);
            setFavorites(tmpFavorites);
        } else {
            const tmpFavorites = [
                selectedEvent,
                ...favorites
            ];
            setFavorites(tmpFavorites);
        }
    }

    /**
     * Remove favorite through the list of the favorites list
     * @param id
     */
    const removeFavorite = (id) => {
        const tmpFavorites = favorites.filter(favorite => favorite.id !== id);
        setFavorites(tmpFavorites);
    }

    /**
     * Return artist informaion JSX
     * @returns {JSX.Element}
     */
    const artistInformationJsx = () => {
        return (query && searchResult ? <span className='no_result_found'>{searchResult}</span> :
                <div>
                    <div className='artist_band_information'>
                        {query && Object.keys(artist).length > 0 && <Artist props={artist}/>}
                    </div>
                    <div className='all_events'>
                        {query && events.length > 0 && events.map(event => {
                            return <Event key={event.id} props={event} onSelect={handleSelected}/>
                        })}
                    </div>
                </div>

        )
    }
    /**
     * Return selected event information JSX
     * @returns {boolean|JSX.Element}
     */
    const selectedEventInformationJsx = () => {
        return (
            Object.keys(selectedEvent).length > 0 &&
                    <div align='center' className='center'>
                        <span className='selected_event_information'>Selected Event Information</span>
                        <div className='card event_information'>
                            <span className='event_information'>Event Information</span>
                            {selectedEvent.information.artist ? 'Name:' + selectedEvent.information.artist.name : ''}
                            Date: {selectedEvent.information.datetime}
                            {selectedEvent.information.description ? 'Description:' + selectedEvent.information.description : ''}

                            <span>
                            <a href={selectedEvent.information.url} target='_blank' rel="noopener noreferrer">More Info...
                            </a>
                        </span>
                        </div>
                        <div className='card venue_information'>
                            <span>Venue Information</span>
                            <span>Name: {selectedEvent.venue.name}</span>
                            <span>City: {selectedEvent.venue.city}</span>
                            <span>Country: {selectedEvent.venue.country}</span>

                        </div>
                        <div className='card special_offers'>
                            {selectedEvent.special_offers && selectedEvent.special_offers.map(offer => {
                                return (<span>{offer.name}</span>);
                            })}
                        </div>
                        <button className='add_remove_favorite_btn btn btn-primary' onClick={addRemoveFavorite}>Add/Remove Favorite</button>

                    </div>

        )
    }
    /**
     * Facorites section JSX
     * @returns {JSX.Element}
     */
    const favoritesJsx = () => {
        return (
            <div align='right' className='right'>
                <div align='center' className='favorites_title'>Favorites</div>
                {favorites.length > 0 && favorites.map(favorite => {
                    const {id} = favorite;
                    return (
                        <div key={favorite.id} className='card favorite'>
                            <span  className='favorite_event'>
                                {'Event ' + favorite.id}
                            </span>
                            <button className='remove_from_favorite_btn btn btn-secondary' onClick={() => removeFavorite(id)}>
                                Remove
                            </button>
                        </div>
                    )
                })}
            </div>
        )
    }

    return (
        <div className='container'>
            <div align='left' className='left_side'>
                {searchJsx()}
                {artistInformationJsx()}
            </div>
            {selectedEventInformationJsx()}
            {favoritesJsx()}
        </div>
    )
}

export default Homepage;