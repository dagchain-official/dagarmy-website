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
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 16v-4"/>
        <path d="M12 8h.01"/>
      </svg>
    )
  },
  { 
    name: "Blockchain", 
    keywords: "Blockchain OR Web3 OR Smart Contracts OR Solidity OR Ethereum OR Cryptocurrency OR DeFi OR NFT",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
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

  // Auto-search when category changes
  useEffect(() => {
    if (selectedCategory) {
      handleSearch();
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

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const keywords = encodeURIComponent(selectedCategory.keywords);
      // Construct location string from country and city
      let locationString = "";
      if (selectedCountry === "Worldwide" || selectedCountry === "Remote") {
        locationString = selectedCountry === "Remote" ? "Remote" : "";
      } else if (selectedCity) {
        locationString = `${selectedCity}, ${selectedCountry}`;
      } else {
        locationString = selectedCountry;
      }
      const location = encodeURIComponent(locationString);
      const response = await fetch(`/api/scrape-jobs?keywords=${keywords}&location=${location}&pages=5`);
      const data = await response.json();
      
      if (data.success && data.jobs.length > 0) {
        const enrichedJobs = data.jobs.map(job => ({
          ...job,
          category: selectedCategory.name,
          type: job.location?.toLowerCase().includes('remote') ? 'Remote' : 'Full-time',
        }));
        
        setJobs(enrichedJobs);
        setFilteredJobs(enrichedJobs);
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

  return (
    <section className="tf-spacing-1" style={{ background: '#f9fafb', minHeight: '100vh', paddingTop: '40px' }}>
      <div className="tf-container">
        {/* Header */}
        <div className="text-center mb-5 wow fadeInUp">
          <h2 className="font-cardo fw-7 mb-2" style={{ fontFamily: 'Nasalization, sans-serif' }}>Find Your Dream Tech Job</h2>
          <p className="fs-16 text-muted">
            Search for opportunities in AI, Blockchain, and Data Visualization
          </p>
        </div>

        <div className="row g-4">
          {/* Left Sidebar - Filters */}
          <div className="col-lg-3">
            <div style={{ position: 'sticky', top: '100px' }}>
              {/* Search Box */}
              <div className="mb-4 wow fadeInUp">
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  background: '#fff'
                }}>
                  <i className="icon-search" style={{ color: '#6b7280', fontSize: '18px' }} />
                  <input
                    type="text"
                    placeholder="Search jobs..."
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

              {/* Tech Categories */}
              <div className="mb-4 wow fadeInUp">
                <h5 className="fw-6 mb-3">Tech Categories</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {techCategories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        padding: '12px 16px',
                        border: selectedCategory.name === cat.name ? '2px solid #000000' : '1px solid #e5e7eb',
                        borderRadius: '8px',
                        background: selectedCategory.name === cat.name ? '#000000' : '#fff',
                        color: selectedCategory.name === cat.name ? '#ffffff' : '#1f2937',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontSize: '14px',
                        fontWeight: selectedCategory.name === cat.name ? '600' : '500'
                      }}
                    >
                      <span style={{ marginRight: '8px', display: 'inline-flex', alignItems: 'center' }}>{cat.icon}</span>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Filter - Country */}
              <div className="mb-4 wow fadeInUp">
                <h5 className="fw-6 mb-3">Country</h5>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
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
                  {countries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              {/* Location Filter - City (conditional) */}
              {availableCities.length > 0 && (
                <div className="mb-4 wow fadeInUp">
                  <h5 className="fw-6 mb-3">City (Optional)</h5>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
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
                    <option value="">All Cities in {selectedCountry}</option>
                    {availableCities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Seniority Level */}
              <div className="mb-4 wow fadeInUp">
                <h5 className="fw-6 mb-3">Seniority Level</h5>
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

              {/* Job Type */}
              <div className="mb-4 wow fadeInUp">
                <h5 className="fw-6 mb-3">Job Type</h5>
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

              {/* Search Button */}
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="tf-btn w-100"
                style={{
                  background: isLoading ? '#9ca3af' : '#1f2937',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                {isLoading ? 'Searching...' : 'Search Jobs'}
              </button>
            </div>
          </div>

          {/* Right Content - Job Listings */}
          <div className="col-lg-9">
            {/* Results Header */}
            <div className="mb-4 d-flex justify-content-between align-items-center wow fadeInUp">
              <div>
                <h4 className="fw-6 mb-1" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', color: '#1f2937' }}>{selectedCategory.icon}</span>
                  {selectedCategory.name} Jobs
                </h4>
                <p className="fs-14 text-muted mb-0">
                  {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
                </p>
              </div>
              {isLoading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="spinner-border spinner-border-sm text-primary" role="status" />
                  <span className="fs-14 text-muted">Loading jobs...</span>
                </div>
              )}
            </div>

            {/* Jobs List - Professional Design */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {filteredJobs.map((job, index) => (
                <div
                  key={job.id}
                  className="wow fadeInUp"
                  data-wow-delay={`${index * 0.05}s`}
                  style={{
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ padding: '24px' }}>
                    {/* Header with Logo */}
                    <div className="d-flex gap-3 mb-3">
                      {/* Company Logo */}
                      <div
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '12px',
                          border: '1px solid #f3f4f6',
                          background: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}
                      >
                        {job.companyLogo ? (
                          <img
                            src={job.companyLogo}
                            alt={job.company}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              padding: '8px'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = `<div style="font-size: 24px; font-weight: 700; color: #1f2937;">${job.company?.charAt(0) || 'C'}</div>`;
                            }}
                          />
                        ) : (
                          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                            {job.company?.charAt(0) || 'C'}
                          </div>
                        )}
                      </div>

                      {/* Job Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h5 className="fw-6 mb-1" style={{ fontSize: '14px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {job.company}
                        </h5>
                        <h4 className="fw-6 mb-2" style={{ fontSize: '20px', lineHeight: '1.3', color: '#111827', marginTop: '4px' }}>
                          {cleanText(job.jobTitle)}
                        </h4>
                        <div className="d-flex flex-wrap gap-2">
                          <span
                            style={{
                              background: '#f3f4f6',
                              color: '#1f2937',
                              padding: '4px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}
                          >
                            {job.category}
                          </span>
                          <span
                            style={{
                              background: '#e5e7eb',
                              color: '#111827',
                              padding: '4px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}
                          >
                            {job.type}
                          </span>
                          <span
                            style={{
                              background: '#f9fafb',
                              color: '#4b5563',
                              padding: '4px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}
                          >
                            {job.postedDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Location & Level */}
                    <div className="d-flex flex-wrap gap-4 mb-3" style={{ paddingLeft: '76px' }}>
                      {job.location && (
                        <div className="d-flex align-items-center gap-2">
                          <i className="flaticon-location" style={{ fontSize: '16px', color: '#1f2937' }} />
                          <span style={{ fontSize: '14px', color: '#4b5563' }}>
                            {cleanText(job.location)}
                          </span>
                        </div>
                      )}
                      {job.level && (
                        <div className="d-flex align-items-center gap-2">
                          <i className="flaticon-user-1" style={{ fontSize: '16px', color: '#1f2937' }} />
                          <span style={{ fontSize: '14px', color: '#4b5563' }}>
                            {cleanText(job.level)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Description Preview */}
                    <p
                      style={{
                        fontSize: '14px',
                        lineHeight: '1.6',
                        color: '#6b7280',
                        marginBottom: '20px',
                        paddingLeft: '76px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {cleanText(job.description)}
                    </p>

                    {/* Action Buttons */}
                    <div className="d-flex gap-3" style={{ paddingLeft: '76px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedJob(job);
                        }}
                        style={{
                          flex: 1,
                          padding: '12px 20px',
                          borderRadius: '8px',
                          border: '2px solid #1f2937',
                          background: '#fff',
                          color: '#1f2937',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f3f4f6';
                          e.currentTarget.style.borderColor = '#000000';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#fff';
                          e.currentTarget.style.borderColor = '#1f2937';
                        }}
                      >
                        View Details
                      </button>
                      <Link
                        href={job.jobUrl}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          flex: 1,
                          padding: '12px 20px',
                          borderRadius: '8px',
                          background: '#000000',
                          color: '#fff',
                          fontSize: '14px',
                          fontWeight: '600',
                          textDecoration: 'none',
                          textAlign: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          transition: 'all 0.3s',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
                          e.currentTarget.style.background = '#1f2937';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                          e.currentTarget.style.background = '#000000';
                        }}
                      >
                        Apply Now
                        <i className="icon-arrow-top-right" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results / Initial State */}
            {filteredJobs.length === 0 && !isLoading && (
              <div className="text-center py-5 wow fadeInUp">
                {hasSearched ? (
                  <>
                    <h4 className="fw-6 mb-2">No jobs found</h4>
                    <p className="text-muted">Try adjusting your filters or search in a different location</p>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: '48px', marginBottom: '16px', display: 'flex', justifyContent: 'center', color: '#1f2937' }}>
                      <div style={{ transform: 'scale(2.4)' }}>{selectedCategory.icon}</div>
                    </div>
                    <h4 className="fw-6 mb-2">Ready to find {selectedCategory.name} jobs?</h4>
                    <p className="text-muted mb-3">Click "Search Jobs" to find opportunities from LinkedIn</p>
                  </>
                )}
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
            {/* Modal Header - Professional Design */}
            <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '24px', marginBottom: '24px' }}>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="d-flex gap-3" style={{ flex: 1 }}>
                  {/* Company Logo */}
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      background: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}
                  >
                    {selectedJob.companyLogo ? (
                      <img
                        src={selectedJob.companyLogo}
                        alt={selectedJob.company}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          padding: '12px'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `<div style="font-size: 28px; font-weight: 700; color: #1f2937;">${selectedJob.company?.charAt(0) || 'C'}</div>`;
                        }}
                      />
                    ) : (
                      <div style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937' }}>
                        {selectedJob.company?.charAt(0) || 'C'}
                      </div>
                    )}
                  </div>
                  
                  {/* Company & Job Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h5 className="fw-6 mb-1" style={{ fontSize: '14px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {selectedJob.company}
                    </h5>
                    <h3 className="fw-7 mb-2" style={{ fontSize: '24px', lineHeight: '1.2', color: '#111827' }}>
                      {cleanText(selectedJob.jobTitle)}
                    </h3>
                    <p className="text-muted mb-0" style={{ fontSize: '13px' }}>
                      Posted {selectedJob.postedDate}
                    </p>
                  </div>
                </div>
                
                {/* Close Button */}
                <button
                  onClick={() => setSelectedJob(null)}
                  style={{
                    background: '#f3f4f6',
                    border: 'none',
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#e5e7eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f3f4f6';
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Job Meta Info - Professional Cards */}
            <div className="mb-4" style={{ paddingBottom: '24px', borderBottom: '1px solid #e5e7eb' }}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
                    <div className="d-flex align-items-center gap-3">
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="flaticon-location" style={{ fontSize: '18px', color: '#fff' }} />
                      </div>
                      <div>
                        <p className="mb-0" style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>LOCATION</p>
                        <p className="mb-0" style={{ fontSize: '14px', color: '#111827', fontWeight: '600' }}>
                          {cleanText(selectedJob.location) || 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
                    <div className="d-flex align-items-center gap-3">
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="flaticon-user-1" style={{ fontSize: '18px', color: '#fff' }} />
                      </div>
                      <div>
                        <p className="mb-0" style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>SENIORITY LEVEL</p>
                        <p className="mb-0" style={{ fontSize: '14px', color: '#111827', fontWeight: '600' }}>
                          {cleanText(selectedJob.level) || 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <span style={{ background: '#f3f4f6', color: '#1f2937', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600' }}>
                  {selectedJob.category}
                </span>
                <span style={{ background: '#e5e7eb', color: '#111827', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600' }}>
                  {selectedJob.type}
                </span>
              </div>
            </div>

            {/* Job Description - LinkedIn-Style Layout */}
            <div className="mb-4">
              <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h5 className="fw-6 mb-3" style={{ fontSize: '18px', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '4px', height: '24px', background: '#1f2937', borderRadius: '2px' }}></div>
                  About the job
                </h5>
                <div style={{ 
                  fontSize: '15px', 
                  lineHeight: '1.7', 
                  color: '#374151',
                  maxHeight: '500px',
                  overflowY: 'auto',
                  paddingRight: '12px',
                  background: '#fff',
                  padding: '24px',
                  borderRadius: '8px'
                }}>
                  {formatDescription(selectedJob.description).map((section, sectionIndex) => (
                    <div key={sectionIndex} style={{ marginBottom: '32px' }}>
                      {section.header && (
                        <h6 style={{ 
                          fontSize: '16px', 
                          fontWeight: '700', 
                          color: '#111827',
                          marginBottom: '16px',
                          marginTop: sectionIndex > 0 ? '8px' : '0'
                        }}>
                          {section.header}
                        </h6>
                      )}
                      
                      {section.content && section.content.map((item, itemIndex) => {
                        if (item.type === 'paragraph') {
                          return (
                            <p 
                              key={itemIndex} 
                              style={{ 
                                marginBottom: '16px', 
                                color: '#374151', 
                                lineHeight: '1.7',
                                fontSize: '15px'
                              }}
                            >
                              {item.text}
                            </p>
                          );
                        } else if (item.type === 'bullets') {
                          return (
                            <ul 
                              key={itemIndex} 
                              style={{ 
                                marginBottom: '16px',
                                paddingLeft: '20px',
                                listStyleType: 'disc'
                              }}
                            >
                              {item.items.map((bullet, bulletIndex) => (
                                <li 
                                  key={bulletIndex}
                                  style={{
                                    marginBottom: '8px',
                                    color: '#374151',
                                    lineHeight: '1.7',
                                    fontSize: '15px'
                                  }}
                                >
                                  {bullet}
                                </li>
                              ))}
                            </ul>
                          );
                        }
                        return null;
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer - Professional Actions */}
            <div style={{ paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
              <div className="d-flex gap-3">
                <Link
                  href={selectedJob.jobUrl}
                  target="_blank"
                  style={{
                    flex: 1,
                    padding: '16px 32px',
                    borderRadius: '10px',
                    background: '#000000',
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)';
                    e.currentTarget.style.background = '#1f2937';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
                    e.currentTarget.style.background = '#000000';
                  }}
                >
                  <i className="icon-arrow-top-right" />
                  Apply on LinkedIn
                </Link>
                <button
                  onClick={() => setSelectedJob(null)}
                  style={{
                    padding: '16px 32px',
                    borderRadius: '10px',
                    background: '#f3f4f6',
                    color: '#4b5563',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#e5e7eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f3f4f6';
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
