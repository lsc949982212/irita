import moment from 'moment';

function formatTimestamp(timestamp){
    return moment(timestamp*1000).format('YYYY-MM-DD HH:mm:ss');
}

function getFormatAddress(address){
    return address ? `${address.substring(0,3)}...${address.substring(address.length - 8)}` : '';
}

export {
    formatTimestamp,
    getFormatAddress,
}