import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import { connectToDatabase } from "../../util/mongodb";
import { AiOutlineWhatsApp } from "react-icons/ai";
import { useEffect, useState } from 'react';



export default function Home({ categorias, produtos }) {
  const [modalEndereco, setModalEndereco] = useState(false)
  const [modalProduto, setModalProduto] = useState(false)

  useEffect(() => {
    const cart = localStorage.getItem('cart');
    if (!cart) {
      localStorage.setItem('cart', "[]")
    }
  }, [])

  const loadProductModal = (_id) => {
    const prod = produtos.filter((produto) => { return produto._id == _id })
    if (prod.length > 0) {
      setModalProduto(prod[0])
    }
  }

  const addToCart = (produto, obs) => {
    
    const cart = JSON.parse(localStorage.getItem('cart'))
    
    cart.push({produto, obs, quantidade : 1, valor: produto.valor})
    console.log(cart)
    localStorage.setItem('cart', JSON.stringify(cart))
    setModalProduto(false)

  }


  return (
    <div className={styles.container}>
      <Head>
        <title>{ }</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.header}>
        <div className={styles.content}>
          <img src="logo.jpg" className={styles.logo}></img>
          <div className={styles.info}>
            <ul>
              <li>
                <ul>
                  <li>
                    <a href="#">
                      <span><strong>Contato:</strong></span>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <AiOutlineWhatsApp fontSize="17px" color="#34af23" />
                      <span>(16) 98808-2472</span>
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <ul>
                  <li>
                    <a href="#">
                      <span><strong>Endereço:</strong></span>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <AiOutlineWhatsApp fontSize="17px" color="#34af23" />
                      <span>(16) 98808-2472</span>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.menuBar}>

        <a className={styles.addBtn}>INICIO</a>
        <a href="/cardapio/carrinho"  className={styles.cancelarBtn}>CARRINHO ({ typeof window == 'undefined' ? null : JSON.parse(localStorage.getItem('cart')).length + ")" }</a>
      </div>

      <div className={styles.cardapioMain}>
        <div className={styles.lateralBar}>
          <ul>
            {categorias.map(cat => (
              <li>
                <a href={"#" + cat.nome}>{cat.nome} ({cat.produtos.length})</a>
                <hr className={styles.divisor} />
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.produtos}>
          {categorias.map(cat => (
            <div className={styles.categoria}>

              <h3 id={"" + cat.nome}>{cat.nome}</h3>
              <hr className={styles.divisor}></hr>
              <ul>
                {cat.produtos.map(produto => (
                  <><li onClick={() => {
                    loadProductModal(produto._id)
                  }}>

                    <div className={styles.produtoDescricao}>
                      <h4>{produto.nome} <span>R$ {produto.valor}</span></h4>
                      <span>{produto.descricao}</span>
                    </div>
                    <img src={produto.foto} className={styles.produtoImg}></img>

                  </li>
                    <li><hr className={styles.divisor}></hr></li>
                  </>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {modalProduto &&
        <div className={styles.modalBack}>
          <div className={styles.modalMain}>
            <h1>{modalProduto.nome}</h1>
            <hr className={styles.divisor}></hr>
            <img src={modalProduto.foto}></img>
            <hr className={styles.divisor}></hr>
            <h1>R$ {modalProduto.valor}</h1>
            <hr className={styles.divisor}></hr>
            <p>{modalProduto.descricao}</p>
            <hr className={styles.divisor}></hr>
            <p>opicionais: em construção!</p>
            <hr className={styles.divisor}></hr>
            <p>Obseverações:</p>
            <textarea id="textobs" onChange={e => console.log(e.target.value)}></textarea>
            <hr></hr>
            <div className={styles.row}>
              <div className={styles.cancelarBtn} onClick={() => { setModalProduto(false) }}>Cancelar</div>
              <div className={styles.addBtn} onClick={() => {
                addToCart(modalProduto, document.getElementById("textobs").value)
              }}>Adicionar</div>
            </div>

          </div>
        </div>

      }

    </div>
  )
}


export async function getStaticProps() {
  const { db } = await connectToDatabase(process.env.MONGODB_URI, 'juan');
  const produtos = await db
    .collection("produtos")
    .find({})
    .limit(1000)
    .toArray();

  const categorias = await db.collection("cat").aggregate([
    { $lookup: { from: "produtos", localField: "cat_id", foreignField: "cat_id", as: "produtos" } }
  ]).toArray()


  return {
    props: {
      categorias: JSON.parse(JSON.stringify(categorias)),
      produtos: JSON.parse(JSON.stringify(produtos)),
    },
  };
}
