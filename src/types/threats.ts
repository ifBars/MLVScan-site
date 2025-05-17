export interface Threat {
  id: number;
  names: string[];
  stolen_mod?: string;
  stolen_mod_link?: string;
  date: string;
  type: string;
  source: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  techniques: string[];
  hash: string;
  vt_link?: string;
  triggered_rules?: string[];
}

export type SeverityType = 'All' | 'Critical' | 'High' | 'Medium' | 'Low'; 