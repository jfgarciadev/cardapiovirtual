import { withIronSession } from "next-iron-session";
const bcrypt = require('bcrypt');
import { connectToDatabase } from "../../util/mongodb";

export default withIronSession(
  async (req, res) => {
    const { db } = await connectToDatabase('mongodb+srv:', 'juan');

    if (req.method === "POST") {
      const { email, pass } = req.body;

      const user = await db
        .collection("users")
        .findOne(
          { email: email },
          { email: 1, pass: 1 }
        )
        
        console.log({pass, user})
        if(user && pass){
          await bcrypt.compare(pass, user.pass ,async function(err, success) {
            console.log({err, success})
            if (err){
              return res.json({success: false, message: 'email or passwords do not match' });
            }
            if (success){
              if (email === user.email) {
                req.session.set("user", { email });
                await req.session.save();
                return res.status(201).send("");
              }
            }else {
              return res.json({success: false, message: 'email or passwords do not match'});
            }
          });

        }
    }else{
      return res.status(404).send("");
    }
  },
  {
    cookieName: "CARDACOOKIE",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false
    },
    password: process.env.APPLICATION_SECRET
  }
);
