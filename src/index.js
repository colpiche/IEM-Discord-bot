const Constants = require('./constants')

// Run dotenv
require('dotenv').config()

// Import libraries
const Discord = require('discord.js')
const client = new Discord.Client()
const jsdom = require("jsdom")
const { JSDOM } = jsdom

// Event listener when a user connected to the server.
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

// Event listener when a user sends a message in the chat.
client.on('message', msg => {

    console.log(`New message : ${msg.content}`)

    // We check the message content and looks for the word "ping", so we can have the bot respond "pong"
    if (msg.channel.id === process.env.CHANNEL_ID && msg.content === 'update') {
        sendPlanning(msg)
    }

})

// Initialize bot by connecting to the server
client.login(process.env.DISCORD_TOKEN)


async function sendPlanning(msg) {
    fetch(process.env.CALENDAR_URL)
        .then(function (response) {
            return response.text()
        })
        .then(function (html) {
            const dom = new JSDOM(html)
            const planningTable = extractPlanningTable(dom)
            const message = formatMessage(planningTable)
            msg.channel.send(message)
        })
        .catch(function (error) {
            console.log(`error : ${error}`)
        })
}


function extractPlanningTable(dom) {
    const planningTable = dom.window.document.getElementsByClassName('PlanningEvtContainer').item(0)
    return planningTable
}


function formatMessage(planningTable) {
    let message = []
    const spans = planningTable.querySelectorAll('span, a')

    spans.forEach(span => {
        const spanId = span.id.split('_')
        const spanType = spanId[spanId.length - 1]

        const msgLastValueIndex = message.length - 1
        const msgLastValue = message[msgLastValueIndex]
        let textContent = span.textContent

        switch (spanType) {
            case 'lblDay':
                // Jour
                if (message.length != 0) {message.push('')}
                message.push(textContent.toUpperCase())
                break
            case 'lblEvtRange':
                // Heure
                message.push(textContent)
                break
            case 'lblEvtType':
                // Type
                break
            case 'lblEvtSalle':
                // Salle
                textContent = textContent.split(' - ')[0]
                message[msgLastValueIndex] = msgLastValue.concat(' - ' + textContent)
                break
            case 'lblEvtUE':
                // UE
                const course = Constants.courses.find((obj) => obj.code == textContent)
                textContent = course.name
            default:
                message[msgLastValueIndex] = msgLastValue.concat(' ' + textContent)
                break
        }
    })

    return message
}


