import crypto from 'crypto';

export let md5 = (str) => {
    const obj = crypto.createHash('md5');
    obj.update(str);
    return obj.digest('hex');
}