"use client";
import React, { useState, useEffect } from "react";
import Pagination from "../common/Pagination";
import Link from "next/link";
import Image from "next/image";
export default function Blogs2() {
  const [isRecentPostsOpen, setIsRecentPostsOpen] = useState(true);
  const [mediumPosts, setMediumPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMediumPosts();
  }, []);

  const fetchMediumPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blog/medium');
      const data = await response.json();
      
      if (data.success && data.posts) {
        setMediumPosts(data.posts);
        setFilteredPosts(data.posts);
      } else {
        setError('Failed to load blog posts');
      }
    } catch (err) {
      console.error('Error fetching Medium posts:', err);
      setError('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  // Task 2: Search functionality - filter posts based on search query
  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase().trim();
    
    if (!query) {
      setFilteredPosts(mediumPosts);
      return;
    }

    const filtered = mediumPosts.filter(post => {
      const titleMatch = post.title?.toLowerCase().includes(query);
      const contentMatch = post.content?.toLowerCase().includes(query);
      const descriptionMatch = post.description?.toLowerCase().includes(query);
      const categoriesMatch = post.categories?.some(cat => cat.toLowerCase().includes(query));
      
      return titleMatch || contentMatch || descriptionMatch || categoriesMatch;
    });

    setFilteredPosts(filtered);
  };

  // Update filtered posts when search query changes
  useEffect(() => {
    if (searchQuery === "") {
      setFilteredPosts(mediumPosts);
    }
  }, [searchQuery, mediumPosts]);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .page-blog-list {
            display: flex !important;
            gap: 24px !important;
            align-items: flex-start !important;
          }
          .page-blog-list .left {
            flex: 1 !important;
            min-width: 0 !important;
            max-width: none !important;
          }
          .page-blog-list .right {
            width: 380px !important;
            flex-shrink: 0 !important;
            max-width: 400px !important;
          }
        `
      }} />
      <section className="tf-spacing tf-spacing-1" style={{ background: "#fafafa", padding: "30px 0 50px" }}>
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              <div className="page-blog-list">
                {/* Main Blog List - Expanded Width */}
                <div className="left">
                  {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        margin: '0 auto 20px',
                        border: '4px solid #f3f4f6',
                        borderTop: '4px solid #1f2937',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading blog posts from Medium...</p>
                      <style dangerouslySetInnerHTML={{
                        __html: `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`
                      }} />
                    </div>
                  ) : error ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                      <p style={{ color: '#ef4444', fontSize: '16px', marginBottom: '10px' }}>{error}</p>
                      <button 
                        onClick={fetchMediumPosts}
                        style={{
                          background: '#1f2937',
                          color: '#fff',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}
                      >
                        Retry
                      </button>
                    </div>
                  ) : filteredPosts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 20px', display: 'block' }}>
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                      </svg>
                      <h3 style={{ color: '#374151', fontSize: '20px', marginBottom: '10px', fontWeight: '600' }}>No Results Found</h3>
                      <p style={{ color: '#9ca3af', fontSize: '15px', marginBottom: '20px' }}>
                        No blog posts match your search for "<strong>{searchQuery}</strong>"
                      </p>
                      <button 
                        onClick={() => setSearchQuery("")}
                        style={{
                          background: '#1f2937',
                          color: '#fff',
                          padding: '10px 24px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}
                      >
                        Clear Search
                      </button>
                    </div>
                  ) : (
                    <div className="wrap-blog-list">
                      {filteredPosts.map((article, index) => (
                      <div
                        className="blog-article-item style-row hover-img wow fadeInUp"
                        key={index}
                        style={{
                          background: "#ffffff",
                          borderRadius: "10px",
                          padding: "12px",
                          marginBottom: "20px",
                          border: "2px solid #e5e7eb",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-5px)";
                          e.currentTarget.style.boxShadow = "0 12px 30px rgba(0, 0, 0, 0.15)";
                          e.currentTarget.style.borderColor = "#000000";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                          e.currentTarget.style.borderColor = "#e5e7eb";
                        }}
                      >
                        <div className="article-thumb image-wrap" style={{ marginBottom: "6px" }}>
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            style={{ 
                              borderRadius: "8px",
                              width: '100%',
                              height: 'auto',
                              maxHeight: '400px',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              e.target.src = '/images/blog/default-blog.jpg';
                            }}
                          />
                        </div>
                        <div className="article-content">
                          <div className="article-label" style={{ marginBottom: "4px", display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {article.categories && article.categories.slice(0, 3).map((cat, idx) => (
                              <span
                                key={idx}
                                style={{
                                  background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
                                  color: "#fff",
                                  padding: "6px 14px",
                                  borderRadius: "5px",
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px",
                                  display: "inline-block",
                                }}
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                          <h3 className="fw-5 font-outfit" style={{ fontSize: "24px", marginBottom: "4px", lineHeight: "1.3" }}>
                            <a 
                              href={article.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                              {article.title}
                            </a>
                          </h3>
                          <p style={{ fontSize: "16px", lineHeight: "1.6", marginBottom: "6px", color: "#4b5563" }}>
                            {article.description}
                          </p>
                          <div className="meta" style={{ marginBottom: "6px" }}>
                            <div className="meta-item">
                              <i className="flaticon-calendar" />
                              <p>{article.pubDate}</p>
                            </div>
                            <div className="meta-item">
                              <i className="flaticon-user-1" />
                              <p>{article.author}</p>
                            </div>
                          </div>
                          <a
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="tf-btn-arrow"
                            style={{
                              color: "#1f2937",
                              fontWeight: "600",
                              fontSize: "16px",
                              textDecoration: "none",
                            }}
                          >
                            Read on Medium <i className="icon-arrow-top-right" />
                          </a>
                        </div>
                      </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sidebar - Fixed Width */}
                <div className="right tf-sidebar" style={{ padding: "12px" }}>
                  {/* Search Box - Fully Functional */}
                  <div
                    className="sidebar-search wow fadeInUp"
                    data-wow-delay="0s"
                    style={{
                      background: "#ffffff",
                      borderRadius: "10px",
                      padding: "18px",
                      marginBottom: "20px",
                      border: "2px solid #e5e7eb",
                    }}
                  >
                    <h5 className="fw-6" style={{ fontSize: "17px", marginBottom: "12px", color: "#111827", fontWeight: "700" }}>
                      Search
                    </h5>
                    <form onSubmit={handleSearch}>
                      <fieldset>
                        <input
                          type="text"
                          placeholder="Search articles..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "2px solid #e5e7eb",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </fieldset>
                    </form>
                  </div>

                  {/* Recent Posts - Collapsible */}
                  <div
                    className="sidebar-item sidebar-recent wow fadeInUp"
                    data-wow-delay="0.2s"
                    style={{
                      background: "#ffffff",
                      borderRadius: "10px",
                      padding: "18px",
                      marginBottom: "20px",
                      border: "2px solid #e5e7eb",
                    }}
                  >
                    <div
                      className="sidebar-title"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px",
                        cursor: "pointer",
                      }}
                      onClick={() => setIsRecentPostsOpen(!isRecentPostsOpen)}
                    >
                      <h5 className="fw-6" style={{ fontSize: "17px", margin: 0, color: "#111827", fontWeight: "700" }}>
                        Recent Posts
                      </h5>
                      <i
                        className="icon-arrow-top"
                        style={{
                          color: "#1f2937",
                          fontSize: "16px",
                          transform: isRecentPostsOpen ? "rotate(0deg)" : "rotate(180deg)",
                          transition: "transform 0.3s ease"
                        }}
                      />
                    </div>
                    {isRecentPostsOpen && (
                      <ul
                        style={{
                          listStyle: "none",
                          padding: 0,
                          margin: 0,
                        }}
                      >
                        {mediumPosts.slice(0, 5).map((article, index) => (
                          <li
                            key={article.id}
                            className="recent-item hover-img"
                            style={{
                              display: "flex",
                              gap: "12px",
                              paddingBottom: "14px",
                              marginBottom: "14px",
                              borderBottom: index < 4 ? "1px solid #f3f4f6" : "none",
                            }}
                          >
                            <div
                              className="image image-wrap"
                              style={{
                                width: "70px",
                                height: "70px",
                                flexShrink: 0,
                              }}
                            >
                              <img
                                src={article.imageUrl}
                                alt={article.title}
                                style={{
                                  borderRadius: "6px",
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                                onError={(e) => {
                                  e.target.src = '/images/blog/default-blog.jpg';
                                }}
                              />
                            </div>
                            <div className="content" style={{ flex: 1 }}>
                              <div className="font-outfit text-15 fw-5">
                                <a
                                  href={article.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    textDecoration: "none",
                                    color: "#111827",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    lineHeight: "1.4",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    transition: "color 0.2s ease",
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.color = "#1f2937"}
                                  onMouseLeave={(e) => e.currentTarget.style.color = "#111827"}
                                >
                                  {article.title}
                                </a>
                              </div>
                              <p style={{
                                margin: "6px 0 0 0",
                                fontSize: "12px",
                                color: "#9ca3af"
                              }}>
                                {article.pubDate}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
