import React, { useEffect, useState, createContext, useContext } from "react";
import ApiModel from "../API/ApiModel";
import {auth} from "../Model/Auth";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userDetail, setUserDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const apiModel = new ApiModel();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                if (user ) {

                    console.log(user)
                    if(user.displayName){

                        setUser(user);
                        const data = { docId: user.uid, displayName: user.displayName };
                        const response = await apiModel.PostMethod(data, "RegistrationRead");
                        if (response?.data?.length > 0) {
                            setUserDetail(response.data[0]);
                        }

                    }



                } else {
                    setUser(null);
                    setUserDetail(null);
                }
            } catch (err) {
                console.error("Auth Error:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, userDetail,setUserDetail, isLoading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);
