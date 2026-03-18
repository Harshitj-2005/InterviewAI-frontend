import { createContext, useState } from "react";

export const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {

    const [loading, setloading] = useState(false);
    const [fetching, setfetching] = useState(false);
    const [report, setreport] = useState(null);
    const [reports, setreports] = useState([]);

    return (
        <InterviewContext.Provider value={{ loading, setloading, report, setreport, reports, setreports, fetching, setfetching }}>
            {children}
        </InterviewContext.Provider>
    )
}