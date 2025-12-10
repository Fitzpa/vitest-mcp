import { describe, it, expect } from 'vitest';

describe('Timezone Configuration', () => {
  it('should run tests in America/Chicago timezone', () => {
    // Get the timezone from the environment or from a Date object
    const timezone = process.env.TZ;
    expect(timezone).toBe('America/Chicago');
  });

  it('should format dates in Chicago timezone', () => {
    // Create a specific date and check the timezone offset
    // Chicago is UTC-6 (CST) or UTC-5 (CDT) depending on DST
    const date = new Date('2024-01-15T12:00:00Z'); // Winter, should be CST (UTC-6)
    const options: Intl.DateTimeFormatOptions = { 
      timeZone: 'America/Chicago',
      hour: 'numeric',
      hour12: false
    };
    const chicagoHour = new Intl.DateTimeFormat('en-US', options).format(date);
    
    // At noon UTC in January, it should be 6 AM in Chicago (CST, UTC-6)
    expect(chicagoHour).toBe('6');
  });

  it('should have consistent timezone across test runs', () => {
    // Verify the TZ environment variable is set
    expect(process.env.TZ).toBeDefined();
    expect(process.env.TZ).toBe('America/Chicago');
    
    // Additional verification using Intl API
    const resolvedOptions = Intl.DateTimeFormat().resolvedOptions();
    // When TZ is set to America/Chicago, the timeZone should reflect that
    expect(resolvedOptions.timeZone).toBe('America/Chicago');
  });
});
