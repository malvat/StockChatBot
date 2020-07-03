require('dotenv').config();
const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');
const stockInfo = require('stock-info');
const session = require('express-session');

/**
 * create an instance of watson assistant
 */
const assistant = new AssistantV2({
  version: process.env.WATSON_VERSION,
  authenticator: new IamAuthenticator({
    apikey: process.env.WATSON_API_KEY,
  }),
  url: process.env.WATSON_URL,
  disableSslVerification: true,
});

/**
 * sends input to watson and receives a response
 * @param {JSON} req request object 
 * @param {JSON} res response object
 */
function message(req, res) {
    // requesting cookies using express session
    var session = req.session;
    var input = req.body.input;
    var get_session_id;
    if(!input) {
        res.send({
            "error": "1",
            "errorText": "No, input provided"
        })
        return;
    }
    
    // checking if we already have a session id or not
    if(session.session_id) {   
        // if we do, we just need to send the message directly
        get_session_id = new Promise(function(resolve, reject) {
            resolve(session.session_id);
        });
    } else {
        // if we do not, we need to established a connection to watson and generate a session id
        get_session_id = createSession().then((session_id) => {
            session.session_id = session_id;
            console.log(session_id);
            return session_id;
        })
    }
    // setting up default price 
    var stock_price = -1;

    if(session.stock_price != undefined) {
        stock_price = session.stock_price;
    } 

    // if we have gotten the session we can send a request to watson
    get_session_id.then(session_id=>{
        sendRequest(input, session_id, stock_price)
            .then(output=>{
                req.session.stock_price = output.stock_price;
                res.send({
                    "error": 0,
                    "errorText": "None",
                    "sessionId": session_id,
                    "output": output.text,
                })
            })
    });
}

/**
 * returns session id from the watson assistant
 */
async function createSession() {
    try {
        const result = await assistant.createSession({
            assistantId: process.env.WATSON_ASSISTANT_ID
        });
        // console.log(result);
        return result.result.session_id;
    }
    catch (err) {
        console.log("Error: could not create a session");
    }
}

/**
 * returns the response of watson
 */
async function sendRequest(input, session_id, stock_price){
    // sends the message
    return assistant.message({
        assistantId: process.env.WATSON_ASSISTANT_ID,
        sessionId: session_id,
        input: {
            'message_type': 'text',
            'text': input,
            'options': {
                'return_context': true,
            },
        },
        context:{
            skills: {
                'main skill': {
                    'user_defined': {
                        'stock_price': stock_price,
                    }
                }
            }
        },
    }).then(async res => {
        //console.log(res.result.context.skills);
        console.log(res.result.output.generic);
        var outputGeneric = res.result.output.generic;
        var user_defined = res.result.context.skills["main skill"].user_defined;
        let stock_price = -1;
        if(user_defined != undefined) {
            if(user_defined.stock_name != undefined) {
                var stock_data = await getStockPrice(user_defined.stock_name);
                stock_price = stock_data.regularMarketPrice;
                console.log(stock_price);
            }
        }
        
        var output = {"stock_price": stock_price};
        output["text"] = "";
        for(var i = 0; i < outputGeneric.length; i++) {
            output["text"] += outputGeneric[i].text + "\n";
        }
        if(user_defined != undefined) {
            if(user_defined.show_data != undefined && user_defined.show_data == true) {
                console.log("show some data over here: : : ", session_id);
                if(stock_price != -1) {
                    output["text"] += stock_price;
                } else {
                    output["text"] += "Sorry, I could not find any stocks with such a name.";
                }
                await sendRequest("yes", session_id, stock_price);
            }
        }
        return output;
    }).catch(err => {
        console.log("Error: could not receive any response from watson", err);
        return -1;
    })
}

/**
 * fetches the current stock information for the provided ticker
 * @param {string} ticker symbole name of the stock 
 */
function getStockPrice(ticker) {
    return stockInfo.getSingleStockInfo(ticker).then(result => {
        return result;
    }).catch(err => {
        return -1;
    })
}

module.exports.message = message;