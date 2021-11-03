import crypto from "crypto";
import moment from 'moment';
import { Schema } from 'mongoose';
import * as os from 'os';

const Decimal128 = Schema.Types.Decimal128;

export const isEmpty = (value: any) => {
  return (
    value === null ||
    value === undefined ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );
};

export const randomFixedInteger = (length: number) => {
  const power10minus1 = 10 ** (length - 1);
  const power10 = 10 ** length;
  let rand = Math.floor(power10minus1 + Math.random() * (power10 - power10minus1 - 1));
  if (String(rand).slice(0, 1) === '0') {
    rand = Math.floor(Math.random() * 899999 + 100000);
  }
  return rand;
};

export const randomSequentialId = () => {
  const uid = new Date().getTime().toString(36);
  return uid;
};

export const getIPAddress = () => {
  const interfaces = os.networkInterfaces();

  for (const devName in interfaces) {
    const iface = interfaces[devName];
    if (iface) {
      for (let i = 0; i < iface?.length; i++) {
        const alias = iface[i];
        if (alias?.family === 'IPv4' && alias?.address !== '127.0.0.1' && !alias?.internal) {
          return alias?.address;
        }
      }
    }
  }
};

export const generateCode = (length: number) => {
  let result = '';
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};



export const isJSON = (str: string) => {
  if (/^\s*$/.test(str)) return false;
  str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@');
  str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
  str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
  return /^[\],:{}\s]*$/.test(str);
};

export const parseOutPropFromObj = <T>(obj: T, delKey: string) => {
  return JSON.parse(JSON.stringify(obj, (k,v) => (k === delKey)? undefined : v))
}

export const removeSensitiveFieldsReturnNew = <T>(obj: T, keys: string[] = ["email", "accountName", "firstName", "lastName", "receivingIntoAddress"]): T => {
  let objy = obj;
  keys.forEach((key) => objy = parseOutPropFromObj(objy, key))
  return objy
}

export const pickString = (
	str: string,
	limit: number = 10000,
	ellipsis: string = '...'
) => {
	const name = String(str)
	if (name && name.length > limit) {
		return `${properCase(name.slice(0, limit))}${ellipsis}`
	}
	return name
}



export const wait = (val: any, timeout: number) =>
  new Promise((res) => {
    setTimeout(() => {
      res(val);
    }, timeout);
  });

export const toPrecision = (number: number | string | typeof Decimal128, precision: number = 2) => {
  const num = Number(number);
  return Number(num.toFixed(precision));
}

export const toLocalePrecision = (number: number | string | typeof Decimal128, precision: number = 2) => {
  const num = Number(number);
  return Number(num.toFixed(precision)).toLocaleString();
}

export const computeHmac = (secret: string, method: string ='sha256', payload:any) =>  {
  var hmac = crypto.createHmac(method, secret);
  hmac.write(typeof payload === 'string' ? payload : JSON.stringify(payload));
  hmac.end();
  return hmac.read().toString("base64");
}

export const durationInHours = (hr: number) => {
  const hoursAgoDate = moment().subtract(hr, 'hours');
  return hoursAgoDate;
}

export const computeMD5 = (payload:any) => {
  const md5 = crypto
    .createHash('md5')
    .update(typeof payload === 'string' ? payload : JSON.stringify(payload));
  return Buffer.from(md5.digest()).toString('base64');
};

export const unique = (arr: any[], key: string) => {
  const uniques = [
        // @ts-ignore
        ...new Map(arr.map((o) => [o[key], o])).values(),
      ];
  return uniques;
  }

export const uuid = (len:number = 8) => {
  return `${randomSequentialId()}-${randomFixedInteger(len)}`;
};

const awaitTimeout = (delay:number, reason:string) =>
  new Promise((resolve, reject) =>
    setTimeout(
      () => (reason === undefined ? resolve(true) : reject(reason)),
      delay
    )
  );


export const awaitOrTimeout = (promise: Promise<any>, delay:number, reason = "Timed out") =>
Promise.race([promise, awaitTimeout(delay, reason)]);

export const diffOfTwoDates = (date1?: Date, date2?: Date) => {
  const givenDate = date1 ? new Date(date1) : new Date();
  const workingDate = date2 ? new Date(date2) : new Date();
  const timeDifference = Math.abs(workingDate.getTime() - givenDate.getTime());
  return timeDifference / 1000;
};

export const properCase = (str: any) => {
	if (str && typeof str === 'string' && str.trim().length === 1) {
		return String(str).trim().toUpperCase()
	}
	if (str && typeof str === 'string') {
		return str
			.trim()
			.split(' ')
			.map((w) => w[0] && w[0].toUpperCase() + w.substr(1).toLowerCase())
			.join(' ')
	}
	if (str && typeof str === 'object' && str.length > 0) {
		return str.map((st: any) =>
			String(st)
				.trim()
				.split(' ')
				.map((w) => w[0] && w[0].toUpperCase() + w.substr(1).toLowerCase())
				.join(' ')
		)
	}
	return str
}

export const maybePluralize = (count: number, noun: string, suffix = 's') =>
  `${noun}${count !== 1 ? suffix : ''}`;

const timeouts = {} as {[k: string]: ReturnType<typeof setTimeout>}
export const debounce = (callback: any, delay: number, marker: string = String(Math.random() * 8789898)) => {
  let timeout = timeouts[marker];
  return function () {
    timeout && clearTimeout(timeout)
    timeouts[marker] = setTimeout((...args:any)=>{
      delete timeouts[marker]
      return callback(args)
    }, delay)
  }
}

