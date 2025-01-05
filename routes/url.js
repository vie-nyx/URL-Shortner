const {handleGenerateNewShortURL,handleGetAnalytics,handleRedirectUrl} = require("../controllers/url");
const express = require("express");
const router = express.Router();

router.post("/",handleGenerateNewShortURL);
router.get("/:shortId",handleRedirectUrl);
router.get("/analytics/:shortId",handleGetAnalytics)
module.exports = router;