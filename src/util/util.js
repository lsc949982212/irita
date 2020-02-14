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

export {
    formatTimestamp,
    getFormatAddress,
    isJson,
}