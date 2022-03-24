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

        const project1 = res["projects"]["project"][Math.floor(random(1, 10))-1]
        const project2 = res["projects"]["project"][Math.floor(random(1, 10))-1]
        const project3 = res["projects"]["project"][Math.floor(random(1, 10))-1]
        
        const proj1url = await getProjectUrl(specificIdUrl(project1["id"]))
        console.log("Proj 1 url")
        console.log(proj1url)
        //const proj2url
        //const proj3url

        const project1Obj = {
            image: project1["imageLink"],
            title: project1["title"],
            country: project1["country"],
            summary: project1["summary"],
            id: project1["id"],
            url: getProjectUrl(specificIdUrl(project1["id"]))
        }

        const project2Obj = {
            image: project2["imageLink"],
            title: project2["title"],
            country: project2["country"],
            summary: project2["summary"],
            id: project2["id"],
            url:getProjectUrl(specificIdUrl(project2["id"]))
        }

        const project3Obj = {
            image: project3["imageLink"],
            title: project3["title"],
            country: project3["country"],
            summary: project3["summary"],
            id: project3["id"],
            url: getProjectUrl(specificIdUrl(project3["id"]))
        }

        causeListInterest.push(project1Obj, project2Obj, project3Obj)
    })
    .catch((err) => {
        console.error(err)
    })
}

/*
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
        //const projectList = res["projects"]
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
    let proj1 = ''
    let proj2 = ''
    let proj3 = ''
    if(interests.length<3 && interests.length>2){
        proj1 = getCauseByInterest(interests[0])
        proj2 = getCauseByInterest(interests[1])
        //making sure it doesn't return the same project as before 
        proj3 = getCauseByInterest(interests[1])
        causeListInterest.push(proj1, proj2, proj3)
    }

    else if(interests.length === 3){
        proj1 = getCauseByInterest(interests[0])
        proj2 = getCauseByInterest(interests[1])
        proj3 = getCauseByInterest(interests[2])
        causeListInterest.push(proj1, proj2, proj3)
    }

    else if(interests.length === 1){
        proj1 = getCauseByInterest(interests[0])
        proj2 = getCauseByInterest(interests[0])
        proj3 = getCauseByInterest(interests[0])
        causeListInterest.push(proj1, proj2, proj3)
    }

    else if(interests.length > 3){
        proj1 = getCauseByInterest(interests[Math.floor(Math.random()* interests.length)])
        proj2 = getCauseByInterest(interests[Math.floor(Math.random()* interests.length)])
        proj3 = getCauseByInterest(interests[Math.floor(Math.random()* interests.length)])
        causeListInterest.push(proj1, proj2, proj3)
    }
 }
 */

 const getProjectUrl = async(url) =>{
    let projectUrl = ""
    const parser = xml2js.Parser({ignoreAttrs : false, mergeAttrs : true, explicitArray: false});
    const causeResponse = await fetch(url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    })

    const data = await causeResponse.text()

    parser.parseStringPromise(data)
    .then((res)=>{
        const url = res["project"]["projectLink"]
        console.log("Finding url")
        console.log(url)
        projectUrl = url
    })
    .catch((err)=> {
        console.error(err)
    })
    
    return projectUrl
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
    .then((res)=>{

        const project1 = res["projects"]["project"][Math.floor(random(1, 10))-1]
        const project2 = res["projects"]["project"][Math.floor(random(1, 10))-1]
        const project3 = res["projects"]["project"][Math.floor(random(1, 10))-1]

        const project1Obj = {
            image: project1["imageLink"],
            title: project1["title"],
            country: project1["country"],
            summary: project1["summary"],
            id: project1["id"]
        }

        const project2Obj = {
            image: project2["imageLink"],
            title: project2["title"],
            country: project2["country"],
            summary: project2["summary"],
            id: project2["id"]
        }

        const project3Obj = {
            image: project3["imageLink"],
            title: project3["title"],
            country: project3["country"],
            summary: project3["summary"],
            id: project3["id"]
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
