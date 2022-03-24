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

const KickstarterCategoryCodes = new Map([
    ["Art", 1],
    ["Comics", 3],
    ["Crafts", 26],
    ["Dance", 6],
    ["Design", 7],
    ["Fashion", 9],
    ["Film & Video", 11],
    ["Food", 10],
    ["Games", 12],
    ["Journalism", 13],
    ["Music", 14],
    ["Photography", 15],
    ["Publishing", 18],
    ["Technology", 16],
    ["Theater", 17]
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
    globalGivingThemes
}