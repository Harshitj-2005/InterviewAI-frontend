import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials: true
})

//use to generate interview report
export const generateInterviewReport = async ({ resume, jobDescription, selfDescription }) => {
    const formdata = new FormData();

    if (resume) formdata.append("resume", resume);
    if (jobDescription) formdata.append("jobDescription", jobDescription);
    if (selfDescription) formdata.append("selfDescription", selfDescription);

    // const response = await api.post("/api/interview/", formdata, {
    //     headers: {
    //         "Content-Type": "multipart/form-data"
    //     }
    // })

    const response = await api.post("/api/interview/", formdata);

    return response.data

};

//use to get interview report by id
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`)
    return response.data
}

//use to get all interview reports of the user
export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/")
    return response.data
}


//use to generate resume PDF based on user self description, resume and job description.
export const generateResumePdf = async (interviewReportId) => {
    const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
        responseType: "blob"
    })
    return response.data
}
