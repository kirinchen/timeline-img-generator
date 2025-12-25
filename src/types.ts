export const Orientation ={
  Horizontal : 'Horizontal',
  Vertical : 'Vertical',
} as const;

export type Orientation = (typeof Orientation)[keyof typeof Orientation];

export const  TimeInterval ={
  Daily : 'Daily',
  Weekly : 'Weekly',
  Monthly : 'Monthly',
  Yearly : 'Yearly',
} as const;

export interface TimelineEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  description: string;
}
export type TimeInterval = (typeof TimeInterval)[keyof typeof TimeInterval];

export interface TimelineConfig {
  startDate: string;
  endDate: string;
  interval: TimeInterval;
  width: number;
  height: number;
  orientation: Orientation;
  themeColor: string;
  backgroundColor: string;
  fontSize: number;
  textColor: string;
}