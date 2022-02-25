//this file will be used to get information from the just giving api to get information of different fundraisers
const xml2js = require('xml2js')
const fetch = require('node-fetch')
const API_KEY = process.env.GG_API_KEY;
const causeListInterest = []
const causeListCountry = []

//function to create the url that a get request will be sent to for a specific theme
const getThemeUrl = (theme) => {
    return 'https://api.globalgiving.org/api/public/projectservice/themes/' + theme.toLowerCase() +  '/projects/summary?api_key=' + process.env.GG_API_KEY;
} 

const getCountryUrl = (countryCode) => {
    return 'https://api.globalgiving.org/api/public/projectservice/countries/' + countryCode +  '/projects?api_key=' + process.env.GG_API_KEY;
}

const getCausesByInterest = async (url) => {
    const parser = xml2js.Parser({ignoreAttrs : false, mergeAttrs : true, explicitArray: false});
    const causeResponse = await fetch(url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    })

    const data = await causeResponse.text()

    parser.parseStringPromise(data)
    .then((res) => {

        const project1 = res["projects"]["project"][5]
        const project2 = res["projects"]["project"][6]
        const project3 = res["projects"]["project"][7]

        const project1Obj = {
            image: project1["imageLink"],
            title: project1["title"],
            country: project1["country"],
            summary: project1["summary"]
        }

        const project2Obj = {
            image: project2["imageLink"],
            title: project2["title"],
            country: project2["country"],
            summary: project2["summary"]
        }

        const project3Obj = {
            image: project3["imageLink"],
            title: project3["title"],
            country: project3["country"],
            summary: project3["summary"]
        }

        causeListInterest.push(project1Obj, project2Obj, project3Obj)
    })
    .catch((err) => {
        console.error(err)
    })
}

//returns singular cause, will call this method a few times to send an array in 
const getCauseByInterest = async (interest) => {
    const url = getThemeUrl(interest)
    const parser = xml2js.Parser({ignoreAttrs : false, mergeAttrs : true, explicitArray: false});
    const causeResponse = await fetch(url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    })
    const data = await causeResponse.text()
    parser.parseStringPromise(data)
    .then((res)=>{
        const projectList = res["projects"]
        const random = (min, max) => {
            return Math.random() * (max - min) + min 
        }
        const project = res["projects"]["project"][Math.floor(random(1, 10))-1]
        const projectObj = {
            image: project["imageLink"],
            title: project["title"],
            country: project["country"],
            summary: project["summary"]
        }
        return projectObj
    })
    .catch((err)=> {
        console.error(err)
    })
}

 const getCausesByInterests = async (...interests) => {
    if(interests.length<3){
        
    } 
 }


const getCausesByCountry = async (url) => {
    const parser = xml2js.Parser({ignoreAttrs : false, mergeAttrs : true, explicitArray: false});
    const causeResponse = await fetch(url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    })

    const data = await causeResponse.text()

    parser.parseStringPromise(data)
    .then((res)=>{

        
        const project1 = res["projects"]["project"][9]
        const project2 = res["projects"]["project"][8]
        const project3 = res["projects"]["project"][7]

        const project1Obj = {
            image: project1["imageLink"],
            title: project1["title"],
            country: project1["country"],
            summary: project1["summary"]
        }

        const project2Obj = {
            image: project2["imageLink"],
            title: project2["title"],
            country: project2["country"],
            summary: project2["summary"]
        }

        const project3Obj = {
            image: project3["imageLink"],
            title: project3["title"],
            country: project3["country"],
            summary: project3["summary"]
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
    getCausesByInterest: getCausesByInterest,
    getCausesByCountry: getCausesByCountry,
    causeListInterest,
    causeListCountry
}
