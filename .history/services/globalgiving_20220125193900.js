const fetch = require("node-fetch")
const xml2js = require("xml2js")
const causeList = []

const getThemeURL = function (theme) {
    BASE_URL = 'https://api.globalgiving.org/api/public/projectservice/themes/' + theme + 'projects/summary?api_key=' + process.env.GG_API_KEY
    return BASE_URL
}

const getCountyURL = function (countryCode){
    BASE_URL = 'https://api.globalgiving.org/api/public/projectservice/countries/' + countryCode + 'projects/summary?api_key=' + process.env.GG_API_KEY
    return BASE_URL
}

const getCauses = async function (url) {
    console.log('Looking for causes')
    const parser = xml2js.Parser({ignoreAttrs: false, mergeAttrs: true, explicitArray: false})
    const causeResponse = await fetch(url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    })

    const data = await causeResponse.text()
    parser.parseStringPromise(data)
    .then((res) => {
        const project1 = res["projects"]["project"][0]
        const project2 = res["projects"]["project"][1]
        const project3 = res["projects"]["project"][2]

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

        causeList = [project1Obj, project2Obj, project3Obj]
    })

    module.exports ={
        getThemeURL: getThemeURL,
        getCauses: getCauses,
        causeList
    }
}