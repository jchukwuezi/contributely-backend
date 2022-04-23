//this file will be used to get information from the just giving api to get information of different fundraisers
const xml2js = require('xml2js')
const fetch = require('node-fetch')

//function to create the url that a get request will be sent to for a specific theme
const getThemeUrl = (theme) => {
    return 'https://api.globalgiving.org/api/public/projectservice/themes/' + theme.toLowerCase() +  '/projects/active/summary?api_key=' + process.env.GG_API_KEY;
} 

const getCountryUrl = (countryCode) => {
    return 'https://api.globalgiving.org/api/public/projectservice/countries/' + countryCode +  '/projects/active/?api_key=' + process.env.GG_API_KEY;
}

const specificIdUrl = (id) =>{
    return 'https://api.globalgiving.org/api/public/projectservice/projects/' + id + '?api_key=' + process.env.GG_API_KEY;
}

 const getProjectUrl = async(url) =>{
    const parser = xml2js.Parser({ignoreAttrs : false, mergeAttrs : true, explicitArray: false});
    const causeResponse = await fetch(url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    })
    const data = await causeResponse.text()
    const page = await parser.parseStringPromise(data)
    const projectLink = page["project"]["projectLink"]
    return projectLink
 }

 const getProjectThemes = async(url) =>{
    const parser = xml2js.Parser({ignoreAttrs : false, mergeAttrs : true, explicitArray: false});
    const causeResponse = await fetch(url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    })
    const data = await causeResponse.text()
    const page = await parser.parseStringPromise(data)
    const themes = page["project"]["themes"]["theme"]
    //console.log(themes)
    let ids = []
    for(let i=0; i<themes.length; i++){
        //console.log(themes[i]["id"])
        ids.push(themes[i]["id"])
    }
    return ids
 }

module.exports = {
    getThemeUrl: getThemeUrl,
    getCountryUrl: getCountryUrl,
    specificIdUrl: specificIdUrl,
    getProjectUrl: getProjectUrl,
    getProjectThemes: getProjectThemes,
}
