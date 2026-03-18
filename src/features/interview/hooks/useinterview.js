import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setloading, report, setreport, reports, setreports } = context

    const generateReport = async ({ resume, jobDescription, selfDescription }) => {
        setloading(true)
        let response = null
        try {
            response = await generateInterviewReport({ resume, jobDescription, selfDescription })
            setreport(response.interviewReport)
        } catch (error) {
            console.log(error)
        } finally {
            setloading(false)
        }
        return response?.interviewReport
    }

    const getReportById = async (interviewId) => {
        // setfetching(true);
        setloading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setreport(response.interviewReport)
        } catch (error) {
            console.error("Error fetching interview report:", error);
            if (error.response?.status === 403) handlelogout();
            setreport(null); // safe to null here — fetching will be set false after
            throw error;
        } finally {
            // setfetching(false)
            setloading(false)
        }
        return response?.interviewReport
    }

    const getReports = async () => {
        setloading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            setreports(response.interviewReports)
        } catch (error) {
            console.log(error)
        } finally {
            setloading(false)
        }

        return response?.interviewReports
    }

    const getResumePdf = async (interviewReportId) => {
        setloading(true)
        let response = null
        try {
            response = await generateResumePdf(interviewReportId)
            const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
        }
        catch (error) {
            console.log(error)
        } finally {
            setloading(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [interviewId])

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf }

}