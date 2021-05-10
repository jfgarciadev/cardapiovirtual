import Head from 'next/head'
import styles from '../../../styles/Home.module.css'
import { connectToDatabase } from "../../../util/mongodb";
import { AiOutlineWhatsApp } from "react-icons/ai";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';




export default function Home({ produtos, userAgent }) {
    const [modalEndereco, setModalEndereco] = useState(false)
    const [modalPedido, setModalPedido] = useState(true)
    const [preco, setPreco] = useState(0)
    const router = useRouter();

    useEffect(() => {
        const cart = localStorage.getItem('cart');
        if (!cart) {
            localStorage.setItem('cart', "[]")
        }
        let valor = 0
        const cartParsed = JSON.parse(localStorage.getItem('cart'))
        cartParsed.map(item => {
            valor = valor + item.valor
        })

        setPreco(valor)

    }, [])

    const finalizarPedido = (nome, endereco, whatsapp, metodo) => {
        const line = "-------------------------------------------------"
        let message = line+"%0ANovo%20Pedido%0A"+ line + "%0ANome:" + nome + "%0aTelefone:" + whatsapp +"%0aEndereço:" + endereco + "%0aMetodo:" + metodo + "%0A" + line
        const cart = JSON.parse(localStorage.getItem('cart'))
        cart.map((item, key) => {
            message += "%0A"                   
            message += "%0A" + "ITEM%20%20:"   + key 
            message += "%0A" + "NOME%20:"      + item.produto.nome
            message += "%0A" + "OBS%20%20%20:" + (item.obs ? item.obs : "Sem observação")
            message += "%0A" + "VALOR:%20R$%20"+ item.valor
            message += "%0A"                   + line
            })
        message += "%0ATOTAL:%20R$" + preco
        const formated = encodeURIComponent(message).replace(/[!'()]/g, escape).replace(/\*/g, "%2A")
        
        window.location.href = "whatsapp://send?phone=5516988082472&text=" + message
    }
        

    const removerItem = (key) => {

        const cart = JSON.parse(localStorage.getItem('cart'))
        cart.splice(key, 1)
        console.log(cart)
        localStorage.setItem('cart', JSON.stringify(cart))
        router.replace(router.asPath);
    }


    return (
        <div className={styles.container}>
            <Head>
                <title>{ }</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.header}>
                <div className={styles.content}>
                    <img src="/logo.jpg" className={styles.logo}></img>
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

                <a href="/cardapio" className={styles.cancelarBtn}>INICIO </a>
                <a className={styles.addBtn}>CARRINHO ({typeof window == 'undefined' ? null : JSON.parse(localStorage.getItem('cart')).length + ")"}</a>
            </div>

            <div className={styles.cardapioMain}>

                <div className={styles.produtos}>

                    <div className={styles.categoria}>

                        <ul>
                            {typeof window == 'undefined' ? null : JSON.parse(localStorage.getItem('cart')).map((item, key) => (

                                < ><li key={key}>

                                    <div className={styles.produtoDescricao}>
                                        <h4>{"( " + item.quantidade + "x )" + " | " + item.produto.nome} <span>R$ {item.produto.valor}</span></h4>
                                        <span>{item.obs ? item.obs : 'Sem observação'}</span>
                                        <div onClick={() => {
                                            removerItem(key);
                                        }} className={styles.cartremover}>REMOVER</div>
                                    </div>
                                    <img src={item.produto.foto} className={styles.produtoImg}></img>

                                </li>
                                    <li><hr className={styles.divisor}></hr></li>
                                </>
                            ))}
                            <li><h4>TOTAL <span> : R$ {preco}</span></h4></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className={styles.menuBar}>
                <a className={styles.addBtn} onClick={() => { setModalPedido(true)}}>Finalizar pedido</a>
            </div>
            <hr className={styles.divisor}></hr>

            {modalPedido &&
                <div className={styles.modalBack}>
                    <div className={styles.modalMain}>

                        <label htmlFor="name">Nome</label>
                        <input id="name" type="text" autocomplete="name" required />
                        <br />
                        <label htmlFor="whatsapp">whatsapp</label>
                        <input id="whatsapp" type="tel" autocomplete="tel" required />
                        <br />
                        <label htmlFor="metodo">Entrega</label>
                        <select name="metodo" id="metodo">
                            <option value="retirada">retirada no restaurante</option>
                            <option value="entrega">entrega em seu endereço</option>

                        </select>


                        <div className={styles.row}>
                            <div className={styles.cancelarBtn} onClick={() => { setModalPedido(false) }}>Cancelar</div>
                            <div className={styles.addBtn} onClick={() => {
                                const nome = document.getElementById("name").value
                                const whatsapp = document.getElementById("whatsapp").value
                                const metodo = document.getElementById("metodo").value
                                const endereco = "endereco teste"
                                finalizarPedido(nome, endereco, whatsapp, metodo)

                            }}>FINALIZAR</div>
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
