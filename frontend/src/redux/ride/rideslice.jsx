import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    id:null,

}



const rideSlice = createSlice({
    name: 'ride',
    initialState,
    reducers:{
        setRideData(state,action){
            state.id = action.payload.id;
        },

        clearRideData(state) {
            state.id = null
        },
    },
});


export const {setRideData,clearRideData} = rideSlice.actions;
export default rideSlice.reducer;

