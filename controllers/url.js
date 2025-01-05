const {nanoid} = require("nanoid");
const URL = require("../models/url");
async function handleGenerateNewShortURL(req,res){
    const body = req.body;
    if(!body.url){
        return res.status(400).json({message:"URL field is required."});
    }
    const shortID = nanoid(8);
    const newURL = URL({
        shortId:shortID,
        redirectURL:body.url,
        visitHistory:[],
        createdBy:req.user._id,
    });
    newURL.save()
  .then(() => console.log('URL saved successfully'))
  .catch((error) => console.log('Error saving URL:', error));
    return res.render('home',{
        id:shortID,
        url:body.url,
    });
}

async function handleGetAnalytics(req,res){
    const shortId = req.params.shortId;
    const result = await URL.findOne({shortId});
    return res.json({
        totalClicks : result.visitedHistory.length,
        analytics : result.visitedHistory,
    })
}

async function handleRedirectUrl(req, res) {
    const shortId = req.params.shortId;
    
    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitedHistory: { timestamp: Date.now() },  // Fixed spelling issue
        },
      },
      { new: true }
    );
  
    if (entry) {
      // If entry exists, redirect to the original URL
      res.redirect(entry.redirectURL);
    } else {
      // If entry does not exist, return a 404 response
      res.status(404).send('URL not found');
    }
  }

module.exports={
    handleGenerateNewShortURL, handleGetAnalytics,handleRedirectUrl
}