import React, { useState, useRef } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useinterview.js'
import { useEffect } from "react";
import { useAuth } from '../../auth/hooks/useAuth.js'
import { useNavigate } from 'react-router'

const Home = () => {

    const { loading, generateReport, reports } = useInterview()
    const { user } = useAuth();

    // useEffect(() => {
    //     if (user) {
    //         getReports();
    //     }
    // }, [user]);

    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [dragging, setDragging] = useState(false)
    const [resumeFile, setResumeFile] = useState(null)
    const resumeInputRef = useRef()


    const navigate = useNavigate()

    const handleFile = (file) => {
        if (file && (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.docx'))) {
            setResumeFile(file)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragging(false)
        handleFile(e.dataTransfer.files[0])
    }

    const handleGenerateReport = async () => {
        try {
            const file = resumeFile || resumeInputRef.current?.files[0]
            const data = await generateReport({ resume: file, jobDescription, selfDescription })
            if (data) {
                navigate(`/interview/${data._id}`)
            } else {
                alert('Failed to generate report. Please try again.')
            }
        } catch (error) {
            console.error('Error generating report:', error)
            alert('An error occurred while generating the report.')
        }
    }

    const canSubmit = (resumeFile || resumeInputRef.current?.files?.[0] || selfDescription.trim().length > 10) && jobDescription.trim().length > 10

    if (loading) {
        return (
            <div className="page">
                <nav className="navbar">
                    <div className="navbar-logo">
                        <div className="navbar-logo-icon">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M2 7h10M7 2l5 5-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span>InterviewAI</span>
                    </div>
                    <span className="navbar-badge">v1.0</span>
                </nav>
                <div className="loading-screen">
                    <div className="loading-spinner" />
                    <p className="loading-text">Loading your interview plan...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="page">

            {/* ── NAVBAR ── */}
            <nav className="navbar">
                <div className="navbar-logo">
                    <div className="navbar-logo-icon">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2 7h10M7 2l5 5-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <span>InterviewAI</span>
                </div>
                <ul className="navbar-links">
                    <li><a href="#">Features</a></li>
                    <li><a href="#">Docs</a></li>
                    <li><a href="#">Pricing</a></li>
                </ul>
                <span className="navbar-badge">v1.0</span>
            </nav>

            {/* ── HERO ── */}
            <section className="hero">
                <div className="hero-status">
                    <span className="hero-dot" />
                    AI Ready
                </div>
                <h1 className="hero-title">
                    Generate your interview<br />preparation report
                </h1>
                <p className="hero-sub">
                    Upload your resume, paste the job description, and get a tailored
                    report with questions, skills &amp; roadmap.
                </p>
                <div className="hero-tags">
                    {['Technical Questions', 'Behavioural Questions', 'Skill Analysis', 'Severity Map', 'Roadmap'].map((t) => (
                        <span className="hero-tag" key={t}>{t}</span>
                    ))}
                </div>
            </section>

            {/* ── FORM CARD ── */}
            <section className="card-wrap">
                <div className="card">

                    {/* Terminal topbar */}
                    <div className="card-topbar">
                        <span className="dot dot-red" />
                        <span className="dot dot-yellow" />
                        <span className="dot dot-green" />
                        <span className="card-topbar-label">interview-report ~ generate</span>
                    </div>

                    {/* Two-column body */}
                    <div className="card-body">

                        {/* LEFT — Job Description */}
                        <div className="col-left">
                            <div className="field-header">
                                <span className="field-label">Job Description</span>
                                <span className="field-hint">{jobDescription.length} / 5000 chars</span>
                            </div>
                            <textarea
                                className={`textarea-main${jobDescription.length > 10 ? ' filled' : ''}`}
                                placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript...'`}
                                value={jobDescription}
                                maxLength={5000}
                                onChange={(e) => setJobDescription(e.target.value)}
                            />
                        </div>

                        {/* RIGHT */}
                        <div className="col-right">

                            {/* Resume upload */}
                            <div className="field-group">
                                <div className="field-header">
                                    <span className="field-label">Resume</span>
                                    <span className="field-hint">PDF or DOCX · Max 5MB</span>
                                </div>
                                <div
                                    className={`upload-box${dragging ? ' dragover' : ''}${resumeFile ? ' has-file' : ''}`}
                                    onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                                    onDragLeave={() => setDragging(false)}
                                    onDrop={handleDrop}
                                    onClick={() => resumeInputRef.current.click()}
                                >
                                    <input
                                        ref={resumeInputRef}
                                        type="file"
                                        id="resume"
                                        name="resume"
                                        accept=".pdf"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleFile(e.target.files[0])}
                                    />
                                    {resumeFile ? (
                                        <>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="upload-icon success">
                                                <path d="M4 10l4.5 4.5L16 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <span className="upload-filename">{resumeFile.name}</span>
                                            <span className="upload-change">click to change</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="upload-icon">
                                                <polyline points="16 16 12 12 8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <line x1="12" y1="12" x2="12" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                            <span className="upload-label"><strong>Click to upload</strong> or drag &amp; drop</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* OR divider */}
                            <div className="or-divider">
                                <span>OR</span>
                            </div>

                            {/* Self Description */}
                            <div className="field-group">
                                <div className="field-header">
                                    <label className="field-label" htmlFor="selfDescription">About Yourself</label>
                                    <span className="field-hint">{selfDescription.length} chars</span>
                                </div>
                                <textarea
                                    id="selfDescription"
                                    name="selfDescription"
                                    className={`textarea-self${selfDescription.length > 10 ? ' filled' : ''}`}
                                    placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                                    value={selfDescription}
                                    onChange={(e) => setSelfDescription(e.target.value)}
                                />
                            </div>

                            {/* Info box */}
                            <div className="info-box">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="info-box__icon">
                                    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3" />
                                    <path d="M7 6.5v3M7 4.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                                </svg>
                                <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required alongside the job description.</p>
                            </div>

                            {/* Footer row */}
                            <div className="card-footer">
                                <div className="footer-badge">
                                    <span className="pulse" />
                                    AI Ready
                                    <span className="footer-note">· ~30s to generate</span>
                                </div>
                                <button
                                    className="generate-btn"
                                    disabled={!canSubmit || loading}
                                    onClick={handleGenerateReport}
                                >
                                    {loading ? 'Generating...' : 'Generate Report'}
                                    <span className="btn-arrow">→</span>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* ── RECENT REPORTS ── */}
            {reports && reports.length > 0 && (
                <section className="recent-reports">
                    <div className="recent-reports__header">
                        <p className="recent-reports__title">Recent Interview Plans</p>
                        <span className="recent-reports__count">{reports.length} reports</span>
                    </div>
                    <div className="reports-grid">
                        {reports.map((report) => (
                            <div
                                key={report._id}
                                className="report-card"
                                onClick={() => navigate(`/interview/${report._id}`)}
                            >
                                <div className="report-card__top">
                                    <p className="report-card__title">{report.title || 'Untitled Position'}</p>
                                    <span className={`report-card__score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>
                                        {report.matchScore}%
                                    </span>
                                </div>
                                <p className="report-card__date">
                                    {new Date(report.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                                <span className="report-card__arrow">→</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
            {/* {reports.length > 0 && (
                <section className='recent-reports'>
                    <h2>My Recent Interview Plans</h2>
                    <ul className='reports-list'>
                        {reports.map(report => (
                            <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                <h3>{report.title || 'Untitled Position'}</h3>
                                <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match Score: {report.matchScore}%</p>
                            </li>
                        ))}
                    </ul>
                </section>
            )} */}


            {/* ── SITE FOOTER ── */}
            <footer className="site-footer">
                InterviewAI · Powered by open models · Built for job seekers
            </footer>

        </div>
    )
}

export default Home