import Transaction from "../models/transaction.js";

export default {
  getTransactions: async (req, res) => {
    try{
    const { phone } = req.query;
    if (req.isAuthenticated()) {
        if (phone = req.user.phoneNumber) {
          
        }
    }
    } catch(err) {

    }
  },
};
