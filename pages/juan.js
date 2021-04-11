import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { connectToDatabase } from "../util/mongodb";
import { FiAlignLeft } from "react-icons/fi";



export default function Home({ produtos, children })   {

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className={styles.bgBar}>

      </div>
      <FiAlignLeft className={styles.menuIcon}></FiAlignLeft>


      <h1 className={styles.title}>Pizzas</h1>
      <ul className={styles.grid}>
      
        {produtos.map(produto => (
          <li className={styles.card} key={produto._id}>
            <img src={produto.foto} width={'100%'} title={produto.nome}></img>
            <p>{produto.nome}</p>
            
          </li>
        ))}
      </ul>

      <footer className={styles.footer}>

      </footer>
      <div className={styles.header}>

      </div>
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
