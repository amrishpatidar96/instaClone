export const initialState = null;


export const reducer  = (state ,action)=>{
    if(action.type==="USER"){
        return action.payload
    }
    else if(action.type==="CLEAR"){
        return action.payload
    }
    else if(action.type==="UPDATE"){
        return {
            ...state,
            followers:action.payload.followers,
            following:action.payload.following,
            pic:action.payload.pic,
        }
    }
    return state;
}