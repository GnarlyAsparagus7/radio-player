export interface Station {
  name: string;
  url: string;
  favicon: string;
  tags?: string;
  bitrate?: number;
  codec?: string;
  country?: string;
  language?: string;
  votes?: number;
  clickcount?: number;
}