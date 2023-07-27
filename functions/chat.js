addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})
const responseMsgs = [
    '您好，客服正忙，请稍后联系。',
    '您好，正在处理您的消息，请稍等。',
    '您好，暂时无法回答您的问题。',
    '您好，当前访问人数过多，请稍后再试。'
];
async function handleRequest(req) {
    const method = req.method;
    console.log("req.method:", method, req);
    try {
        const rspData = {
            code: 1,
            msg: '',
            data: {
                time: new Date().getTime(),
                chatMsg: ''
            }
        };
        let randomIndex = Math.floor(Math.random() * responseMsgs.length);
        rspData.data.chatMsg = `[自动回复] ${responseMsgs[randomIndex]}`;
        return new Response(JSON.stringify(rspData), {
            headers: {
                "content-type": "application/json",
            },
        })
    } catch (e) {
        console.log("Got Exception: " + e.stack);
        return new Response("Got Exception: " + e.message, {
            headers: {
                "content-type": "application/json",
            },
        });
    }
}
