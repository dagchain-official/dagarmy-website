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
  
  // Real-time predictive search states
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const searchRef = React.useRef(null);

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

  // Real-time search with debouncing
  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    
    if (!query) {
      setFilteredPosts(mediumPosts);
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Debounce search - wait 300ms after user stops typing
    const debounceTimer = setTimeout(() => {
      const filtered = mediumPosts.filter(post => {
        const titleMatch = post.title?.toLowerCase().includes(query);
        const contentMatch = post.content?.toLowerCase().includes(query);
        const descriptionMatch = post.description?.toLowerCase().includes(query);
        const categoriesMatch = post.categories?.some(cat => cat.toLowerCase().includes(query));
        
        return titleMatch || contentMatch || descriptionMatch || categoriesMatch;
      });

      setFilteredPosts(filtered);
      
      // Show top 5 suggestions
      const topSuggestions = filtered.slice(0, 5);
      setSuggestions(topSuggestions);
      setShowSuggestions(topSuggestions.length > 0);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, mediumPosts]);

  // Handle suggestion selection
  const handleSuggestionClick = (post) => {
    window.open(post.link, '_blank', 'noopener,noreferrer');
    setSearchQuery("");
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedSuggestionIndex(-1);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(suggestions[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
      default:
        break;
    }
  };

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const nm = {
    bg: '#eef0f5',
    shadow: '8px 8px 20px rgba(166,180,200,0.55), -8px -8px 20px rgba(255,255,255,0.95)',
    shadowSm: '4px 4px 10px rgba(166,180,200,0.5), -4px -4px 10px rgba(255,255,255,0.9)',
    shadowInset: 'inset 4px 4px 10px rgba(166,180,200,0.5), inset -4px -4px 10px rgba(255,255,255,0.9)',
    shadowHover: '12px 12px 28px rgba(166,180,200,0.65), -12px -12px 28px rgba(255,255,255,0.98)',
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
        `
      }} />
      <section style={{ background: nm.bg, padding: '40px 0 64px' }}>
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>
                {/* ── Main post list ── */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {loading ? (
                    <div style={{ textAlign: 'center', padding: '80px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: nm.bg, boxShadow: nm.shadow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                      </div>
                      <p style={{ color: '#64748b', fontSize: '15px', fontWeight: '500' }}>Loading blog posts from Medium...</p>
                    </div>
                  ) : error ? (
                    <div style={{ background: nm.bg, borderRadius: '18px', boxShadow: nm.shadow, padding: '60px 40px', textAlign: 'center' }}>
                      <p style={{ color: '#ef4444', fontSize: '15px', marginBottom: '18px', fontWeight: '600' }}>{error}</p>
                      <button onClick={fetchMediumPosts} style={{ padding: '12px 28px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#60a5fa,#818cf8,#a78bfa)', color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: '6px 6px 14px rgba(96,165,250,0.3)' }}>Retry</button>
                    </div>
                  ) : filteredPosts.length === 0 ? (
                    <div style={{ background: nm.bg, borderRadius: '18px', boxShadow: nm.shadow, padding: '60px 40px', textAlign: 'center' }}>
                      <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: nm.bg, boxShadow: nm.shadow, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                      </div>
                      <h3 style={{ color: '#0f172a', fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>No Results Found</h3>
                      <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>No posts match &ldquo;<strong>{searchQuery}</strong>&rdquo;</p>
                      <button onClick={() => setSearchQuery('')} style={{ padding: '12px 28px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#60a5fa,#818cf8,#a78bfa)', color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: '6px 6px 14px rgba(96,165,250,0.3)' }}>Clear Search</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {filteredPosts.map((article, index) => (
                        <div
                          key={index}
                          style={{ background: nm.bg, borderRadius: '14px', boxShadow: nm.shadow, overflow: 'hidden', transition: 'box-shadow 0.25s, transform 0.25s', display: 'flex', gap: 0, padding: '12px' }}
                          onMouseEnter={e => { e.currentTarget.style.boxShadow = nm.shadowHover; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                          onMouseLeave={e => { e.currentTarget.style.boxShadow = nm.shadow; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                          {/* Thumbnail — left side, fixed width */}
                          {article.imageUrl && (
                            <div style={{ width: '200px', minWidth: '200px', height: '260px', borderRadius: '10px', overflow: 'hidden', marginRight: '16px', flexShrink: 0, boxShadow: nm.shadowSm }}>
                              <img src={article.imageUrl} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => { e.target.src = '/images/blog/default-blog.jpg'; }} />
                            </div>
                          )}
                          {/* Content — right side */}
                          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            {/* Categories */}
                            {article.categories?.length > 0 && (
                              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
                                {article.categories.slice(0, 3).map((cat, idx) => (
                                  <span key={idx} style={{ padding: '3px 10px', borderRadius: '20px', background: nm.bg, boxShadow: nm.shadowSm, fontSize: '10px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{cat}</span>
                                ))}
                              </div>
                            )}
                            {/* Title */}
                            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '6px', lineHeight: '1.4', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                              <a href={article.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>{article.title}</a>
                            </h3>
                            {/* Description */}
                            {article.description && (
                              <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5', marginBottom: '8px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{article.description}</p>
                            )}
                            {/* Meta + CTA row */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                  {article.pubDate}
                                </span>
                                {article.author && (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                    {article.author}
                                  </span>
                                )}
                              </div>
                              <a
                                href={article.link} target="_blank" rel="noopener noreferrer"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '8px', background: 'linear-gradient(135deg,#60a5fa,#818cf8,#a78bfa)', color: '#fff', fontSize: '11px', fontWeight: '700', textDecoration: 'none', boxShadow: '4px 4px 10px rgba(96,165,250,0.28)', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '6px 6px 14px rgba(96,165,250,0.42)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '4px 4px 10px rgba(96,165,250,0.28)'; }}
                              >
                                Read on Medium
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── Sidebar ── */}
                <div style={{ width: '340px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>

                  {/* Search */}
                  <div ref={searchRef} style={{ background: nm.bg, borderRadius: '18px', boxShadow: nm.shadow, padding: '22px', position: 'relative' }}>
                    <h5 style={{ fontSize: '14px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '14px' }}>Search</h5>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: 'none', outline: 'none', background: nm.bg, boxShadow: nm.shadowInset, fontSize: '14px', color: '#0f172a', boxSizing: 'border-box' }}
                        onFocus={e => { e.currentTarget.style.boxShadow = 'inset 5px 5px 12px rgba(166,180,200,0.6), inset -5px -5px 12px rgba(255,255,255,0.95)'; if (searchQuery && suggestions.length > 0) setShowSuggestions(true); }}
                        onBlur={e => { e.currentTarget.style.boxShadow = nm.shadowInset; }}
                      />
                      {/* Suggestions dropdown */}
                      {showSuggestions && suggestions.length > 0 && (
                        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, background: nm.bg, borderRadius: '14px', boxShadow: nm.shadowHover, maxHeight: '380px', overflowY: 'auto', zIndex: 1000, animation: 'slideDown 0.2s ease-out' }}>
                          {suggestions.map((post, index) => (
                            <div
                              key={post.id || index}
                              onClick={() => handleSuggestionClick(post)}
                              onMouseEnter={() => setSelectedSuggestionIndex(index)}
                              style={{ padding: '12px 16px', cursor: 'pointer', background: selectedSuggestionIndex === index ? 'rgba(129,140,248,0.06)' : 'transparent', borderLeft: `3px solid ${selectedSuggestionIndex === index ? '#818cf8' : 'transparent'}`, transition: 'all 0.15s', display: 'flex', gap: '10px', alignItems: 'flex-start' }}
                            >
                              {post.imageUrl && (
                                <img src={post.imageUrl} alt={post.title} style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} onError={e => { e.target.style.display = 'none'; }} />
                              )}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.4', marginBottom: '3px' }}>{post.title}</div>
                                {post.pubDate && <div style={{ fontSize: '11px', color: '#94a3b8' }}>{post.pubDate}</div>}
                              </div>
                            </div>
                          ))}
                          <div style={{ padding: '8px 16px', borderTop: '1px solid rgba(148,163,184,0.15)', fontSize: '11px', color: '#94a3b8', textAlign: 'center' }}>
                            Press ↑↓ to navigate · Enter to open · Esc to close
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recent Posts */}
                  <div style={{ background: nm.bg, borderRadius: '18px', boxShadow: nm.shadow, padding: '22px' }}>
                    <div
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: isRecentPostsOpen ? '16px' : 0 }}
                      onClick={() => setIsRecentPostsOpen(!isRecentPostsOpen)}
                    >
                      <h5 style={{ fontSize: '14px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1.5px', margin: 0 }}>Recent Posts</h5>
                      <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: nm.bg, boxShadow: nm.shadowSm, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" style={{ transform: isRecentPostsOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.3s' }}><polyline points="18 15 12 9 6 15"/></svg>
                      </div>
                    </div>
                    {isRecentPostsOpen && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {mediumPosts.slice(0, 5).map((article, index) => (
                          <div key={article.id || index} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', paddingBottom: index < 4 ? '14px' : 0, borderBottom: index < 4 ? '1px solid rgba(148,163,184,0.15)' : 'none' }}>
                            {article.imageUrl && (
                              <div style={{ width: '60px', height: '60px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, boxShadow: nm.shadowSm }}>
                                <img src={article.imageUrl} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.src = '/images/blog/default-blog.jpg'; }} />
                              </div>
                            )}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <a
                                href={article.link} target="_blank" rel="noopener noreferrer"
                                style={{ textDecoration: 'none', fontSize: '13px', fontWeight: '600', color: '#0f172a', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', transition: 'color 0.2s' }}
                                onMouseEnter={e => { e.currentTarget.style.color = '#818cf8'; }}
                                onMouseLeave={e => { e.currentTarget.style.color = '#0f172a'; }}
                              >
                                {article.title}
                              </a>
                              <p style={{ margin: '5px 0 0', fontSize: '11px', color: '#94a3b8' }}>{article.pubDate}</p>
                            </div>
                          </div>
                        ))}
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
