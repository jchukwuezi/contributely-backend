//this file will be used to get information from the just giving api to get information of different fundraisers
const xml2js = require('xml2js')
const nodefetch = require('node-fetch')
const API_KEY = process.env.GG_API_KEY;

//function to create the url that a get request will be sent to for a specific theme
const getThemeUrl = (theme) => {
    return 'https://api.globalgiving.org/api/public/projectservice/themes/' + theme + API_KEY;
} 

getThemeUrl('climate')