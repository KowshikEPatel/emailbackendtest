require('dotenv').config()
const nodemailer = require('nodemailer')
const express = require('express')
const {google}  = require('googleapis')

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const REFRESH_TOKEN = process.env.REFRESH_TOKEN

const oAuthClient = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI)
oAuthClient.setCredentials({refresh_token:REFRESH_TOKEN})
const port = process.env.PORT||8000
const app = express()
app.use(express.json())

app.get('/',(req,response)=>{
    
    
    async function sendMail(toemail){
        try {
            const accessToken = await oAuthClient.getAccessToken()
    
            const transport  = nodemailer.createTransport({
                service:'gmail',
                auth:{
                    type:'OAuth2',
                    user:'kowshikerappajipatel@gmail.com',
                    clientId:CLIENT_ID,
                    clientSecret:CLIENT_SECRET,
                    refreshToken:REFRESH_TOKEN,
                    accessToken:accessToken
                }
               
            })
            const mailOptions = {
                from:'<kowshikerappajipatel@gmail.com>',
                to:toemail,
                subject:'Hello from gmail using API',
                text:'Hello from gmail using API',
                html:'<h1>Hello from gmail using API. So we are good to go</h1>'
    
            }
    
            const result  = await transport.sendMail(mailOptions)
    
            return result
    
        } catch (error) {
            console.log(error)
        }
    }

    sendMail('kowshiksepatel@gmail.com')
    .then(res =>{
        console.log('Email sent....',res)
        response.status(200).json({res})
    })
    .catch(err => {
        console.log(err)
        response.status(500).json({err})
    })

})


app.listen(port,()=>{console.log('server started with port ',port)} )