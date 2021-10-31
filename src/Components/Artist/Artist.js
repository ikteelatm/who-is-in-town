
import './Artist.css';

const Artist = (props) => {
    const {id, name, url, image_url, facebook_page_url} = props.props;

    return (
        <div className="" key={id}>
            <div className='card shadow-sm h-100 img'>
                <img src={image_url} width='120' height="120" alt={'image_' + id}>
                </img>
            </div>
            <div className='card h-100 band_information'>
                <span>Artist Name: {name}</span>
                <span>
                    <a href={url} target='_blank' rel="noopener noreferrer">Band Website
                    </a>
                </span>
                <span>
                    <a href={facebook_page_url} target='_blank' rel="noopener noreferrer">Facebook Account
                    </a>
                </span>
            </div>

        </div>
    )
}

export default Artist;