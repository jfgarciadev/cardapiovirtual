import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { connectToDatabase } from "../util/mongodb";


export default function Home({produtos}) {

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.header}>

      </div>

      {produtos.map(produto => (
        <div key={produto._id}>
          {produto.nome}
        </div>
      ))}

      <footer className={styles.footer}>
       
      </footer>
    </div>
  )
}


export async function getStaticProps() {
  const { db } = await connectToDatabase('mongodb+srv://jfsoftwaredev:Escalobaloba_1999@cluster0.2brja.mongodb.net/juan?retryWrites=true&w=majority', 'juan');
  const produtos = await db
    .collection("produtos")
    .find({})
    .limit(1000)
    .toArray();

  console.log(produtos)
  return {
    props: {
      produtos: JSON.parse(JSON.stringify(produtos)),
    },
  };
}
