/*
*    手机号脱敏
*/
export function hidePhone(phone) {
    let str= phone.toString()
    const pat=/(\d{3})\d*(\d{4})/
    return str.replace(pat,'$1****$2');
}