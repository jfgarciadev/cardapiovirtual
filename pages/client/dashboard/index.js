import Head from 'next/head'
import styles from '../../../styles/clientDashbaord.module.css'
import { connectToDatabase } from "../../../util/mongodb";
import { FiAlignLeft } from "react-icons/fi";
import { withIronSession } from "next-iron-session";




export default function Home({ produtos, user }) {

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.lateralBar}></div>
      <div className={styles.content}>
        <div className={styles.topBar}>
        <h1>Hello {user.email}</h1>
        </div>
        <div className={styles.pedidos}>
          <h1>Pedidos:</h1>
          <div className={styles.pedidosScroll}>

            {produtos.map((produto) => (
              <div className={styles.pedidoCard} key={produto._id} >
                <div className={styles.produtoCardImg} style={{backgroundImage: 'url(' + produto.foto+ ')'}}>
                  
                </div>
                <div className={styles.m10}>
                  <h4>#3123</h4>
                  <p>
                    Usuário: {produto.nome}
                  </p>
                  
                </div>
                
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = withIronSession(
  async ({ req, res }) => {
    const user = req.session.get("user");
    if (!user) {
      res.statusCode = 404;
      res.end();
      return { props: {} };
    }else{
      const { db } = await connectToDatabase('mongodb+srv://jfsoftwaredev:Escalobaloba_1999@cluster0.2brja.mongodb.net/juan?retryWrites=true&w=majority', 'juan');
      const produtos = await db
        .collection("produtos")
        .find({})
        .limit(1000)
        .toArray();

        return {
          props: { 
            user,
            produtos: JSON.parse(JSON.stringify(produtos))
          }
        };

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
