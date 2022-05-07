const fastify = require('fastify')({ logger: true });
const path = require('path');
const fs = require('fs');
const showdown  = require('showdown');
const converter = new showdown.Converter({
    strikethrough: 'true',
    tables: 'true',
    underline: 'true',
    disableForced4SpacesIndentedSublists: 'true',
    openLinksInNewWindow: 'true',
    extensions: [require('showdown-highlight')({ pre: true })]
});

fastify.register(require("point-of-view"), {
    engine: {
        ejs: require("ejs")
    },
    viewExt: "html"
}).register(require('@fastify/static'), {
    root: path.resolve('./static/'),
    prefix: '/static/'
});

fastify.get('/favicon.ico', (req, res) => {
    stream = fs.createReadStream(path.resolve('./static/media/favicon.ico'));
    res.type('image/png').send(stream);
});

fastify.get('/', async (req, res) => {
    var content = fs.readFileSync('./content/home.md', 'utf8');
    res.view('./static/index.html', {
        content: converter.makeHtml(content)
    });
});

fastify.get('*', async (req, res) => {
    let url = req.url;
    if (url.endsWith('/')) url = url.slice(0, -1);
    try { var content = fs.readFileSync('./content' + url + '.md', 'utf8'); }
    catch (err) { content = '404' }
    res.view('./static/default.html', {
        content: converter.makeHtml(content)
    });
});

fastify.listen(3000, (err, address) => {
    if (err) throw err
    // Server is now listening on ${address}
});