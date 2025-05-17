import type { Threat } from '../types/threats';

class ThreatService {
  private baseUrl: string;

  constructor() {
    // For GitHub Pages hosting, use the relative path to the JSON file
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? `${process.env.PUBLIC_URL || ''}/data` 
      : '/data';
  }

  /**
   * Fetches all threats from the database
   */
  async getAllThreats(): Promise<Threat[]> {
    try {
      const response = await fetch(`${this.baseUrl}/threats.json`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch threats: ${response.statusText}`);
      }
      
      const threats = await response.json();
      return threats;
    } catch (error) {
      console.error('Error fetching threats:', error);
      throw error;
    }
  }

  /**
   * Get threat counts by severity
   */
  getThreatCountsBySeverity(threats: Threat[]): Record<string, number> {
    return threats.reduce((counts, threat) => {
      const severity = threat.severity;
      counts[severity] = (counts[severity] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
  }

  /**
   * Filter threats based on search term and severity
   */
  filterThreats(
    threats: Threat[], 
    searchTerm: string, 
    severityFilter: string
  ): Threat[] {
    return threats.filter(
      (threat) =>
        (severityFilter === "All" || threat.severity === severityFilter) &&
        (
          threat.names.some(name => name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          threat.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          threat.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (threat.stolen_mod && threat.stolen_mod.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (threat.stolen_mod_link && threat.stolen_mod_link.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (threat.triggered_rules && threat.triggered_rules.some(rule => 
            rule.toLowerCase().includes(searchTerm.toLowerCase())
          ))
        )
    );
  }
}

export const threatService = new ThreatService(); 