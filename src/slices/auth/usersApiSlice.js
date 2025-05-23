import { apiSlice } from '../apiSlice';
import BASE_URL from '../../components/routes/serverRoutes';
const USER_URL = `${BASE_URL}/api/v1/auth`;
export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: `${USER_URL}/login`,
                method: "POST",
                body: {...credentials}
            })
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/register`,
                method: "POST",
                body: data
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USER_URL}/logout`,
                method: "POST",
            })
        }),
        updateUser: builder.mutation({
            query: (data) => ({
            url: `${USER_URL}/profile`,
            method: "PUT",
            body: data,
        })
        }),
        getUsers: builder.mutation
    })
})

export const { useGetEmailCodeMutation, useVerifyEmailCodeMutation, useLoginMutation, useLogoutMutation, 
    useRegisterMutation, useUpdateUserMutation} = usersApiSlice;