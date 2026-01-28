"use client";
import React, { useState, useEffect } from "react";
import Pagination from "../common/Pagination";
import Link from "next/link";
import Image from "next/image";
import { blogCategories, blogTags } from "@/data/dagarmy-blogs";

export default function Blogs2() {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isRecentPostsOpen, setIsRecentPostsOpen] = useState(true);
  const [isTagsOpen, setIsTagsOpen] = useState(true);
  const [mediumPosts, setMediumPosts] = useState([]);
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
                  ) : (
                    <div className="wrap-blog-list">
                      {mediumPosts.map((article, index) => (
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
                  {/* Search Box - No Icon */}
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
                    <h5
                      className="fw-6"
                      style={{
                        fontSize: "17px",
                        marginBottom: "12px",
                        color: "#111827",
                        fontWeight: "700"
                      }}
                    >
                      Search
                    </h5>
                    <form
                      onSubmit={(e) => e.preventDefault()}
                      className="form-search"
                    >
                      <fieldset>
                        <input
                          type="text"
                          placeholder="Search articles..."
                          name="text"
                          tabIndex={2}
                          defaultValue=""
                          aria-required="true"
                          required
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

                  {/* Categories - Collapsible */}
                  <div
                    className="sidebar-item sidebar-categories wow fadeInUp"
                    data-wow-delay="0.1s"
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
                      onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                    >
                      <h5 className="fw-6" style={{ fontSize: "17px", margin: 0, color: "#111827", fontWeight: "700" }}>
                        Categories
                      </h5>
                      <i
                        className={`icon-arrow-top`}
                        style={{
                          color: "#1f2937",
                          fontSize: "16px",
                          transform: isCategoriesOpen ? "rotate(0deg)" : "rotate(180deg)",
                          transition: "transform 0.3s ease"
                        }}
                      />
                    </div>
                    {isCategoriesOpen && (
                      <ul
                        style={{
                          listStyle: "none",
                          padding: 0,
                          margin: 0,
                        }}
                      >
                        {blogCategories.map((category, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-between"
                            style={{
                              padding: "10px 0",
                              borderBottom: index < blogCategories.length - 1 ? "1px solid #f3f4f6" : "none",
                            }}
                          >
                            <a
                              href="#"
                              className="fs-15"
                              style={{
                                textDecoration: "none",
                                color: "#374151",
                                fontSize: "14px",
                                transition: "color 0.3s ease",
                                position: "relative",
                                paddingBottom: "4px",
                                display: "inline-block",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = "#1f2937";
                                const underline = e.currentTarget.querySelector('.underline');
                                if (underline) {
                                  underline.style.width = "100%";
                                }
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = "#374151";
                                const underline = e.currentTarget.querySelector('.underline');
                                if (underline) {
                                  underline.style.width = "0%";
                                }
                              }}
                            >
                              {category.name}
                              <span
                                className="underline"
                                style={{
                                  position: "absolute",
                                  bottom: "0",
                                  left: "0",
                                  width: "0%",
                                  height: "2px",
                                  background: "linear-gradient(90deg, #1f2937 0%, #1f2937 100%)",
                                  transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                }}
                              />
                            </a>
                            <div
                              className="number"
                              style={{
                                background: "#f3f4f6",
                                color: "#6b7280",
                                padding: "6px 14px",
                                borderRadius: "6px",
                                fontSize: "13px",
                                fontWeight: "600",
                              }}
                            >
                              ({category.count})
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
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

                  {/* Tags - Collapsible */}
                  <div
                    className="sidebar-item wow fadeInUp"
                    data-wow-delay="0.3s"
                    style={{
                      background: "#ffffff",
                      borderRadius: "10px",
                      padding: "24px",
                      border: "2px solid #e5e7eb",
                    }}
                  >
                    <div
                      className="sidebar-title"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                        cursor: "pointer",
                      }}
                      onClick={() => setIsTagsOpen(!isTagsOpen)}
                    >
                      <h5 className="fw-6" style={{ fontSize: "20px", margin: 0, color: "#111827", fontWeight: "700" }}>
                        Tags
                      </h5>
                      <i
                        className="icon-arrow-top"
                        style={{
                          color: "#1f2937",
                          fontSize: "18px",
                          transform: isTagsOpen ? "rotate(0deg)" : "rotate(180deg)",
                          transition: "transform 0.3s ease"
                        }}
                      />
                    </div>
                    {isTagsOpen && (
                      <div>
                        <ul
                          className="tags-list"
                          style={{
                            listStyle: "none",
                            padding: 0,
                            margin: 0,
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                          }}
                        >
                          {blogTags.map((tag, index) => (
                            <li key={index}>
                              <a
                                href="#"
                                className="tags-item"
                                style={{
                                  display: "inline-block",
                                  background: "#f3f4f6",
                                  color: "#374151",
                                  borderRadius: "5px",
                                  padding: "8px 14px",
                                  fontSize: "13px",
                                  fontWeight: "500",
                                  textDecoration: "none",
                                  transition: "all 0.2s ease",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = "linear-gradient(135deg, #000000 0%, #1f2937 100%)";
                                  e.currentTarget.style.color = "#fff";
                                  e.currentTarget.style.transform = "translateY(-2px)";
                                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = "#f3f4f6";
                                  e.currentTarget.style.color = "#374151";
                                  e.currentTarget.style.transform = "translateY(0)";
                                  e.currentTarget.style.boxShadow = "none";
                                }}
                              >
                                {tag}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
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
