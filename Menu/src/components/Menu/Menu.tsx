import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getMenu } from "../../redux/menu.slice";
import { useEffect, useState } from "react";
import "./Menu.css";
import { delData, postOrders, setData } from "../../redux/cart.slice";
import { Loader } from "../Loader/Loader";

export const Menu = () => {
    const { data, loading, error } = useSelector((store: RootState) => store.menu)
    const { dataCart, delivery, total, loadingCart, errorCart } = useSelector((store: RootState) => store.cart)
    const dispatch = useDispatch();

    const [element, setElement] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [mobile, setMobile] = useState<number>();

    useEffect(() => {
        dispatch(getMenu())
    }, []);

    const onAddCart = (index: number, name: string, price: number) => {
        dispatch(setData({ index, name, price }));
    }

    const onDeleteItem = (name: string) => {
        dispatch(delData({ name }));
    }

    const modal = () => {
        setElement(!element);
    }

    const order = () => {
        if (name !== "" && address !== "" && mobile !== 0) {
            const newData = dataCart?.map(item => {
                const { price, index, ...rest } = item;
                return rest;
            });

            newData?.push({ "Name": name, "Address": address, "mobile": mobile })
            dispatch(postOrders(newData));
        }
        setAddress("");
        setName("");
        setMobile(+7);
        setElement(!element);
    }

    return (
        <>
            <div className="header">Online заказ еды</div>
            <div>{loading ? <Loader /> : null}</div>
            <div>{loadingCart ? <Loader /> : null}</div>
            {error ? <div className="error">Error network</div> : null}
            {errorCart ? <div className="error">Error network</div> : null}
            <div className="main">
                <div className="dishes">
                    {data.map((item, index) => (<div key={index} className="dish"> <div><img src={item.image} alt="" /></div> <div><div>Название: {item.name}</div><div>Цена: {item.price} тг</div></div> <button className="addToCart" onClick={() => onAddCart(index, item.name, item.price)}></button> </div>))}
                </div>
                <div className="cart">
                    <div className="cartHead"> <h2>Корзина</h2> </div>
                    {dataCart ? dataCart.map((item, index) => (<div key={index} className="cartItem"> <div>{item.name} x {item.count}</div> <div>{item.price} тг</div> <button className="delete" onClick={() => onDeleteItem(item.name)}></button></div>)) : null}
                    {dataCart?.[0] ? <div><div>Доставка: {delivery} тг</div> <div>Итого: {total} тг</div> </div> : null}
                    {dataCart?.[0] ? <button className="btnOrder" onClick={modal}>Заказать</button> : null}
                </div>
            </div>

            <div className="modal" style={element ? { display: "block" } : { display: "none" }}>
                <h3>Заполните пожалуйста форму</h3>
                <label htmlFor="name">Имя:</label><br />
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Введите имя" /> <br />
                <label htmlFor="address">Адрес:</label><br />
                <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Введите адрес" /><br />
                <label htmlFor="mobile">Номер:</label><br />
                <input type="number" id="mobile" value={mobile} onChange={(e) => setMobile(parseInt(e.target.value))} placeholder="Введите номер" /><br />
                <button onClick={order}>Отправить</button>
                <button onClick={modal}>Закрыть</button>
            </div>
        </>
    )
}