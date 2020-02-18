import moment from 'moment';

function formatTimestamp(timestamp){
    return moment(timestamp*1000).format('YYYY-MM-DD HH:mm:ss');
}

function getFormatAddress(address){
    return address ? `${address.substring(0,3)}...${address.substring(address.length - 8)}` : '';
}

function isJson(str){
    if (typeof str === 'string') {
        try {
            const obj=JSON.parse(str);
            if(typeof obj === 'object' && obj ){
                console.log('是JSON');
                return true;
            }else{
                return false;
            }
        } catch(e) {
            console.log('error：'+str+'!!!'+e);
            return false;
        }
    }
}

function formatDuring(ms) {
    let s = ms/1000;
    let days = s / (60 * 60 * 24);
    let hours = (s % (60 * 60 * 24)) / (60 * 60);
    let minutes = (s % (60 * 60)) / (60);
    let seconds = s % 60;
    return {
        days,hours,minutes,seconds
    }
}

export {
    formatTimestamp,
    getFormatAddress,
    isJson,
    formatDuring,
}