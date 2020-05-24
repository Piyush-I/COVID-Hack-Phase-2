'use strict';
 const axios = require('axios');
const functions = require('firebase-functions');
const {
dialogflow,
Permission,
BasicCard,Image,Button
} = require('actions-on-google');
 
const app = dialogflow();
 
app.intent('location', (conv) => {
 
conv.data.requestedPermission = 'DEVICE_PRECISE_LOCATION';
return conv.ask(new Permission({
context: 'to locate you',
permissions: conv.data.requestedPermission,
}));
 
});
app.intent('user_info', (conv, params, permissionGranted) => {
if (permissionGranted) {
const {
requestedPermission
} = conv.data;
if (requestedPermission === 'DEVICE_PRECISE_LOCATION') {
 
const {
coordinates
} = conv.device.location;
// const city=conv.device.location.city;
var str=[];
if (coordinates) {
return axios.get(`https://7653effa.ngrok.io/count?lat=${coordinates.latitude}&lng=${coordinates.longitude}`)
    .then((result) => {
  		var distance = result.data.distance;
  		var zone = result.data.containment_zone;
  		if(distance < 0.2){
        conv.ask(`Stay safe. You are in the containment zone of ${zone}`);
        }else{
        conv.ask(`The nearest containment zone is ${zone} approximately at ${distance} kilometeres from you`);}
          conv.ask(new BasicCard({
title:"N.A.I.T.R.A.",
  subtitle:"COVID Tracker",
  text:"View your neighbouring area for casuality rate and plan your emergency travels safely with the COVID Tracker",
  image: new Image({
  alt:"N.A.I.T.R.A.",
  url:"https://i.ibb.co/BGCVydt/download-1.jpg"
  }),
  buttons: new Button({
  url:"https://7653effa.ngrok.io/covidmap",
  title:"N.A.I.T.R.A."
  }),
  display:"DEFAULT"
}));
  
    });
//return conv.close(`You are at ${coordinates.latitude}`);
} else {

return conv.close('Sorry, I could not figure out where you are.');
}
 
}
} else {
return conv.close('Sorry, permission denied.');
}
});

app.intent('complain', (conv) =>{
conv.ask("Here you go");
conv.ask(new BasicCard({
title:"N.A.I.T.R.A.",
  subtitle:"Complaint Registration Page",
  text:"A webpage designed to submit your complaints by uploading images. Help us to identify the law breakers and lets curb this pandemic",
  image: new Image({
  alt:"N.A.I.T.R.A.",
  url:"https://i.ibb.co/BGCVydt/download-1.jpg"
  }),
  buttons: new Button({
  url:"https://7653effa.ngrok.io/",
  title:"N.A.I.T.R.A."
  }),
  display:"DEFAULT"
}));

});

app.intent('symptoms', (conv) =>{
conv.ask("Common symtoms are shortness of breath, cough, low grade fever. There can be other minor symptoms too. For more details check out the following link.");
conv.ask(new BasicCard({
title:"Covid 19 Symptoms",
  subtitle:"Symptoms",
  text:"Covid 19 details",
  buttons: new Button({
  url:"https://www.healthline.com/health/coronavirus-covid-19#symptoms",
  title:"N.A.I.T.R.A."
  }),
  display:"DEFAULT"
}));

});

app.intent('prevention', (conv) =>{
conv.ask("Avoid touching your face, mouth, ears, nose. Wash your hands properly with soap. Maintain 1 meter distance with people. Protect yourself using masks and protective guards. For more details check out the following link");
conv.ask(new BasicCard({
title:"Covid 19 Prevention",
  subtitle:"Prenvention Information",
  text:"Steps to protect yourself",
  buttons: new Button({
  url:"https://www.healthline.com/health/coronavirus-covid-19#prevention",
  title:"N.A.I.T.R.A."
  }),
  display:"DEFAULT"
}));

});

app.intent('corona', (conv) =>{
conv.ask("Corona Virus is a virus originated from food markets of Wuhan, China. It has been responsible for millions of infection globally. For more details check out the following link.");
conv.ask(new BasicCard({
title:"Covid 19 Information",
  subtitle:"Important Information",
  text:"Covid 19 details",
  buttons: new Button({
  url:"https://www.healthline.com/health/coronavirus-covid-19",
  title:"N.A.I.T.R.A."
  }),
  display:"DEFAULT"
}));

});

//app.intent('complain', (conv) => {
//  conv.ask(`https://www.google.com`);
//});
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);