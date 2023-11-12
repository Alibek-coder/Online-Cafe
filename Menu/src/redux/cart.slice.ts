import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface ICart {
    dataCart?: [
        {
            index: number;
            name: string;
            price: number;
            count: number;
        }
    ];
    delivery: number;
    total: number;
    loadingCart: boolean;
    errorCart: Error | null
}

const initialState: ICart = {
    dataCart: [],
    delivery: 500,
    total: 0,
    loadingCart: false,
    errorCart: null
}

export const postOrders = createAsyncThunk(
    'post/orders',
    async (data) => {
        const url = 'https://menu-6a963-default-rtdb.europe-west1.firebasedatabase.app/orders.json';
        const result = await axios.post(url, data);
        return result.data
    }
)

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setData: (state, action) => {
            const { name, price } = action.payload;
            const findName = state.dataCart.find(item => item.name === name);
            if (findName) {
                findName.count += 1;
                findName.price = price * findName.count;
            } else {
                state.dataCart.push(action.payload)
                action.payload.count = 1;
                action.payload.price = price
            }
            const summa: number[] = state.dataCart?.map((item) => (item.price));
            let total = 0;
            for (let i = 0; i < summa.length; i++) {
                total += parseInt(summa[i]);
                state.total = total + state.delivery;
            }
        },
        delData: (state, action) => {
            const { name } = action.payload;
            state.dataCart = state.dataCart.filter(item => item.name !== name);
            const summa: number[] = state.dataCart?.map((item) => (item.price));
            let total = 0;
            for (let i = 0; i < summa.length; i++) {
                total += parseInt(summa[i]);
                state.total = total + state.delivery;
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase(postOrders.fulfilled, (state) => {
                state.loadingCart = false;
            })
            .addCase(postOrders.pending, (state) => {
                state.loadingCart = true;
                state.errorCart = null;
            })
            .addCase(postOrders.rejected, (state, action) => {
                state.errorCart = action.error as Error;
                state.loadingCart = false;
            })
    }
})

export const { setData, delData } = cartSlice.actions