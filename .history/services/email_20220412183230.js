const nodemailer = require('nodemailer')
const schedule = require('node-schedule')

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.CONTRIBUTELY_EMAIL,
        pass: process.env.CONTRIBUTELY_PASSWORD
    }
})

/*
export const createEndingMail = (mailingList, initiativeTitle, groupName, closingBalance) =>{
    
}
*/
const sendList = ['jchukwuezi@gmail.com', 'c18709101@mytudublin.ie']
const messageIncrement = []

export const triggerEmail = () =>{

}

//function using a CRON job that will schedule an email to be sent every 10 seconds
const setEmailDelays = () =>{
    const emailJob = schedule.scheduleJob('*/10 * * * * *', ()=>{
        triggerEmail(sendList[messageIncrement]);
        if(messageIncrement < sendList.length){
            messageIncrement++
        }

        if(messageIncrement >= sendList.length){
            emailJob.cancel()
        }

    })
}