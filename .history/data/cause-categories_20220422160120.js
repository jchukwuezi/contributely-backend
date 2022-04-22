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
    ["Education", 'category=Schools&completed=pending&isLive=true&map=off'],
    ["Food and Drink", 'category=Food%20and%20Drink&completed=pending&isLive=true&map=off'], 
    ["Environment", 'category=Environment&completed=pending&isLive=true&map=off'], 
    ["Health & Fitness", 'category=Health%20%26%20fitness&completed=pending&isLive=true&map=off'],
    ["Politics", 'category=Politics&completed=pending&isLive=true&map=off'],
    ["Technology", 'category=Technology&completed=pending&isLive=true&map=off'],
    ["Leisure", 'category=Leisure&completed=pending&isLive=true&map=off'],
    ["Tourism", 'category=Tourism&completed=pending&isLive=true&map=off'],
])

const globalGivingThemes = new Map([
    ["Animal Welfare", 'animals'],
    ["Child Protection", 'children'],
    ["Climate Action", 'climate'],
    ["Peace and Reconciliation", 'democ'],
    ["Disaster Response", 'disaster'],
    ["Economic Growth", 'ecdev'],
    ["Education", 'edu'],
    ["Environment", 'env'],
    ["Gender Equality", 'gender'],
    ["Physical Health", 'health'],
    ["Ending Human Trafficking", 'human'],
    ["Justice and Human Rights", 'rights'],
    ["Sports", 'sport'],
    ["Digital Literacy", 'tech'],
    ["Food Security", 'hunger'],
    ["Arts and Culture", 'art'],
    ["LGBTQIA+ Equality", 'lgbtq'],
    ["COVID-19", 'covid-19'],
    ["Clean Water", 'water'],
    ["Disability Rights", 'disability'],
    ["Ending Abuse", 'endabuse'],
    ["Mental Health", 'mentalhealth'],
    ["Racial Justice", 'justice'],
    ["Refugee Rights", 'refugee'],
    ["Reproductive Health", 'reproductive'],
    ["Safe Housing", 'housing'],
    ["Sustainable Agriculture", 'agriculture'],
    ["Wildlife Conversation", 'wildlife']
])

const common = ['Sports', 'Education']
const ggGfmCommon = ['education']
const cfGfmCommon = []

module.exports = {
    goFundMeCategories,
    globalGivingThemes,
    CrowdfunderCategories
}