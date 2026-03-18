import { createContext, useState } from "react"
import { useEffect } from "react";
import { getme } from "./services/api.auth";

export const Authcontext = createContext();

export const Authprovider = ({ children }) => {
    const [user, setuser] = useState(null)
    const [loading, setloading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getme();
                setuser(data.user);
            } catch (error) {
                setuser(null);
            } finally {
                setloading(false);
            }
        };
        fetchUser();
    }, [])


    return (
        <Authcontext.Provider value={{ user, setuser, loading, setloading }}>
            {children}
        </Authcontext.Provider>
    )
}

