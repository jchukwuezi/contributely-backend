const goFundMeCategories =  new Map([
    ["Health & Medical", '/en-ie/start/medical-fundraising'],
    ["Memorial", '/en-ie/start/memorial-fundraising'],
    ["Emergency", '/en-ie/start/emergency-fundraising'],
    ["Charity", '/en-ie/start/charity-fundraising'],
    ["Education", '/en-ie/start/education-fundraising'],
    ["Animal", '/en-ie/discover/animal-fundraiser'],
    ["Environment", '/en-ie/start/environment-fundraising'],
    ["Competition", '/en-ie/discover/competition-fundraiser'],
    ["Creative", '/en-ie/discover/creative-fundraiser'],
    ["Event", '/en-ie/discover/event-fundraiser'],
    ["Faith", '/en-ie/discover/faith-fundraiser'],
    ["Family", '/en-ie/discover/family-fundraiser'],
    ["Sports", '/en-ie/discover/sports-fundraiser'],
    ["Travel", '/en-ie/discover/travel-fundraiser'],
    ["Volunteer", '/en-ie/discover/volunteer-fundraiser'],
    ["Wishes", '/en-ie/discover/wishes-fundraiser']
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
    ["Health & Medical", 'category=Health%20%26%20fitness&completed=pending&isLive=true&map=off'],
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
    ["Health & Medical", 'health'],
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

const common = ['Sports', 'Education', 'Environment', ]
const ggGfmCommon = ['education']
const cfGfmCommon = []

module.exports = {
    goFundMeCategories,
    globalGivingThemes,
    CrowdfunderCategories
}