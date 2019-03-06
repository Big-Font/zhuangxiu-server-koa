// app/api/weichat.js 
const { sign } = require('../../lib/xml');
const WeChat = require('../../routes/wechat').getWeChat();
const WeChatOAuth = require('../../routes/wechat').getOAuth();

// 获取 token ,根据 token 获取 ticket ，然后将 ticket 和 url进行签名，同时添加分享时需要的 appId
exports.getSignature = async (url) => {
    const TokenData = await WeChat.fetchAccessToken();
    const Token = TokenData.access_token;
    const TicketData = await WeChat.fetchTicket(Token);
    const Ticket = TicketData.ticket;
    let params = sign(Ticket, url);
    params.appId = WeChat.appID;

    return params;
};


// exports.getSignature = async (url) => {
//     // const TokenData = await WeChat.fetchAccessToken();
//     // const Token = TokenData.access_token;
//     // const TicketData = await WeChat.fetchTicket(Token);
//     // const Ticket = TicketData.ticket;
//     // let params = sign(Ticket, url);
//     // params.appId = WeChat.appID;

//     // const url = ctx.href;
//     const client = getWeChat();
//     const data = await client.fetchAccessToken();
//     const token = data.access_token;
//     const ticketData = await client.fetchTicket(token);
//     const ticket = ticketData.ticket;

//     let params = util.sign(ticket, url);
//     params.appId = client.appId;

//     return params;
// };

exports.getAuthorizeUrl = (scope, target, state) => {
    const oauth = getOAuth();
    let url = oauth.getAuthorizeUrl(scope, target, state);
    return url;
};

exports.getUserInfo = async (code, lang="zh_CN") => {
    const oauth = getOAuth();
    const TokenData = await oauth.fetchAccessToken(code);
    const UserData = await oauth.getUserInfo(TokenData.access_token, TokenData.openid, lang);
    return UserData;
};

// exports.saveWeChatUser = async (UserData)=>{
//     let query = {
//         openid: UserData.openid,
//     };
//     if(UserData.unionid){
//         query = {
//             unionid: UserData.unionid,
//         };
//     }
//     let user = await User.findOne(query);
//     if(!user){
//         user = new User({
//             openid: [UserData.openid],
//             unionid: UserData.unionid,
//             nickname: UserData.nickname,
//             email: (UserData.unionid || UserData.openid) + '@wx.com',
//             province: UserData.province,
//             country: UserData.country,
//             city: UserData.city,
//             gender: UserData.gender,
//         });
//         await user.save();
//     }
//     return user;
// };

// exports.saveMpUser = async (message, from='')=>{
//     let sceneId = message.EventKey;
//     let openid = message.FromUserName;
//     let count = 0;
//     if (sceneId && sceneId.indexOf('qrscene_') > -1) {
//       sceneId = sceneId.replace('qrscene_', '');
//     }
//     let user = await User.findOne({
//       openid: openid,
//     });
//     let mp = require('../../wechat/index');
//     let client = mp.getWeChat();
//     let userInfo = await client.handle('getUserInfo', openid);
//     if ('koaMovie' === sceneId) {
//       from = 'koaMovie';
//     }
//     if (!user) {
//       let userData = {
//         from: from,
//         openid: [userInfo.openid],
//         unionid: userInfo.unionid,
//         nickname: userInfo.nickname,
//         email: (userInfo.unionid || userInfo.openid) + '@wx.com',
//         province: userInfo.province,
//         country: userInfo.country,
//         city: userInfo.city,
//         gender: userInfo.gender,
//       };
//       user = new User(userData);
//       user = await user.save();
//     }
//     if ('koaMovie' === from) {
//       let tagid;
//       count = await User.count({
//         from: 'koaMovie',
//       });
//       try {
//         let tagsData = await client.handle('fetchTags');
//         tagsData = tagsData || {};
//         let tags = tagsData.tags || [];
//         let filteredTags = tags.filter(tag => {
//           return 'koaMovie' === tag.name;
//         });
//         if (filteredTags && filteredTags.length > 0) {
//           tagid = filteredTags[0].id;
//           count = filteredTags[0].count || 0;
//         } else {
//           let res = await client.handle('createTag', 'koaMovie');
//           tagid = res.tag.id;
//         }
//         if (tagid) {
//           await client.handle('batchUsersTag', [openid], tagid);
//         }
//       } catch (err) {
//         console.log(err);
//       }
//     }
//     return {
//       user,
//       count,
//     };
// }