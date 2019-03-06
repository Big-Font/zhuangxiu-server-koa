const UrlJoin = (...args) => {
    const ProtocolPattern = /http[s]?/;
    const DomainPattern = /http[s]?:\/\/(.*?)\//;

    let url = '';
    let protocol = '';
    let domain = '';
    let path = [];

    args.forEach(item=>{
        if(ProtocolPattern.exec(item)){
            protocol = ProtocolPattern.exec(item)[0];
        }
        if(DomainPattern.exec(item)){
            domain = DomainPattern.exec(item)[1];
        }
        if(!ProtocolPattern.exec(item) && !DomainPattern.exec(item)){
            if(0 == item.indexOf('/')){
                path[0] = item.substr(1);
            }else {
                path.push(item);
            }
        }
    });

    url = protocol + "://" + domain + "/" + path.join('');

    return url;
}

const IsWeChat = (ua)=>{
    if(ua.indexOf('MicroMessenger')>=0){
        return true;
    }else{
        return false;
    }
};

module.exports = {
    UrlJoin,
    IsWeChat,
};