//this route will find scrape and return gofundme causes
const {goFundMeCategories} = require('../../data/cause-categories')
//importing content based recommender class
const ContentBasedRecommender = require('content-based-recommender')

const recommender = new ContentBasedRecommender({
    minScore: 0.1,
    maxSimilarDocuments: 100
})

//const express = require('express')
//const router = express.Router()


































module.exports = router;