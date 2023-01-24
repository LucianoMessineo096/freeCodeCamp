const shortId = require('shortId');
const mongoose = require('mongoose')
const {Schema} =  mongoose;
const UrlModel = require('./UrlSchema');

async function findShortUrl(shortUrl){

    return await UrlModel.findOne({short_url:shortUrl}).exec();

}

async function saveUrl(url,req,res){

    try{

        let urlParams = await UrlModel.findOne({long_url:url}).exec();

        if(!urlParams){

            let short_url = shortId.generate()
            const newUrl = new UrlModel({long_url:url,short_url:short_url})
            await newUrl.save();

            res.json({original_url:url,short_url:short_url});

        }else{

            res.json({original_url:urlParams.long_url,short_url:urlParams.short_url});
            
        }

    }catch(err){

        res.json({error:"url not saved"});
    }
}

module.exports = {saveUrl,findShortUrl}
