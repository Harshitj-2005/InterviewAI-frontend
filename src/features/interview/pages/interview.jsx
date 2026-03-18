import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import '../style/interview.scss';
import { useInterview } from '../hooks/useinterview.js';
const TABS = ['Technical Questions', 'Behavioral Questions', 'Preparation Plan'];

const extractRole = (jd = '') => {
  const line = jd.split('\n').find(l => l.toLowerCase().includes('position:'));
  return line ? line.replace(/position:/i, '').trim() : 'Interview Report';
};

const extractName = (resume = '') => resume.split('\n').find(l => l.trim()) || 'Candidate';

export default function Interview() {
  const { interviewId } = useParams();
  const { report, loading, getReportById, getResumePdf } = useInterview();

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId)
        .catch(error => {
          console.error("Failed to load report:", error);
        });
    }
  }, [interviewId]);

  const [activeTab, setActiveTab] = useState('Technical Questions');
  const [expanded, setExpanded] = useState(null);

  const toggle = (id) => setExpanded(expanded === id ? null : id);

  // ── LOADING STATE ──────────────────────────────────────────────────────────
  // Show spinner while fetch is in progress — never evaluate report during this time
  if (loading) {
    return (
      <div className="report-page">
        <nav className="report-nav">
          <div className="nav-logo">
            <div className="nav-logo-icon">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M7 2l5 5-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            InterviewAI
          </div>
        </nav>
        <div className="report-loading">
          <div className="report-loading__spinner" />
          <p className="report-loading__text">Loading your interview report...</p>
        </div>
      </div>
    );
  }

  // ── NOT FOUND STATE ────────────────────────────────────────────────────────
  if (!report) {
    return (
      <div className="report-page">
        <nav className="report-nav">
          <div className="nav-logo">
            <div className="nav-logo-icon">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M7 2l5 5-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            InterviewAI
          </div>
        </nav>
        <div className="report-empty">
          <p className="report-empty__title">Report not found</p>
          <p className="report-empty__sub">This report may have been deleted or the link is invalid.</p>
        </div>
      </div>
    );
  }

  // ── DERIVED VALUES ─────────────────────────────────────────────────────────
  const score = report.matchScore ?? 0;
  const role = extractRole(report.jobDescription);
  const candidate = extractName(report.resume);
  const scoreColor = score >= 75 ? '#16a34a' : score >= 50 ? '#f97316' : '#dc2626';
  const scoreLabel = score >= 75 ? '🟢 Interview Ready' : score >= 50 ? '🟡 Almost There' : '🔴 Needs Work';
  const circumference = 2 * Math.PI * 36;

  return (
    <div className="report-page">

      {/* ── NAVBAR ── */}
      <nav className="report-nav">
        <div className="nav-logo">
          <div className="nav-logo-icon">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M7 2l5 5-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          InterviewAI
        </div>
        <div className="nav-meta">
          <span className="nav-role">{role}</span>
          <span className="nav-candidate">{candidate}</span>
        </div>
        <div className="nav-score-wrap">
          <span className="nav-score-label">Match Score</span>
          <span className="nav-score" style={{ color: scoreColor }}>{score}%</span>
        </div>
        <button className="nav-download-btn" onClick={() => getResumePdf(interviewId)}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v7M4 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 10v1.5A1.5 1.5 0 003.5 13h7A1.5 1.5 0 0012 11.5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Download PDF
        </button>
      </nav>
      {/* ── 3-COLUMN LAYOUT ── */}
      <div className="report-layout">

        {/* ── LEFT SIDEBAR ── */}
        <aside className="sidebar">
          <p className="sidebar-heading">Sections</p>
          <nav className="sidebar-nav">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`sidebar-item${activeTab === tab ? ' active' : ''}`}
                onClick={() => { setActiveTab(tab); setExpanded(null); }}
              >
                <span className="sidebar-icon">
                  {tab === 'Technical Questions' && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 4h10M2 7h6M2 10h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  )}
                  {tab === 'Behavioral Questions' && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
                      <path d="M2.5 12c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  )}
                  {tab === 'Preparation Plan' && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="2" y="2" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
                      <path d="M5 7l2 2 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                {tab}
              </button>
            ))}
          </nav>

          <div className="sidebar-divider" />

          <div className="sidebar-stats">
            <div className="stat-row">
              <span className="stat-label">Technical Qs</span>
              <span className="stat-val">{report.technicalQuestions?.length ?? 0}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Behavioral Qs</span>
              <span className="stat-val">{report.behavioralQuestions?.length ?? 0}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Skill Gaps</span>
              <span className="stat-val">{report.skillGaps?.length ?? 0}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Prep Days</span>
              <span className="stat-val">{report.preparationPlan?.length ?? 0}</span>
            </div>
          </div>
        </aside>

        {/* ── CENTER MAIN ── */}
        <main className="report-main">

          {/* TECHNICAL QUESTIONS */}
          {activeTab === 'Technical Questions' && (
            <div className="section">
              <div className="section-header">
                <h2 className="section-title">Technical Questions</h2>
                <span className="section-count">{report.technicalQuestions?.length} questions</span>
              </div>
              <div className="question-list">
                {report.technicalQuestions?.map((q, i) => (
                  <div key={i} className={`question-card${expanded === `t${i}` ? ' open' : ''}`}>
                    <button className="question-trigger" onClick={() => toggle(`t${i}`)}>
                      <div className="question-trigger-left">
                        <span className="question-num">Q{i + 1}</span>
                        <span className="question-text">{q.question}</span>
                      </div>
                      <div className="question-trigger-right">
                        <svg className="chevron" width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </button>
                    {expanded === `t${i}` && (
                      <div className="question-body">
                        <div className="intention-block">
                          <span className="block-label">Interviewer's Intention</span>
                          <p className="intention-text">{q.intention}</p>
                        </div>
                        <div className="answer-block">
                          <span className="block-label">Expected Answer</span>
                          <p className="answer-text">{q.answer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BEHAVIORAL QUESTIONS */}
          {activeTab === 'Behavioral Questions' && (
            <div className="section">
              <div className="section-header">
                <h2 className="section-title">Behavioral Questions</h2>
                <span className="section-count">{report.behavioralQuestions?.length} questions</span>
              </div>
              <div className="question-list">
                {report.behavioralQuestions?.map((q, i) => (
                  <div key={i} className={`question-card${expanded === `b${i}` ? ' open' : ''}`}>
                    <button className="question-trigger" onClick={() => toggle(`b${i}`)}>
                      <div className="question-trigger-left">
                        <span className="question-num">Q{i + 1}</span>
                        <span className="question-text">{q.question}</span>
                      </div>
                      <div className="question-trigger-right">
                        <span className="badge badge-star">STAR</span>
                        <svg className="chevron" width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </button>
                    {expanded === `b${i}` && (
                      <div className="question-body">
                        <div className="intention-block">
                          <span className="block-label">Interviewer's Intention</span>
                          <p className="intention-text">{q.intention}</p>
                        </div>
                        <div className="answer-block">
                          <span className="block-label">How to Answer</span>
                          <p className="answer-text">{q.answer}</p>
                        </div>
                        <div className="star-guide">
                          {['Situation', 'Task', 'Action', 'Result'].map((s) => (
                            <div key={s} className="star-step">
                              <span className="star-letter">{s[0]}</span>
                              <span className="star-word">{s}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PREPARATION PLAN */}
          {activeTab === 'Preparation Plan' && (
            <div className="section">
              <div className="section-header">
                <h2 className="section-title">Preparation Plan</h2>
                <span className="section-count">{report.preparationPlan?.length}-day plan</span>
              </div>
              <div className="roadmap-list">
                {report.preparationPlan?.map((phase, i) => (
                  <div key={i} className="roadmap-card">
                    <div className="roadmap-left">
                      <div className="roadmap-day-badge">Day {phase.day}</div>
                      <div className="roadmap-line" />
                    </div>
                    <div className="roadmap-right">
                      <p className="roadmap-focus">{phase.focus}</p>
                      <ul className="roadmap-tasks">
                        {phase.tasks.map((task, j) => (
                          <li key={j}>{task}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>

        {/* ── RIGHT PANEL ── */}
        <aside className="right-panel">

          {/* Score Ring */}
          <div className="panel-section">
            <p className="panel-heading">Match Score</p>
            <div className="score-ring-wrap">
              <svg width="96" height="96" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="36" fill="none" stroke="#e5e7eb" strokeWidth="7" />
                <circle
                  cx="48" cy="48" r="36" fill="none"
                  stroke={scoreColor}
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - score / 100)}
                  transform="rotate(-90 48 48)"
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
              </svg>
              <span className="score-ring-val" style={{ color: scoreColor }}>{score}%</span>
            </div>
            <p className="score-label">{scoreLabel}</p>
          </div>

          <div className="panel-divider" />

          {/* Skill Gaps */}
          <div className="panel-section">
            <p className="panel-heading">Skill Gaps</p>
            <div className="skill-tags">
              {report.skillGaps?.map((sg, i) => (
                <span
                  key={i}
                  className={`skill-tag sev-tag-${sg.severity}`}
                  title={`Severity: ${sg.severity}`}
                >
                  {sg.skill}
                  <span className={`sev-dot sev-dot-${sg.severity}`} />
                </span>
              ))}
            </div>
            <div className="sev-legend">
              <span className="sev-item"><span className="sev-dot sev-dot-high" />High</span>
              <span className="sev-item"><span className="sev-dot sev-dot-medium" />Medium</span>
              <span className="sev-item"><span className="sev-dot sev-dot-low" />Low</span>
            </div>
          </div>

          <div className="panel-divider" />

          {/* Quick Stats */}
          <div className="panel-section">
            <p className="panel-heading">Quick Stats</p>
            <div className="quick-stats">
              <div className="qs-item">
                <span className="qs-num">{report.technicalQuestions?.length}</span>
                <span className="qs-label">Technical Qs</span>
              </div>
              <div className="qs-item">
                <span className="qs-num">{report.behavioralQuestions?.length}</span>
                <span className="qs-label">Behavioral Qs</span>
              </div>
              <div className="qs-item">
                <span className="qs-num">{report.preparationPlan?.length}</span>
                <span className="qs-label">Prep days</span>
              </div>
              <div className="qs-item">
                <span className="qs-num">{report.skillGaps?.length}</span>
                <span className="qs-label">Skill gaps</span>
              </div>
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}