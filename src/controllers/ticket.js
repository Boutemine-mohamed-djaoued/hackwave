import  twilio  from "twilio";
import Ticket from "../models/ticket.js";
import TicketQueue from "../models/ticketQueue.js";
import { Agent, Client } from "../models/user.js";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);


export default {
  createTicket: async (req, res) => {
    try {
      // Find the client
    //   if (!req.isAuthenticated() && !(req.user.clientId === req.body.clientId)) res.status(401).json("Unauthenticated")
      const { clientId, priority, info } = req.body;

      const client = await Client.findById(clientId);
      if (!client) {
        throw new Error("Client not found");
      }

      // Find an available agent
      const availableAgent = await Agent.findOne({ onCall: null });
      if (!availableAgent) {
        const newTicket = new Ticket({
          client: client._id,
          state: "new",
          info,
          priority,
        });

        await newTicket.save();

        const queuedTicket = new TicketQueue({ ticket: newTicket._id });
        await queuedTicket.save();

        console.log("No agents available, ticket queued:", newTicket._id);
        res
          .status(200)
          .json("No agents available, ticket queued:" );
        return;
      }

      // Create a new ticket
      const newTicket = new Ticket({
        client: client._id,
        agent: availableAgent._id,
        state: "open",
        info,
        priority,
      });

      // Save the ticket
      await newTicket.save();

      // Assign ticket to the agent and update the agent status
      availableAgent.activeTicket = newTicket._id;
      availableAgent.onCall = client._id;
      await availableAgent.save();

      console.log(newTicket._id)
      global.io.emit("ticketAssigned", {
        ticket: newTicket,
        client: client,
        priority,
        info,
      });

      // const call = await twilioClient.calls.create(
      //   {

      //     from: "+18305212180",
      
      //     to: "+213774848344",
      
      //     url: "http://demo.twilio.com/docs/voice.xml",
      
      //   }
      // )
      // console.log(call.sid)
      
      res
        .status(200)
        .json(
          "Ticket created and assigned to agent:" + availableAgent.username
        );
    } catch (err) {
      console.log(err)
      res.status(500).json("Error creating ticket:" + err);
    }
  },
  closeTicket: async (req, res) => {
    try {
      const { ticketId } = req.body;

      const ticket = await Ticket.findById(ticketId).populate("agent");

      if (ticket) {
        const agent = await Agent.findById(ticket.agent);
        agent.onCall = null;
        agent.activeTicket = null;
        ticket.state = "closed"
        await agent.save();
        await ticket.save();

        // get next ticket

        const nextTicketInQueue =  (await TicketQueue.find()
          .populate("ticket")
          .sort({ "ticket.priority": 1, createdAt: 1 }))[0];

        console.log(nextTicketInQueue)

        if (nextTicketInQueue) {
          const ticket = await Ticket.findById(nextTicketInQueue.ticket._id).populate("client");

          // Assign the ticket to the available agent
          await Agent.findByIdAndUpdate(agent._id, { onCall: ticket.client,activeTicket:ticket._id });

          ticket.agent = agent._id;
          ticket.state = 'open';
          await ticket.save();

          // Remove ticket from the queue
          await TicketQueue.findByIdAndDelete(nextTicketInQueue._id);
          
          global.io.emit("ticketAssigned", {
            ticket: ticket,
            client: ticket.client,
            priority : ticket.priority,
            info : ticket.info,
          });

          res.status(201).json(`Assigned ticket ${ticket._id} (Priority: ${ticket.priority}) to agent ${agent._id}`);
          return
        }

        res.status(200).json("Ticket closed")
      } else {
        res.status(400).json("Ticket doesn't exist");
      }
    } catch (err) {
      res.status(500).json("Error closing ticket:" + err);
    }
  },
  getTicket:async (req,res) => {
    try {

    }catch(err) {
      res.status(500).json()
    }
  }
};
