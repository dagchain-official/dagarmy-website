"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";


const techCategories = [
  { 
    name: "Artificial Intelligence", 
    keywords: "Machine Learning OR Artificial Intelligence OR Deep Learning OR Neural Networks OR NLP OR Computer Vision OR AI Engineer",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 1 4 4v1a4 4 0 0 1-4 4 4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z"/>
        <path d="M8 11v2a4 4 0 0 0 8 0v-2"/>
        <path d="M12 17v5"/>
        <path d="M8 22h8"/>
        <path d="M4 9H2"/><path d="M22 9h-2"/>
        <path d="M4 15H2"/><path d="M22 15h-2"/>
      </svg>
    )
  },
  { 
    name: "Blockchain", 
    keywords: "Blockchain OR Web3 OR Smart Contracts OR Solidity OR Ethereum OR Cryptocurrency OR DeFi OR NFT",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="6" height="6" rx="1"/>
        <rect x="16" y="7" width="6" height="6" rx="1"/>
        <rect x="9" y="2" width="6" height="6" rx="1"/>
        <rect x="9" y="16" width="6" height="6" rx="1"/>
        <path d="M8 10h8"/><path d="M12 8v8"/>
      </svg>
    )
  },
  { 
    name: "Data Visualization", 
    keywords: "Data Visualization OR Tableau OR Power BI OR Data Analytics OR Business Intelligence OR D3.js",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
        <line x1="2" y1="20" x2="22" y2="20"/>
      </svg>
    )
  }
];

const seniorityLevels = ["All Levels", "Entry level", "Mid-Senior level", "Senior level", "Executive"];
const jobTypes = ["All Types", "Full-time", "Part-time", "Remote", "Contract", "Internship"];

// Comprehensive country-city mapping
const locationData = {
  "Worldwide": [],
  "Remote": [],
  "United States": ["New York", "San Francisco", "Los Angeles", "Seattle", "Austin", "Boston", "Chicago", "Denver", "Atlanta", "Miami", "Washington DC", "San Diego", "Portland", "Dallas", "Houston", "Philadelphia", "Phoenix", "San Jose", "Detroit", "Minneapolis", "Raleigh", "Nashville", "Salt Lake City", "Pittsburgh", "Columbus"],
  "United Kingdom": ["London", "Manchester", "Edinburgh", "Birmingham", "Bristol", "Leeds", "Glasgow", "Liverpool", "Cambridge", "Oxford", "Brighton", "Nottingham", "Sheffield", "Newcastle", "Cardiff"],
  "Canada": ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Edmonton", "Winnipeg", "Quebec City", "Hamilton", "Kitchener", "Victoria", "Halifax"],
  "India": ["Bengaluru", "Mumbai", "Delhi", "Hyderabad", "Pune", "Chennai", "Kolkata", "Ahmedabad", "Gurugram", "Noida", "Jaipur", "Chandigarh", "Kochi", "Indore", "Coimbatore", "Visakhapatnam"],
  "Germany": ["Berlin", "Munich", "Frankfurt", "Hamburg", "Cologne", "Stuttgart", "Düsseldorf", "Dortmund", "Essen", "Leipzig", "Bremen", "Dresden", "Hanover", "Nuremberg"],
  "France": ["Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier", "Bordeaux", "Lille", "Rennes", "Grenoble"],
  "Netherlands": ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven", "Tilburg", "Groningen", "Almere", "Breda", "Nijmegen"],
  "Switzerland": ["Zurich", "Geneva", "Basel", "Bern", "Lausanne", "Lucerne", "Lugano", "St. Gallen"],
  "Sweden": ["Stockholm", "Gothenburg", "Malmö", "Uppsala", "Västerås", "Örebro", "Linköping", "Helsingborg"],
  "Ireland": ["Dublin", "Cork", "Limerick", "Galway", "Waterford", "Drogheda", "Dundalk"],
  "Spain": ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Málaga", "Murcia", "Palma", "Bilbao", "Alicante"],
  "Italy": ["Milan", "Rome", "Turin", "Naples", "Florence", "Bologna", "Venice", "Genoa", "Palermo", "Verona"],
  "Singapore": ["Singapore"],
  "Hong Kong": ["Hong Kong"],
  "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Canberra", "Gold Coast", "Newcastle", "Hobart"],
  "Japan": ["Tokyo", "Osaka", "Yokohama", "Nagoya", "Sapporo", "Fukuoka", "Kobe", "Kyoto", "Kawasaki", "Hiroshima"],
  "South Korea": ["Seoul", "Busan", "Incheon", "Daegu", "Daejeon", "Gwangju", "Suwon", "Ulsan"],
  "China": ["Shanghai", "Beijing", "Shenzhen", "Guangzhou", "Chengdu", "Hangzhou", "Wuhan", "Xi'an", "Nanjing", "Tianjin", "Suzhou", "Chongqing"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah"],
  "Israel": ["Tel Aviv", "Jerusalem", "Haifa", "Beersheba", "Netanya", "Herzliya"],
  "Brazil": ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza", "Belo Horizonte", "Manaus", "Curitiba", "Recife", "Porto Alegre"],
  "Mexico": ["Mexico City", "Guadalajara", "Monterrey", "Puebla", "Tijuana", "León", "Juárez", "Zapopan", "Querétaro"],
  "Argentina": ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata", "San Miguel de Tucumán", "Mar del Plata"],
  "Poland": ["Warsaw", "Kraków", "Wrocław", "Poznań", "Gdańsk", "Szczecin", "Bydgoszcz", "Lublin", "Katowice"],
  "Portugal": ["Lisbon", "Porto", "Braga", "Coimbra", "Funchal", "Setúbal", "Almada"],
  "Austria": ["Vienna", "Graz", "Linz", "Salzburg", "Innsbruck"],
  "Belgium": ["Brussels", "Antwerp", "Ghent", "Charleroi", "Liège", "Bruges", "Leuven"],
  "Denmark": ["Copenhagen", "Aarhus", "Odense", "Aalborg", "Esbjerg"],
  "Finland": ["Helsinki", "Espoo", "Tampere", "Vantaa", "Oulu", "Turku"],
  "Norway": ["Oslo", "Bergen", "Trondheim", "Stavanger", "Drammen"],
  "New Zealand": ["Auckland", "Wellington", "Christchurch", "Hamilton", "Tauranga", "Dunedin"],
  "South Africa": ["Johannesburg", "Cape Town", "Durban", "Pretoria", "Port Elizabeth", "Bloemfontein"]
};

const countries = Object.keys(locationData);

export default function JobsPanel() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(techCategories[0]);
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedCountry, setSelectedCountry] = useState("Worldwide");
  const [selectedCity, setSelectedCity] = useState("");
  const [availableCities, setAvailableCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Update available cities when country changes
  useEffect(() => {
    const cities = locationData[selectedCountry] || [];
    setAvailableCities(cities);
    setSelectedCity(""); // Reset city when country changes
  }, [selectedCountry]);

  // On mount / category change: try cache silently first, no spinner
  useEffect(() => {
    if (selectedCategory) {
      tryLoadFromCache();
    }
  }, [selectedCategory]);

  // Filter jobs based on local filters
  useEffect(() => {
    let filtered = jobs;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (job) =>
          job.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
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
  }, [searchQuery, selectedLevel, selectedType, jobs]);

  // Helper function to clean HTML and format text
  const cleanText = (text) => {
    if (!text) return '';
    // Remove HTML tags
    let cleaned = text.replace(/<[^>]*>/g, '');
    // Decode HTML entities
    cleaned = cleaned.replace(/&nbsp;/g, ' ');
    cleaned = cleaned.replace(/&amp;/g, '&');
    cleaned = cleaned.replace(/&lt;/g, '<');
    cleaned = cleaned.replace(/&gt;/g, '>');
    cleaned = cleaned.replace(/&quot;/g, '"');
    cleaned = cleaned.replace(/&#39;/g, "'");
    // Remove extra whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    return cleaned;
  };

  // Format description with proper paragraphs, bullets, and sections
  const formatDescription = (text) => {
    if (!text) return [];
    const cleaned = cleanText(text);
    
    const sections = [];
    
    // Split by section headers (case insensitive)
    const sectionRegex = /(Company Description|Job Description|About the job|Responsibilities:|Requirements:|Qualifications:|Basic Qualifications:|Preferred Qualifications:|Benefits:|What You'll Do:|What We're Looking For:|Skills:|Experience:|Overview:|About Us:|About the Role:)/gi;
    
    let parts = cleaned.split(sectionRegex);
    
    // Process sections
    if (parts.length > 1) {
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i].trim();
        if (!part) continue;
        
        // Check if this is a header
        if (sectionRegex.test(part)) {
          const nextContent = parts[i + 1]?.trim();
          if (nextContent) {
            sections.push({
              type: 'section',
              header: part,
              content: parseContent(nextContent)
            });
            i++; // Skip next part as we've processed it
          }
        } else if (i === 0) {
          // First part without header
          sections.push({
            type: 'section',
            header: null,
            content: parseContent(part)
          });
        }
      }
    } else {
      // No sections found, treat as single content
      sections.push({
        type: 'section',
        header: null,
        content: parseContent(cleaned)
      });
    }
    
    return sections;
  };

  // Parse content into paragraphs and bullet points
  const parseContent = (text) => {
    const items = [];
    
    // Split by double line breaks or sentence boundaries
    const paragraphs = text.split(/\n\n+/).map(p => p.trim()).filter(p => p);
    
    paragraphs.forEach(para => {
      // Check if it's a bullet list (starts with bullet points or numbers)
      const bulletMatch = para.match(/^[•\-\*\d+\.]\s/);
      
      if (bulletMatch || para.includes('\n• ') || para.includes('\n- ') || para.includes('\n* ')) {
        // Split into individual bullet points
        const bullets = para.split(/\n(?=[•\-\*\d+\.])/g)
          .map(b => b.replace(/^[•\-\*\d+\.]\s*/, '').trim())
          .filter(b => b.length > 0);
        
        if (bullets.length > 0) {
          items.push({ type: 'bullets', items: bullets });
        }
      } else {
        // Regular paragraph - split long text into sentences
        const sentences = para.split(/\.\s+(?=[A-Z])/).filter(s => s.trim().length > 0);
        
        if (sentences.length > 2) {
          // Multiple sentences - create separate paragraphs for readability
          sentences.forEach(sentence => {
            const trimmed = sentence.trim();
            if (trimmed.length > 20) {
              items.push({ type: 'paragraph', text: trimmed.endsWith('.') ? trimmed : trimmed + '.' });
            }
          });
        } else {
          // Short paragraph - keep as is
          items.push({ type: 'paragraph', text: para });
        }
      }
    });
    
    return items;
  };

  const buildLocationString = () => {
    if (selectedCountry === "Worldwide" || selectedCountry === "Remote") {
      return selectedCountry === "Remote" ? "Remote" : "";
    }
    return selectedCity ? `${selectedCity}, ${selectedCountry}` : selectedCountry;
  };

  const enrichJobs = (rawJobs) => rawJobs.map(job => ({
    ...job,
    category: selectedCategory.name,
    type: job.location?.toLowerCase().includes('remote') ? 'Remote' : 'Full-time',
  }));

  // Silent cache-only load — no spinner, instant if cached, silent if not
  // If cached jobs have no logos (stale data), flush and re-scrape fresh
  const tryLoadFromCache = async () => {
    try {
      const keywords = encodeURIComponent(selectedCategory.keywords);
      const location = encodeURIComponent(buildLocationString());
      const response = await fetch(`/api/scrape-jobs?keywords=${keywords}&location=${location}&pages=2`);
      const data = await response.json();
      if (data.success && data.jobs.length > 0) {
        // If cached data has no logos (stale), flush and re-fetch fresh
        const hasLogos = data.jobs.some(j => j.companyLogo);
        if (!hasLogos) {
          await fetch('/api/scrape-jobs', { method: 'DELETE' });
          const fresh = await fetch(`/api/scrape-jobs?keywords=${keywords}&location=${location}&pages=2`);
          const freshData = await fresh.json();
          if (freshData.success && freshData.jobs.length > 0) {
            setJobs(enrichJobs(freshData.jobs));
            setFilteredJobs(enrichJobs(freshData.jobs));
            setHasSearched(true);
          }
          return;
        }
        setJobs(enrichJobs(data.jobs));
        setFilteredJobs(enrichJobs(data.jobs));
        setHasSearched(true);
      }
    } catch {}
  };

  // Full scrape — triggered only by explicit Search button click
  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const keywords = encodeURIComponent(selectedCategory.keywords);
      const location = encodeURIComponent(buildLocationString());
      const response = await fetch(`/api/scrape-jobs?keywords=${keywords}&location=${location}&pages=2`);
      const data = await response.json();
      if (data.success && data.jobs.length > 0) {
        setJobs(enrichJobs(data.jobs));
        setFilteredJobs(enrichJobs(data.jobs));
      } else {
        setJobs([]);
        setFilteredJobs([]);
      }
    } catch (error) {
      console.error('Error searching jobs:', error);
      alert('Failed to search jobs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Neumorphic helpers ── */
  const nm = {
    bg: '#eef0f5',
    shadow: '8px 8px 20px rgba(166,180,200,0.55), -8px -8px 20px rgba(255,255,255,0.95)',
    shadowSm: '4px 4px 10px rgba(166,180,200,0.5), -4px -4px 10px rgba(255,255,255,0.9)',
    shadowInset: 'inset 4px 4px 10px rgba(166,180,200,0.5), inset -4px -4px 10px rgba(255,255,255,0.9)',
    shadowHover: '12px 12px 28px rgba(166,180,200,0.65), -12px -12px 28px rgba(255,255,255,0.98)',
  };

  const NmCard = ({ children, style = {}, hover = true, onClick }) => (
    <div
      onClick={onClick}
      style={{
        background: nm.bg,
        borderRadius: '18px',
        boxShadow: nm.shadow,
        transition: 'box-shadow 0.25s, transform 0.25s',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      onMouseEnter={hover ? e => {
        e.currentTarget.style.boxShadow = nm.shadowHover;
        e.currentTarget.style.transform = 'translateY(-3px)';
      } : undefined}
      onMouseLeave={hover ? e => {
        e.currentTarget.style.boxShadow = nm.shadow;
        e.currentTarget.style.transform = 'translateY(0)';
      } : undefined}
    >
      {children}
    </div>
  );

  return (
    <section style={{ background: nm.bg, minHeight: '100vh', paddingTop: '56px', paddingBottom: '64px' }}>
      <div className="tf-container">

        {/* ── Page Header ── */}
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 18px', borderRadius: '20px', marginBottom: '16px',
            background: nm.bg, boxShadow: nm.shadowSm,
            fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
            Tech Career Board
          </div>
          <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a', margin: '0 0 10px', letterSpacing: '-0.8px' }}>
            Find Your Dream Tech Job
          </h2>
          <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>
            Search for opportunities in AI, Blockchain, and Data Visualization
          </p>
        </div>

        <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>

          {/* ── Left Sidebar ── */}
          <div style={{ width: '270px', flexShrink: 0, position: 'sticky', top: '100px' }}>
            <NmCard hover={false} style={{ padding: '24px' }}>

              {/* Search */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>Search</label>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '11px 14px', borderRadius: '12px',
                  boxShadow: nm.shadowInset, background: nm.bg,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input
                    type="text"
                    placeholder="Job title, company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', color: '#0f172a' }}
                  />
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', background: 'rgba(148,163,184,0.2)', margin: '0 0 24px' }} />

              {/* Categories */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>Category</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {techCategories.map((cat) => {
                    const active = selectedCategory.name === cat.name;
                    return (
                      <button
                        key={cat.name}
                        onClick={() => setSelectedCategory(cat)}
                        style={{
                          padding: '11px 14px',
                          borderRadius: '12px', border: 'none', textAlign: 'left',
                          cursor: 'pointer', transition: 'all 0.2s',
                          display: 'flex', alignItems: 'center', gap: '10px',
                          fontSize: '13px', fontWeight: active ? '700' : '500',
                          color: active ? '#0f172a' : '#475569',
                          background: nm.bg,
                          boxShadow: active ? nm.shadowInset : nm.shadowSm,
                        }}
                      >
                        <span style={{ opacity: active ? 1 : 0.5 }}>{cat.icon}</span>
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ height: '1px', background: 'rgba(148,163,184,0.2)', margin: '0 0 24px' }} />

              {/* Country */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>Country</label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    style={{
                      width: '100%', padding: '11px 14px', borderRadius: '12px',
                      border: 'none', outline: 'none',
                      boxShadow: nm.shadowInset, background: nm.bg,
                      fontSize: '13px', color: '#0f172a', cursor: 'pointer', appearance: 'none',
                    }}
                  >
                    {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <svg style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>

              {/* City */}
              {availableCities.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>City</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      style={{
                        width: '100%', padding: '11px 14px', borderRadius: '12px',
                        border: 'none', outline: 'none',
                        boxShadow: nm.shadowInset, background: nm.bg,
                        fontSize: '13px', color: '#0f172a', cursor: 'pointer', appearance: 'none',
                      }}
                    >
                      <option value="">All Cities</option>
                      {availableCities.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <svg style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>
              )}

              {/* Seniority */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>Seniority</label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    style={{
                      width: '100%', padding: '11px 14px', borderRadius: '12px',
                      border: 'none', outline: 'none',
                      boxShadow: nm.shadowInset, background: nm.bg,
                      fontSize: '13px', color: '#0f172a', cursor: 'pointer', appearance: 'none',
                    }}
                  >
                    {seniorityLevels.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <svg style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>

              {/* Job Type */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>Job Type</label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    style={{
                      width: '100%', padding: '11px 14px', borderRadius: '12px',
                      border: 'none', outline: 'none',
                      boxShadow: nm.shadowInset, background: nm.bg,
                      fontSize: '13px', color: '#0f172a', cursor: 'pointer', appearance: 'none',
                    }}
                  >
                    {jobTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <svg style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                disabled={isLoading}
                style={{
                  width: '100%', padding: '13px', borderRadius: '14px',
                  border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer',
                  background: nm.bg,
                  boxShadow: isLoading ? nm.shadowInset : nm.shadow,
                  fontSize: '13px', fontWeight: '700', color: isLoading ? '#94a3b8' : '#0f172a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.boxShadow = nm.shadowHover; } }}
                onMouseLeave={e => { if (!isLoading) { e.currentTarget.style.boxShadow = nm.shadow; } }}
              >
                {isLoading ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    Searching...
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    Search Jobs
                  </>
                )}
              </button>
            </NmCard>
          </div>

          {/* ── Right: Job Listings ── */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Results bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  background: nm.bg, boxShadow: nm.shadowSm,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569',
                }}>
                  {selectedCategory.icon}
                </div>
                <div>
                  <div style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>{selectedCategory.name} Jobs</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '1px' }}>
                    {filteredJobs.length} position{filteredJobs.length !== 1 ? 's' : ''} found
                  </div>
                </div>
              </div>
              {isLoading && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 16px', borderRadius: '10px',
                  background: nm.bg, boxShadow: nm.shadowSm,
                  fontSize: '12px', color: '#64748b', fontWeight: '600',
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  Loading...
                </div>
              )}
            </div>

            {/* Job cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredJobs.map((job, index) => (
                <NmCard
                  key={job.id}
                  style={{ padding: '24px' }}
                >
                  <div style={{ display: 'flex', gap: '18px' }}>
                    {/* Company logo */}
                    <div style={{
                      width: '52px', height: '52px', borderRadius: '14px', flexShrink: 0,
                      background: '#ffffff', boxShadow: nm.shadowSm,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      overflow: 'hidden', padding: '8px',
                    }}>
                      {job.companyLogo ? (
                        <img
                          src={job.companyLogo}
                          alt={job.company}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.insertAdjacentHTML('afterend', `<span style="font-size:18px;font-weight:800;color:#475569">${job.company?.charAt(0) || 'C'}</span>`);
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '18px', fontWeight: '800', color: '#475569' }}>{job.company?.charAt(0) || 'C'}</span>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Company + date */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{job.company}</span>
                        {job.postedDate && (
                          <span style={{
                            fontSize: '11px', fontWeight: '600', color: '#94a3b8',
                            padding: '3px 10px', borderRadius: '20px',
                            background: nm.bg, boxShadow: nm.shadowSm,
                          }}>{job.postedDate}</span>
                        )}
                      </div>

                      {/* Title */}
                      <h4 style={{ margin: '0 0 10px', fontSize: '17px', fontWeight: '800', color: '#0f172a', lineHeight: '1.3' }}>
                        {cleanText(job.jobTitle)}
                      </h4>

                      {/* Meta chips */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                        {job.location && (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                            fontSize: '12px', fontWeight: '600', color: '#475569',
                            padding: '4px 12px', borderRadius: '20px',
                            background: nm.bg, boxShadow: nm.shadowSm,
                          }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            {cleanText(job.location)}
                          </span>
                        )}
                        {job.level && (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                            fontSize: '12px', fontWeight: '600', color: '#475569',
                            padding: '4px 12px', borderRadius: '20px',
                            background: nm.bg, boxShadow: nm.shadowSm,
                          }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                            {cleanText(job.level)}
                          </span>
                        )}
                        {job.type && (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                            fontSize: '12px', fontWeight: '600', color: '#475569',
                            padding: '4px 12px', borderRadius: '20px',
                            background: nm.bg, boxShadow: nm.shadowSm,
                          }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                            {job.type}
                          </span>
                        )}
                      </div>

                      {/* Description preview */}
                      <p style={{
                        fontSize: '13px', lineHeight: '1.6', color: '#64748b',
                        margin: '0 0 18px',
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>
                        {cleanText(job.description)}
                      </p>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedJob(job); }}
                          style={{
                            flex: 1, padding: '11px 16px', borderRadius: '12px', border: 'none',
                            background: nm.bg, boxShadow: nm.shadowSm,
                            fontSize: '13px', fontWeight: '700', color: '#475569', cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.boxShadow = nm.shadow; e.currentTarget.style.color = '#0f172a'; }}
                          onMouseLeave={e => { e.currentTarget.style.boxShadow = nm.shadowSm; e.currentTarget.style.color = '#475569'; }}
                        >
                          View Details
                        </button>
                        <Link
                          href={job.jobUrl}
                          target="_blank"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            flex: 1, padding: '11px 16px', borderRadius: '12px',
                            background: 'linear-gradient(135deg, #60a5fa 0%, #818cf8 50%, #a78bfa 100%)',
                            boxShadow: '6px 6px 14px rgba(96,165,250,0.3), -2px -2px 8px rgba(255,255,255,0.7)',
                            fontSize: '13px', fontWeight: '700', color: '#fff',
                            textDecoration: 'none', textAlign: 'center',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '8px 8px 20px rgba(96,165,250,0.45), -2px -2px 10px rgba(255,255,255,0.8)'; }}
                          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '6px 6px 14px rgba(96,165,250,0.3), -2px -2px 8px rgba(255,255,255,0.7)'; }}
                        >
                          Apply Now
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </NmCard>
              ))}
            </div>

            {/* Empty / Initial state */}
            {filteredJobs.length === 0 && !isLoading && (
              <NmCard hover={false} style={{ padding: '60px 32px', textAlign: 'center' }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '22px', margin: '0 auto 20px',
                  background: nm.bg, boxShadow: nm.shadow,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#94a3b8',
                }}>
                  <div style={{ transform: 'scale(1.6)' }}>{selectedCategory.icon}</div>
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px' }}>
                  {hasSearched ? 'No jobs found' : `Ready to find ${selectedCategory.name} jobs?`}
                </h4>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                  {hasSearched
                    ? 'Try adjusting your filters or search in a different location'
                    : 'Click "Search Jobs" to find live opportunities from LinkedIn'}
                </p>
              </NmCard>
            )}
          </div>
        </div>
      </div>

      {/* ── Job Detail Modal ── */}
      {selectedJob && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setSelectedJob(null)}
        >
          <div
            style={{
              background: nm.bg,
              borderRadius: '24px',
              boxShadow: '24px 24px 60px rgba(166,180,200,0.65), -24px -24px 60px rgba(255,255,255,0.98)',
              maxWidth: '780px', width: '100%', maxHeight: '90vh',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div style={{ padding: '28px 32px 24px', borderBottom: '1px solid rgba(148,163,184,0.15)', flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
                {/* Logo */}
                <div style={{
                  width: '60px', height: '60px', borderRadius: '14px', flexShrink: 0,
                  background: '#ffffff', boxShadow: nm.shadowSm,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', padding: '8px',
                }}>
                  {selectedJob.companyLogo ? (
                    <img
                      src={selectedJob.companyLogo}
                      alt={selectedJob.company}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.insertAdjacentHTML('afterend', `<span style="font-size:22px;font-weight:800;color:#475569">${selectedJob.company?.charAt(0) || 'C'}</span>`);
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: '22px', fontWeight: '800', color: '#475569' }}>{selectedJob.company?.charAt(0) || 'C'}</span>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }}>{selectedJob.company}</div>
                  <h3 style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: '800', color: '#0f172a', lineHeight: '1.2' }}>{cleanText(selectedJob.jobTitle)}</h3>
                  {selectedJob.postedDate && <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Posted {selectedJob.postedDate}</p>}
                </div>

                {/* Close */}
                <button
                  onClick={() => setSelectedJob(null)}
                  style={{
                    width: '36px', height: '36px', borderRadius: '50%', border: 'none', flexShrink: 0,
                    background: nm.bg, boxShadow: nm.shadowSm,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#94a3b8', cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#0f172a'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              {/* Meta chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '18px' }}>
                {selectedJob.location && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: '600', color: '#475569', padding: '5px 13px', borderRadius: '20px', background: nm.bg, boxShadow: nm.shadowSm }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {cleanText(selectedJob.location)}
                  </span>
                )}
                {selectedJob.level && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: '600', color: '#475569', padding: '5px 13px', borderRadius: '20px', background: nm.bg, boxShadow: nm.shadowSm }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                    {cleanText(selectedJob.level)}
                  </span>
                )}
                {selectedJob.type && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: '600', color: '#475569', padding: '5px 13px', borderRadius: '20px', background: nm.bg, boxShadow: nm.shadowSm }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                    {selectedJob.type}
                  </span>
                )}
                {selectedJob.category && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: '600', color: '#475569', padding: '5px 13px', borderRadius: '20px', background: nm.bg, boxShadow: nm.shadowSm }}>
                    {selectedJob.category}
                  </span>
                )}
              </div>
            </div>

            {/* Description body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
              <div style={{
                background: nm.bg, borderRadius: '16px',
                boxShadow: nm.shadowInset,
                padding: '24px',
              }}>
                <h5 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '3px', height: '18px', background: '#0f172a', borderRadius: '2px' }} />
                  About the job
                </h5>
                <div style={{ fontSize: '14px', lineHeight: '1.75', color: '#374151' }}>
                  {formatDescription(selectedJob.description).map((section, si) => (
                    <div key={si} style={{ marginBottom: '28px' }}>
                      {section.header && (
                        <h6 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '12px', marginTop: si > 0 ? '4px' : '0' }}>
                          {section.header}
                        </h6>
                      )}
                      {section.content && section.content.map((item, ii) => {
                        if (item.type === 'paragraph') return (
                          <p key={ii} style={{ marginBottom: '12px', color: '#374151', lineHeight: '1.75', fontSize: '14px' }}>{item.text}</p>
                        );
                        if (item.type === 'bullets') return (
                          <ul key={ii} style={{ marginBottom: '12px', paddingLeft: '18px', listStyleType: 'disc' }}>
                            {item.items.map((b, bi) => (
                              <li key={bi} style={{ marginBottom: '6px', color: '#374151', lineHeight: '1.75', fontSize: '14px' }}>{b}</li>
                            ))}
                          </ul>
                        );
                        return null;
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div style={{ padding: '20px 32px 28px', borderTop: '1px solid rgba(148,163,184,0.15)', flexShrink: 0, display: 'flex', gap: '12px' }}>
              <Link
                href={selectedJob.jobUrl}
                target="_blank"
                style={{
                  flex: 1, padding: '14px 24px', borderRadius: '14px',
                  background: 'linear-gradient(135deg, #60a5fa 0%, #818cf8 50%, #a78bfa 100%)',
                  boxShadow: '6px 6px 16px rgba(96,165,250,0.35), -2px -2px 8px rgba(255,255,255,0.7)',
                  fontSize: '14px', fontWeight: '700', color: '#fff',
                  textDecoration: 'none', textAlign: 'center',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '8px 8px 22px rgba(96,165,250,0.5), -2px -2px 10px rgba(255,255,255,0.8)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '6px 6px 16px rgba(96,165,250,0.35), -2px -2px 8px rgba(255,255,255,0.7)'; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                Apply on LinkedIn
              </Link>
              <button
                onClick={() => setSelectedJob(null)}
                style={{
                  padding: '14px 28px', borderRadius: '14px', border: 'none',
                  background: nm.bg, boxShadow: nm.shadowSm,
                  fontSize: '14px', fontWeight: '700', color: '#475569', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = nm.shadow; e.currentTarget.style.color = '#0f172a'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = nm.shadowSm; e.currentTarget.style.color = '#475569'; }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
