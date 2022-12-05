import { LOGIN, LOGOUT, UPDATE_USERINFO, COURSE_SEL, LOAD, VIDEO_SEL } from '../actions/user.actions';

const initialState = {
    // companyName: '',
    // email: '',
    // fein: '',
    // firstName: '',
    // lastName: '',
    // password: '',
    // profileimage: '',
    // storeAddress: '',
    // storeName: '',
    // storeHours: '',
    // storePhoneNum: '',
    // userType: '',
    user_real_info:'',
    real_data: [],
    updateUpdateInfo:''
};
export default countReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                user_real_info:action.user_info
            };

        case LOAD:
            return {
                ...state,
                real_data: action.data
            }
        case UPDATE_USERINFO:
            return {
                ...state,
                user_real_info: action.updateUpdateInfo
            }
        case LOGOUT:
            return {
                ...state,
                companyName: '',
                email: '',
                fein: '',
                firstName: '',
                lastName: '',
                password: '',
                profileimage: '',
                storeAddress: '',
                storeName: '',
                storeHours: '',
                storePhoneNum: '',
                userType: '',
            };
        case COURSE_SEL:
            return {
                ...state,
                ca_key1: action.ca_key1,
                ca_key2: action.ca_key2,
                co_key1: action.co_key1,
                co_key2: action.co_key2,
            }
        case VIDEO_SEL:
            return {
                ...state,
                v_key1: action.v_key1,
                v_key2: action.v_key2,
            }
        default:
            return state;
    }
}
// export default countReducer;

export const load = (data) => async (dispatch) => {

    console.log("sdfsdf", data)

    // const payload = {data: data}
    dispatch({ type: LOAD, data });

};
export const userInfo = (user_info) => async (dispatch) => {

    console.log("sdfsdf", user_info)

    // const payload = {data: data}
    dispatch({ type: LOGIN, user_info });

};
export const updateUserInfo = (user_info) => async (dispatch) => {

    console.log("sdfsdf", user_info)

    // const payload = {data: data}
    dispatch({ type: UPDATE_USERINFO, user_info });

};