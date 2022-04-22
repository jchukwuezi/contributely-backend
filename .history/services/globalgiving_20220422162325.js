//this file will be used to get information from the just giving api to get information of different fundraisers
const xml2js = require('xml2js')
const fetch = require('node-fetch')
const API_KEY = process.env.GG_API_KEY;
const causeListInterest = []
const causeListCountry = []


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


const getCausesByInterests = async (url) => {
    const parser = xml2js.Parser({ignoreAttrs : false, mergeAttrs : true, explicitArray: false});
    const causeResponse = await fetch(url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    })

    const data = await causeResponse.text()

    const random = (min, max) => {
        return Math.random() * (max - min) + min 
    }

    parser.parseStringPromise(data)
    .then(async (res) => {

        const project1 = res["projects"]["project"][0]
        const project2 = res["projects"]["project"][1]
        const project3 = res["projects"]["project"][2]

        const project1Obj = {
            image: project1["imageLink"],
            title: project1["title"],
            country: project1["country"],
            summary: project1["summary"],
            country: project1["country"],
            mission: project1["organization"]["mission"],
            id: project1["id"],
            url: await getProjectUrl(specificIdUrl(project1["id"])),
            themes: await getProjectThemes(specificIdUrl(project1["id"]))
        }

        const project2Obj = {
            image: project2["imageLink"],
            title: project2["title"],
            country: project2["country"],
            summary: project2["summary"],
            country: project2["country"],
            mission: project2["organization"]["mission"],
            id: project2["id"],
            url: await getProjectUrl(specificIdUrl(project2["id"])),
            themes: await getProjectThemes(specificIdUrl(project2["id"]))
        }

        const project3Obj = {
            image: project3["imageLink"],
            title: project3["title"],
            country: project3["country"],
            summary: project3["summary"],
            country: project3["country"],
            mission: project3["organization"]["mission"],
            id: project3["id"],
            url: await getProjectUrl(specificIdUrl(project3["id"])),
            themes: await getProjectThemes(specificIdUrl(project3["id"]))
        }

        causeListInterest.push(project1Obj, project2Obj, project3Obj)
    })
    .catch((err) => {
        console.error(err)
    })
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



const getCausesByCountry = async (url) => {
    const parser = xml2js.Parser({ignoreAttrs : false, mergeAttrs : true, explicitArray: false});
    const causeResponse = await fetch(url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    })

    const random = (min, max) => {
        return Math.random() * (max - min) + min 
    }


    const data = await causeResponse.text()

    parser.parseStringPromise(data)
    .then(async (res)=>{
        const project1 = res["projects"]["project"][0]
        const project2 = res["projects"]["project"][1]
        const project3 = res["projects"]["project"][2]

        const project1Obj = {
            image: project1["imageLink"],
            title: project1["title"],
            country: project1["country"],
            summary: project1["summary"],
            goal: project1["goal"],
            longTermImpact: project1["longTermImpact"],
            id: project1["id"],
            url: await getProjectUrl(specificIdUrl(project1["id"])),
            themes: await getProjectThemes(specificIdUrl(project1["id"]))
        }

        const project2Obj = {
            image: project2["imageLink"],
            title: project2["title"],
            country: project2["country"],
            summary: project2["summary"],
            goal: project2["goal"],
            longTermImpact: project2["longTermImpact"],
            id: project2["id"],
            url: await getProjectUrl(specificIdUrl(project2["id"])),
            themes: await getProjectThemes(specificIdUrl(project2["id"]))
        }

        const project3Obj = {
            image: project3["imageLink"],
            title: project3["title"],
            country: project3["country"],
            summary: project3["summary"],
            goal: project3["goal"],
            longTermImpact: project3["longTermImpact"],
            id: project3["id"],
            url: await getProjectUrl(specificIdUrl(project3["id"])),
            themes: await getProjectThemes(specificIdUrl(project3["id"]))
        }
        

        causeListCountry.push(project1Obj, project2Obj, project3Obj)
    })
    .catch((err)=> {
        console.error(err)
    })
}


module.exports = {
    getThemeUrl: getThemeUrl,
    getCountryUrl: getCountryUrl,
    getCausesByInterests: getCausesByInterests,
    getCausesByCountry: getCausesByCountry,
    causeListInterest,
    causeListCountry
}
