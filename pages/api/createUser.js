import { connectToDatabase } from "../../util/mongodb";
const bcrypt = require('bcrypt');
const saltRounds = 10;
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async (req, res) => {
    // Next.js API route support: https://nextjs.org/docs/api-routes/introduction

    const { db } = await connectToDatabase('mongodb+srv://jfsoftwaredev:Escalobaloba_1999@cluster0.2brja.mongodb.net/juan?retryWrites=true&w=majority', 'juan');
    if (req.method === 'POST') {
        const body = req.body
        if (body) {
            if (body.email && body.pass) {
                const email = await db
                .collection("users")
                .findOne(
                    { email: body.email },
                    { email: 1}
                )
                if(!email){
                    bcrypt.hash(body.pass, saltRounds, async function (err, hash) {
                        const user = await db
                            .collection("users")
                            .insertOne({ email: body.email, pass: hash })
                    
                    });
                     res.json({msg: 'success'})
                
                }else{
                    res.json({msg: 'exists'})
                }
            }
        }
    }

}
