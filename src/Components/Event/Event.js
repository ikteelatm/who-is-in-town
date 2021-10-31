import './Event.css';

const Event = ({props, onSelect}) => {
    const {id, artist, datetime, description, url, venue, offers} = props;

    /**
     * When an event been clicked and selected, fetch the appropriate event data and pass it to the callback
     */
    const handleSelect = () => {
        const event = {
            id,
            information: {
                artist,
                datetime,
                description,
                url
            },
            venue,
            special_offers: offers
        };
        onSelect(event);
    }

    return (
        <div className="event" key={id} onClick={handleSelect}>
            <div className='card bg-info shadow-sm h-100'>
                <span className='event_content' align='center'>Event: {id} </span>
            </div>
        </div>
    )
}

export default Event;