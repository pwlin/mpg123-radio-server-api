/*jslint node:true*/
var express = require('express'),
    request = require('request'),
    cheerio = require('cheerio'),
    router = express.Router();

/* /thumbs/track/:trackname/:artistname */
router.get('/track/:q', function (req, res, next) {
    'use strict';
    var data = {},
        googleImgUrl = '',
        $,
        allImages;
    data.httpStatus = 200;
    data.thumb = '';
    if (req.params.q) {
        // &tbs=isz:l,ic:color
        googleImgUrl = 'https://encrypted.google.com/search?q=' + encodeURIComponent(req.params.q) + '&hl=en&tbm=isch&_ts=' + new Date().getTime();
        request({
            url: googleImgUrl
        }, function (err, resp, body) {
            try {
                $ = cheerio.load(body);
                allImages = $("img[alt*='Image result for']");
                if (allImages && allImages.length > 0) {
                    data.thumb = allImages[0].attribs.src;
                }
            } catch (e) {}
            res.status(200).jsonp(data);
        });
    } else {
        res.status(200).jsonp(data);
    }
});

module.exports = router;