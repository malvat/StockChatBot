require('dotenv').config();
const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');
const stockInfo = require('stock-info');

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

    get_session_id.then(session_id=>{
        sendRequest(input, session_id)
            .then(output=>{
                res.send({
                    "error": 0,
                    "errorText": "None",
                    "sessionId": session_id,
                    "output": output,
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
        console.log(result);
        return result.result.session_id;
    }
    catch (err) {
        console.log("Error: could not create a session");
    }
}

/**
 * returns the response of watson
 */
async function sendRequest(input, session_id){
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
                        'stock_price': "12",
                    }
                }
            }
        },
    }).then(res => {
        //console.log(res.result.context.skills);
        return res.result.output.generic[0].text;
    }).catch(err => {
        console.log("Error: could not receive any response from watson");
        return -1;
    })
}

function getStockInfo(req, res) {
    stockInfo.getSingleStockInfo("goog").then(result=>{
        console.log(result);
        res.send(result)
    })
}

module.exports.message = message;
module.exports.getStockInfo = getStockInfo;