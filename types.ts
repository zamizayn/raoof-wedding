
export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface RSVPData {
  name: string;
  attendance: 'yes' | 'no';
  guests: number;
  message: string;
}

export interface DuaResponse {
  dua: string;
  translation: string;
}

export interface GalleryImage {
  id?: string;
  url: string;
  caption?: string;
  category?: string;
}

export interface GuestbookMessage {
  id: string;
  name: string;
  message: string;
  date: string;
}

export interface JourneyMilestone {
  id: string;
  title: string;
  date: string;
  description: string;
  image: string;
}
