const express = require("express");
const morgan = require("morgan");

const app = express();  //Create new instance
///WATSON API
var ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

var config = require('./config');
const { reset } = require("nodemon");
const PORT = process.env.PORT || 5000; //Declare the port number

app.use(express.json());    //allows us to access request body as req.body
app.use(morgan("dev"));     //enable incoming request logging in dev mode
app.use("/static", express.static(__dirname + "/static"));



//Routes

app.get("/", (req, res) => {
    return res.sendFile('templates/index.html', {root: __dirname});
});

app.get("/ping", (req, res) => {   //Define the endpoint

  return res.send({
    status: "Healthy",
  });

});

app.get("/analyze/:text", (req, res) => {
  console.log(req.params.text.toLowerCase());
  const toneParams = {
    toneInput: { 'text': req.params.text.toLowerCase() },
    contentType: 'application/json',
    url: "https://api.us-south.tone-analyzer.watson.cloud.ibm.com/instances/c3c5eca2-35e0-493a-8fea-8e788e8fbd9c"
  };
  const toneAnalyzer = new ToneAnalyzerV3({
    version: '2017-09-21',
    authenticator: new IamAuthenticator({
      apikey: "XA7yubZlsAMGhGZ25X0h0yrp3WND6EuRVC_cYWxz5aR9",
    }),
    serviceUrl: "https://api.us-south.tone-analyzer.watson.cloud.ibm.com/instances/c3c5eca2-35e0-493a-8fea-8e788e8fbd9c",
    disableSslVerification: true,
  });
  
  toneAnalyzer.tone(toneParams)
  .then(toneAnalysis => {
    res.send(toneAnalysis.result.document_tone);
  })
  .catch(err => {
    console.log('error:', err);
  });

})

app.listen(PORT, () => {
  console.log("Server started listening on port : ", PORT);
});
