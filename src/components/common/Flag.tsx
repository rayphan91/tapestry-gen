import React from 'react';
import * as Flags from 'country-flag-icons/react/1x1';

// Country name to ISO2 code mapping
const COUNTRY_TO_ISO2: Record<string, keyof typeof Flags> = {
  'Australia': 'AU',
  'New Zealand': 'NZ',
  'India': 'IN',
  'Pakistan': 'PK',
  'Bangladesh': 'BD',
  'Sri Lanka': 'LK',
  'Nepal': 'NP',
  'Fiji': 'FJ',
  'Papua New Guinea': 'PG',
  'United States': 'US',
  'Canada': 'CA',
  'Japan': 'JP',
  'South Korea': 'KR',
  'China': 'CN',
  'Taiwan': 'TW',
  'Hong Kong': 'HK',
  'Mongolia': 'MN',
  'United Kingdom': 'GB',
  'France': 'FR',
  'Germany': 'DE',
  'Thailand': 'TH',
  'Vietnam': 'VN',
  'Singapore': 'SG',
  'Malaysia': 'MY',
  'Philippines': 'PH',
  'Indonesia': 'ID',
  'Sweden': 'SE',
  'Norway': 'NO',
  'Finland': 'FI',
  'Denmark': 'DK',
  'Nigeria': 'NG',
  'Ghana': 'GH',
  'Senegal': 'SN',
  'Ivory Coast': 'CI',
  'Mali': 'ML',
  'Mexico': 'MX',
  'Brazil': 'BR',
  'Argentina': 'AR',
  'Chile': 'CL',
  'Colombia': 'CO',
  'Peru': 'PE',
  'Venezuela': 'VE',
  'Egypt': 'EG',
  'Morocco': 'MA',
  'Tunisia': 'TN',
  'Algeria': 'DZ',
  'Spain': 'ES',
  'Italy': 'IT',
  'Portugal': 'PT',
  'Netherlands': 'NL',
  'Belgium': 'BE',
  'Switzerland': 'CH',
  'Austria': 'AT',
  'Poland': 'PL',
  'Turkey': 'TR',
  'South Africa': 'ZA',
  'Kenya': 'KE',
  'Ethiopia': 'ET',
  'Israel': 'IL',
  'United Arab Emirates': 'AE',
  'Saudi Arabia': 'SA',
};

interface FlagProps {
  country: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Flag: React.FC<FlagProps> = ({ country, size = 16, className = '', style = {} }) => {
  const isoCode = COUNTRY_TO_ISO2[country];

  if (!isoCode) {
    // Fallback to first two letters if country not found
    console.warn(`Flag: No ISO code found for country "${country}"`);
    return (
      <div
        className={className}
        style={{
          width: size,
          height: size,
          background: '#ccc',
          borderRadius: '50%',
          display: 'inline-block',
          ...style
        }}
      />
    );
  }

  const FlagComponent = Flags[isoCode];

  if (!FlagComponent) {
    console.warn(`Flag: No flag component found for ISO code "${isoCode}"`);
    return (
      <div
        className={className}
        style={{
          width: size,
          height: size,
          background: '#ccc',
          borderRadius: '50%',
          display: 'inline-block',
          ...style
        }}
      />
    );
  }

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'inline-block',
        verticalAlign: 'middle',
        ...style
      }}
    >
      <FlagComponent
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      />
    </div>
  );
};
