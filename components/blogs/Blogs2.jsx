"use client";
import React, { useState } from "react";
import Pagination from "../common/Pagination";
import Link from "next/link";
import Image from "next/image";
import { dagarmyBlogs, recentPosts, blogCategories, blogTags } from "@/data/dagarmy-blogs";

export default function Blogs2() {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isRecentPostsOpen, setIsRecentPostsOpen] = useState(true);
  const [isTagsOpen, setIsTagsOpen] = useState(true);

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
                  <div className="wrap-blog-list">
                    {dagarmyBlogs.map((article, index) => (
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
                          e.currentTarget.style.boxShadow = "0 8px 30px rgba(139, 92, 246, 0.15)";
                          e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                          e.currentTarget.style.borderColor = "#e5e7eb";
                        }}
                      >
                        <div className="article-thumb image-wrap" style={{ marginBottom: "6px" }}>
                          <Image
                            className="lazyload"
                            data-src={article.imgSrc}
                            alt={article.alt}
                            src={article.imgSrc}
                            width={article.width}
                            height={article.height}
                            style={{ borderRadius: "8px" }}
                          />
                        </div>
                        <div className="article-content">
                          <div className="article-label" style={{ marginBottom: "4px" }}>
                            <Link
                              href={`/blog-single/${article.id}`}
                              style={{
                                background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                                color: "#fff",
                                padding: "6px 14px",
                                borderRadius: "5px",
                                fontSize: "12px",
                                fontWeight: "600",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                textDecoration: "none",
                                display: "inline-block",
                              }}
                            >
                              {article.category}
                            </Link>
                          </div>
                          <h3 className="fw-5 font-outfit" style={{ fontSize: "24px", marginBottom: "4px", lineHeight: "1.3" }}>
                            <Link href={`/blog-single/${article.id}`}>
                              {article.title}
                            </Link>
                          </h3>
                          <p style={{ fontSize: "16px", lineHeight: "1.6", marginBottom: "6px", color: "#4b5563" }}>
                            {article.description}
                          </p>
                          <div className="meta" style={{ marginBottom: "6px" }}>
                            <div className="meta-item">
                              <i className="flaticon-calendar" />
                              <p>{article.date}</p>
                            </div>
                            <div className="meta-item">
                              <i className="flaticon-message" />
                              <p>{article.comments}</p>
                            </div>
                            <a href="#" className="meta-item">
                              <i className="flaticon-user-1" />
                              <p>{article.author}</p>
                            </a>
                          </div>
                          <Link
                            href={`/blog-single/${article.id}`}
                            className="tf-btn-arrow"
                            style={{
                              color: "#8b5cf6",
                              fontWeight: "600",
                              fontSize: "16px",
                            }}
                          >
                            Read More <i className="icon-arrow-top-right" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                  <ul className="wg-pagination justify-center wow fadeInUp" style={{ marginTop: "30px" }}>
                    <Pagination />
                  </ul>
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
                          color: "#8b5cf6",
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
                                e.currentTarget.style.color = "#8b5cf6";
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
                                  background: "linear-gradient(90deg, #8b5cf6 0%, #6d28d9 100%)",
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
                          color: "#8b5cf6",
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
                        {recentPosts.map((article, index) => (
                          <li
                            key={article.id}
                            className="recent-item hover-img"
                            style={{
                              display: "flex",
                              gap: "12px",
                              paddingBottom: "14px",
                              marginBottom: "14px",
                              borderBottom: index < recentPosts.length - 1 ? "1px solid #f3f4f6" : "none",
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
                              <Image
                                className="lazyload"
                                data-src={article.imgSrc}
                                alt=""
                                src={article.imgSrc}
                                width={article.imgWidth}
                                height={article.imgHeight}
                                style={{
                                  borderRadius: "6px",
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                            <div className="content" style={{ flex: 1 }}>
                              <div className="font-outfit text-15 fw-5">
                                <Link
                                  href={`/blog-single/${article.id}`}
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
                                  onMouseEnter={(e) => e.currentTarget.style.color = "#8b5cf6"}
                                  onMouseLeave={(e) => e.currentTarget.style.color = "#111827"}
                                >
                                  {article.title}
                                </Link>
                              </div>
                              <p style={{
                                margin: "6px 0 0 0",
                                fontSize: "12px",
                                color: "#9ca3af"
                              }}>
                                {article.date}
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
                          color: "#8b5cf6",
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
                                  e.currentTarget.style.background = "linear-gradient(135deg, #8b5cf6 0%, #8f5fe2ff 100%)";
                                  e.currentTarget.style.color = "#fff";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = "#f3f4f6";
                                  e.currentTarget.style.color = "#374151";
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
