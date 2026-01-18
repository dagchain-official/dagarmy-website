"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { sampleJobs, jobCategories, seniorityLevels, jobTypes } from "@/data/sample-jobs";

export default function JobsPanel() {
  const [jobs, setJobs] = useState(sampleJobs);
  const [filteredJobs, setFilteredJobs] = useState(sampleJobs);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [selectedType, setSelectedType] = useState("All Types");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // Filter jobs based on search and filters
  useEffect(() => {
    let filtered = jobs;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (job) =>
          job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter((job) => job.category === selectedCategory);
    }

    // Level filter
    if (selectedLevel !== "All Levels") {
      filtered = filtered.filter((job) => job.level === selectedLevel);
    }

    // Type filter
    if (selectedType !== "All Types") {
      filtered = filtered.filter((job) => job.type === selectedType);
    }

    setFilteredJobs(filtered);
  }, [searchQuery, selectedCategory, selectedLevel, selectedType, jobs]);

  const handleScrapeJobs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/scrape-jobs?keywords=Python&location=United%20States&pages=2');
      const data = await response.json();
      
      if (data.success && data.jobs.length > 0) {
        setJobs(data.jobs);
        setFilteredJobs(data.jobs);
      }
    } catch (error) {
      console.error('Error scraping jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="tf-spacing-1" style={{ background: '#f9fafb', minHeight: '100vh' }}>
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            {/* Header */}
            <div className="text-center mb-5 wow fadeInUp">
              <h2 className="font-cardo fw-7 mb-3">Find Your Dream Tech Job</h2>
              <p className="fs-18">
                Discover opportunities in AI, Blockchain, and Data Visualization
              </p>
              <button
                onClick={handleScrapeJobs}
                disabled={isLoading}
                className="tf-btn mt-3"
                style={{
                  background: isLoading ? '#9ca3af' : '#8b5cf6',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {isLoading ? 'Scraping LinkedIn Jobs...' : 'Refresh Jobs from LinkedIn'}
              </button>
            </div>

            {/* Search and Filters */}
            <div className="mb-4 wow fadeInUp">
              <div className="row g-3">
                {/* Search */}
                <div className="col-lg-6">
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    background: '#fff'
                  }}>
                    <i className="icon-search" style={{ color: '#6b7280', fontSize: '20px' }} />
                    <input
                      type="text"
                      placeholder="Search jobs, companies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="col-lg-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      background: '#fff',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    {jobCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Level Filter */}
                <div className="col-lg-2">
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      background: '#fff',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    {seniorityLevels.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* Type Filter */}
                <div className="col-lg-2">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      background: '#fff',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    {jobTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-3 wow fadeInUp">
              <p className="fs-15 text-muted">
                Showing {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Jobs Grid */}
            <div className="row g-4">
              {filteredJobs.map((job, index) => (
                <div key={job.id} className="col-lg-6 wow fadeInUp" data-wow-delay={`${index * 0.1}s`}>
                  <div
                    style={{
                      background: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '24px',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                    onClick={() => setSelectedJob(job)}
                  >
                    {/* Company & Category */}
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="fw-6 mb-1">{job.company}</h5>
                        <span
                          style={{
                            background: '#ede9fe',
                            color: '#7c3aed',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}
                        >
                          {job.category}
                        </span>
                      </div>
                      <span className="fs-14 text-muted">{job.postedDate}</span>
                    </div>

                    {/* Job Title */}
                    <h4 className="fw-6 mb-2">{job.jobTitle}</h4>

                    {/* Location & Level */}
                    <div className="d-flex gap-3 mb-3">
                      <span className="fs-14 text-muted">
                        <i className="flaticon-location" /> {job.location}
                      </span>
                      <span className="fs-14 text-muted">
                        <i className="flaticon-user-1" /> {job.level}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="fs-15 text-muted mb-3" style={{ flex: 1 }}>
                      {job.description}
                    </p>

                    {/* Footer */}
                    <div className="d-flex justify-content-between align-items-center pt-3" style={{ borderTop: '1px solid #f3f4f6' }}>
                      {job.salary && (
                        <span className="fs-15 fw-6" style={{ color: '#059669' }}>
                          {job.salary}
                        </span>
                      )}
                      <Link
                        href={job.jobUrl}
                        target="_blank"
                        className="tf-btn-arrow"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Apply Now <i className="icon-arrow-top-right" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredJobs.length === 0 && (
              <div className="text-center py-5 wow fadeInUp">
                <h4 className="fw-6 mb-2">No jobs found</h4>
                <p className="text-muted">Try adjusting your filters or search query</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => setSelectedJob(null)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              padding: '32px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h3 className="fw-7 mb-2">{selectedJob.jobTitle}</h3>
                <h5 className="fw-6 text-muted">{selectedJob.company}</h5>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <div className="d-flex gap-3 mb-3">
                <span
                  style={{
                    background: '#ede9fe',
                    color: '#7c3aed',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  {selectedJob.category}
                </span>
                <span
                  style={{
                    background: '#f3f4f6',
                    color: '#4b5563',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  {selectedJob.type}
                </span>
              </div>
              <div className="d-flex gap-4 mb-3">
                <span className="fs-15">
                  <i className="flaticon-location" /> {selectedJob.location}
                </span>
                <span className="fs-15">
                  <i className="flaticon-user-1" /> {selectedJob.level}
                </span>
                <span className="fs-15">
                  <i className="flaticon-calendar" /> {selectedJob.postedDate}
                </span>
              </div>
              {selectedJob.salary && (
                <p className="fs-18 fw-6" style={{ color: '#059669' }}>
                  {selectedJob.salary}
                </p>
              )}
            </div>

            <div className="mb-4">
              <h5 className="fw-6 mb-3">Job Description</h5>
              <p className="fs-15 text-muted">{selectedJob.description}</p>
            </div>

            <div className="d-flex gap-3">
              <Link
                href={selectedJob.jobUrl}
                target="_blank"
                className="tf-btn"
                style={{ flex: 1, textAlign: 'center' }}
              >
                Apply on LinkedIn <i className="icon-arrow-top-right" />
              </Link>
              <button
                onClick={() => setSelectedJob(null)}
                className="tf-btn"
                style={{
                  background: '#f3f4f6',
                  color: '#4b5563',
                  border: 'none'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
