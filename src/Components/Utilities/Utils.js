
export const CONSTANTS = {
    SEARCH_DELAY_BEFORE_REST_CALL: 500,
    APP_ID: '123',
    HOST: 'https://rest.bandsintown.com',
    EVENTS_DATE : {
        ALL: 'all',
        PAST: 'past',
        UPCOMING: 'upcoming'
    }
}

const getData = async (reqUrl) => {
    return await fetch(reqUrl, {
        method: 'GET',
    })
        .then(res => {
            //console.log(res);
            if (!res.ok || (res.status !== 200 && res.status !== 201)) {
                throw new Error('Failed');
            }

            return res.json();
        })
        .then(resData => {
            //console.log(resData);
            return resData;
        })
        .catch(err => {
            // Do something for an error here
            console.log("Error Reading data " + err);
            throw new Error('Failed');
        });
}

export const getArtist = async (artistName) => {
    const reqUrl = CONSTANTS.HOST + '/artists/' + encodeURIComponent(artistName) + '?app_id=' + CONSTANTS.APP_ID;
    return await getData(reqUrl);
}

export const getEvents = async (artistName ,date = CONSTANTS.EVENTS_DATE.ALL) => {
    const reqUrl = CONSTANTS.HOST + '/artists/' + encodeURIComponent(artistName) + '/events?app_id=' + CONSTANTS.APP_ID
    + '&date=' + date;
    return await getData(reqUrl);
}