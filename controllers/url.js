const {nanoid} = require("nanoid");
const URL = require("../models/url");
async function handleGenerateNewShortURL(req, res) {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ message: "URL field is required." });
  }
  const shortID = nanoid(8);
  await URL.create({
    shortId: shortID,
    redirectURL: url,
    visitedHistory: [],  
    createdBy: req.user._id,
  });
  const urls = await URL.find({ createdBy: req.user._id }).lean();
  return res.render("home", {
    id: shortID,
    urls,          
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
          visitedHistory: { timestamp: Date.now() }, 
        },
      },
      { new: true }
    );
  
    if (entry) {
      res.redirect(entry.redirectURL);
    } else {
      res.status(404).send('URL not found');
    }
  }

module.exports={
    handleGenerateNewShortURL, handleGetAnalytics,handleRedirectUrl
}