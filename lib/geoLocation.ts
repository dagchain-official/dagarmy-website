/**
 * Global-Ready Geo-Location Service
 * 
 * Requirements:
 * - Multi-source fallback strategy
 * - No default country assumptions
 * - VPN-aware location detection
 * - Validated responses only
 * - No global caching
 * - Religion-agnostic
 */

interface GeoLocationResult {
  country: string | null;
  countryCode: string | null;
  source: 'ipapi' | 'ipify' | 'cloudflare' | 'failed';
}

const TIMEOUT_MS = 5000;
const VALID_ISO_CODES = /^[A-Z]{2}$/;

/**
 * Validates geo-location response
 */
function isValidGeoResponse(country: string | null, countryCode: string | null): boolean {
  if (!country || !countryCode) return false;
  if (country.trim().length === 0) return false;
  if (!VALID_ISO_CODES.test(countryCode)) return false;
  return true;
}

/**
 * Primary: ipapi.co (free, reliable, VPN-aware)
 */
async function fetchFromIPAPI(): Promise<GeoLocationResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
    
    const response = await fetch('https://ipapi.co/json/', {
      signal: controller.signal,
      cache: 'no-store' // No caching
    });
    
    clearTimeout(timeoutId);
    
    if (response.status === 200) {
      const data = await response.json();
      
      if (isValidGeoResponse(data.country_name, data.country_code)) {
        return {
          country: data.country_name,
          countryCode: data.country_code,
          source: 'ipapi'
        };
      }
    }
  } catch (error) {
    // Silent fail, try next source
  }
  
  return { country: null, countryCode: null, source: 'failed' };
}

/**
 * Secondary: ipify + ipapi fallback
 */
async function fetchFromIPify(): Promise<GeoLocationResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
    
    // Get IP first
    const ipResponse = await fetch('https://api.ipify.org?format=json', {
      signal: controller.signal,
      cache: 'no-store'
    });
    
    if (ipResponse.status === 200) {
      const ipData = await ipResponse.json();
      
      // Use IP to get geo data
      const geoResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`, {
        signal: controller.signal,
        cache: 'no-store'
      });
      
      clearTimeout(timeoutId);
      
      if (geoResponse.status === 200) {
        const data = await geoResponse.json();
        
        if (isValidGeoResponse(data.country_name, data.country_code)) {
          return {
            country: data.country_name,
            countryCode: data.country_code,
            source: 'ipify'
          };
        }
      }
    }
    
    clearTimeout(timeoutId);
  } catch (error) {
    // Silent fail
  }
  
  return { country: null, countryCode: null, source: 'failed' };
}

/**
 * Tertiary: Cloudflare trace (edge-based, very reliable)
 */
async function fetchFromCloudflare(): Promise<GeoLocationResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
    
    const response = await fetch('https://www.cloudflare.com/cdn-cgi/trace', {
      signal: controller.signal,
      cache: 'no-store'
    });
    
    clearTimeout(timeoutId);
    
    if (response.status === 200) {
      const text = await response.text();
      const lines = text.split('\n');
      
      let countryCode: string | null = null;
      
      for (const line of lines) {
        if (line.startsWith('loc=')) {
          countryCode = line.split('=')[1].trim();
          break;
        }
      }
      
      if (countryCode && VALID_ISO_CODES.test(countryCode)) {
        // Convert country code to name (basic mapping)
        const countryName = getCountryName(countryCode);
        
        if (countryName) {
          return {
            country: countryName,
            countryCode: countryCode,
            source: 'cloudflare'
          };
        }
      }
    }
  } catch (error) {
    // Silent fail
  }
  
  return { country: null, countryCode: null, source: 'failed' };
}

/**
 * Basic ISO country code to name mapping
 */
function getCountryName(code: string): string | null {
  const countryMap: Record<string, string> = {
    'US': 'United States',
    'GB': 'United Kingdom',
    'CA': 'Canada',
    'AU': 'Australia',
    'IN': 'India',
    'DE': 'Germany',
    'FR': 'France',
    'JP': 'Japan',
    'CN': 'China',
    'BR': 'Brazil',
    'MX': 'Mexico',
    'ES': 'Spain',
    'IT': 'Italy',
    'NL': 'Netherlands',
    'SE': 'Sweden',
    'NO': 'Norway',
    'DK': 'Denmark',
    'FI': 'Finland',
    'PL': 'Poland',
    'RU': 'Russia',
    'KR': 'South Korea',
    'SG': 'Singapore',
    'MY': 'Malaysia',
    'TH': 'Thailand',
    'ID': 'Indonesia',
    'PH': 'Philippines',
    'VN': 'Vietnam',
    'AE': 'United Arab Emirates',
    'SA': 'Saudi Arabia',
    'ZA': 'South Africa',
    'NG': 'Nigeria',
    'EG': 'Egypt',
    'AR': 'Argentina',
    'CL': 'Chile',
    'CO': 'Colombia',
    'PE': 'Peru',
    'NZ': 'New Zealand',
    'IE': 'Ireland',
    'CH': 'Switzerland',
    'AT': 'Austria',
    'BE': 'Belgium',
    'PT': 'Portugal',
    'GR': 'Greece',
    'CZ': 'Czech Republic',
    'RO': 'Romania',
    'HU': 'Hungary',
    'TR': 'Turkey',
    'IL': 'Israel',
    'PK': 'Pakistan',
    'BD': 'Bangladesh',
    'LK': 'Sri Lanka',
    'NP': 'Nepal',
    'KE': 'Kenya',
    'GH': 'Ghana',
    'TZ': 'Tanzania',
    'UG': 'Uganda',
    'ET': 'Ethiopia',
    'MA': 'Morocco',
    'TN': 'Tunisia',
    'DZ': 'Algeria',
    'JO': 'Jordan',
    'LB': 'Lebanon',
    'KW': 'Kuwait',
    'QA': 'Qatar',
    'OM': 'Oman',
    'BH': 'Bahrain',
  };
  
  return countryMap[code] || null;
}

/**
 * Main geo-location function with multi-source fallback
 * 
 * @returns GeoLocationResult with country or null if all sources fail
 */
export async function detectUserCountry(): Promise<GeoLocationResult> {
  // Try primary source
  let result = await fetchFromIPAPI();
  if (result.country) return result;
  
  // Try secondary source
  result = await fetchFromIPify();
  if (result.country) return result;
  
  // Try tertiary source
  result = await fetchFromCloudflare();
  if (result.country) return result;
  
  // All sources failed - return null (no default)
  return {
    country: null,
    countryCode: null,
    source: 'failed'
  };
}

/**
 * Get neutral display text for UI
 */
export function getNeutralRegionText(): string {
  return 'your region';
}

/**
 * Get display text for country or neutral fallback
 */
export function getDisplayCountry(country: string | null): string {
  return country || getNeutralRegionText();
}
