import moment from 'moment';

function formatTimestamp(timestamp){
    return moment(timestamp*1000).format('YYYY-MM-DD HH:mm:ss');
}

export {
    formatTimestamp
}