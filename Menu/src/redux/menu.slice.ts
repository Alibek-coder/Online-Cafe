import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface IMenu {
    data: [
        {
            name: string;
            price: number;
            image: string;            
        }
    ];
    loading: boolean;
    error: Error | null
}

const initialState: IMenu = {
    data: [
        {  
            name: "",
            price: 0,
            image: ""            
        }
    ],
    loading: false,
    error: null
}

export const getMenu = createAsyncThunk(
    'get/menu',
    async () => {
        const url = 'https://menu-6a963-default-rtdb.europe-west1.firebasedatabase.app/menu.json';
        const result:IMenu = await axios.get(url);        
        return result.data
    }
)

export const menuSlice = createSlice({
    name: "menu",
    initialState,
    reducers: {

    },
    extraReducers: builder => {
        builder
            .addCase(getMenu.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false
            })
            .addCase(getMenu.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMenu.rejected, (state, action) => {
                state.error = action.error as Error;
                state.loading = false;
            })
    }
})