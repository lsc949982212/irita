import moment from 'moment';

function formatTimestamp(timestamp: number): string {
      return moment(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss');
}

function getFormatAddress(address: string, prefix: number = 3): string {
      return address ? `${address.substring(0, prefix)}...${address.substring(address.length - 8)}` : '';
}

function isJson(str: any): boolean {
      if (typeof str === 'string') {
            try {
                  const obj: any = JSON.parse(str);
                  if (typeof obj === 'object' && obj) {
                        console.log('是JSON');
                        return true;
                  } else {
                        return false;
                  }
            } catch (e) {
                  console.log('error：' + str + '!!!' + e);
                  return false;
            }
      }else{
            return false;
      }
}

function formatDuring(ms: number): any {
      const s: number = ms / 1000;
      const days: number = s / (60 * 60 * 24);
      const hours: number = (s % (60 * 60 * 24)) / (60 * 60);
      const minutes: number = (s % (60 * 60)) / (60);
      const seconds: number = s % 60;
      return {
            days, hours, minutes, seconds
      }
}

export {
      formatTimestamp,
      getFormatAddress,
      isJson,
      formatDuring,
}