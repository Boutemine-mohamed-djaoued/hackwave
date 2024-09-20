import express from "express";
import  twilio  from "twilio";

const router = express.Router();
const accountSid = "ACc0c1763d1d6c9b2df8d6777b8b966f8c";

const authToken = "29310ad07666b630804da3265c82536c";

const client = twilio(accountSid, authToken);



let agents = [
    { id: 1, name: 'Agent A', available: true, activeCalls: 0, maxCalls: 1, skills: ['billing'] },
    { id: 2, name: 'Agent B', available: true, activeCalls: 0, maxCalls: 1, skills: ['technical'] },
];


router.get("/make-call",async(req,res)=> {
    const call = await client.calls.create({

        from: "+18305212180",
    
        to: "+213774848344",
    
        url: "http://demo.twilio.com/docs/voice.xml",
    
      });
    
    
      console.log(call.sid);
    
})

export default router;