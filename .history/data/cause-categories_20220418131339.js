const goFundMeCategories =  new Map([
    ["medical", '/en-ie/start/medical-fundraising'],
    ["memorial", '/en-ie/start/memorial-fundraising'],
    ["emergency", '/en-ie/start/emergency-fundraising'],
    ["charity", '/en-ie/start/charity-fundraising'],
    ["education", '/en-ie/start/education-fundraising'],
    ["animal", '/en-ie/discover/animal-fundraiser'],
    ["environment", '/en-ie/start/environment-fundraising'],
    ["competition", '/en-ie/discover/competition-fundraiser'],
    ["creative", '/en-ie/discover/creative-fundraiser'],
    ["event", '/en-ie/discover/event-fundraiser'],
    ["faith", '/en-ie/discover/faith-fundraiser'],
    ["family", '/en-ie/discover/family-fundraiser'],
    ["sports", '/en-ie/discover/sports-fundraiser'],
    ["travel", '/en-ie/discover/travel-fundraiser'],
    ["volunteer", '/en-ie/discover/volunteer-fundraiser'],
    ["wishes", '/en-ie/discover/wishes-fundraiser']
])

const CrowdfunderCategories = new Map([
    ["Community", 'category=Community&completed=pending&isLive=true&map=off'], 
    ["Charities", 'category=Charities&completed=pending&isLive=true&map=off'], 
    ["Business", 'category=Business&completed=pending&isLive=true&map=off'],
    ["Personal Causes", 'category=Personal%20Causes&completed=pending&isLive=true&map=off'],  
    ["Social Enterprise", 'category=Social%20Enterprise&completed=pending&isLive=true&map=off'],
    ["Creative & Arts", 'category=Creative%20%26%20Arts&completed=pending&isLive=true&map=off'],  
    ["Music", 'category=Music&completed=pending&isLive=true&map=off'], 
    ["Film and Theatre", 'category=Film%20and%20Theatre&completed=pending&isLive=true&map=off'], 
    ["Sports", 'category=Sports&completed=pending&isLive=true&map=off'], 
    ["Schools", 'category=Schools&completed=pending&isLive=true&map=off'],
    ["Food and Drink", 'category=Food%20and%20Drink&completed=pending&isLive=true&map=off'], 
    ["Environment", 'category=Environment&completed=pending&isLive=true&map=off'], 
    ["Health & Fitness", 'category=Health%20%26%20fitness&completed=pending&isLive=true&map=off'],
    ["Politics", 'category=Politics&completed=pending&isLive=true&map=off'],
    ["Technology", 'category=Technology&completed=pending&isLive=true&map=off'],
    ["Leisure", 'category=Leisure&completed=pending&isLive=true&map=off'],
    ["Tourism", 'category=Tourism&completed=pending&isLive=true&map=off'],
])

const globalGivingThemes = [
    "gender",
    "housing",
    "disability",
    "ecdev",
    "disaster",
    "democ",
    "agriculture",
    "children",
    "rights",
    "justice",
    "animals",
    "wildlife",
    "tech",
    "art",
    "endabuse",
    "lgbtq",
    "health",
    "covid-19",
    "climate",
    "env",
    "water",
    "hunger",
    "reproductive",
    "mentalhealth",
    "refugee",
    "edu",
    "sport"
]

module.exports = {
    goFundMeCategories,
    globalGivingThemes,
    CrowdfunderCategories
}