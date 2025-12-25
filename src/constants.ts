import { Orientation, TimeInterval, type TimelineConfig, type TimelineEvent } from './types';

export const DEFAULT_CONFIG: TimelineConfig = {
  startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0],
  endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
  interval: TimeInterval.Monthly,
  width: 1200,
  height: 600,
  orientation: Orientation.Horizontal,
  themeColor: '#3b82f6', // blue-500
  backgroundColor: '#ffffff',
  textColor: '#1e293b', // slate-800
  fontSize: 14,
};

export const SAMPLE_EVENTS: TimelineEvent[] = [
  {
    id: '1',
    date: new Date(new Date().setMonth(new Date().getMonth() - 4)).toISOString().split('T')[0],
    title: 'Project Kickoff',
    description: 'Initial team meeting and requirement gathering.',
  },
  {
    id: '2',
    date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    title: 'Design Phase',
    description: 'UI/UX mockups completed and approved.',
  },
  {
    id: '3',
    date: new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString().split('T')[0],
    title: 'Alpha Release',
    description: 'Internal testing of the MVP features.',
  },
  {
    id: '4',
    date: new Date(new Date().setMonth(new Date().getMonth() + 5)).toISOString().split('T')[0],
    title: 'Launch Day',
    description: 'Public release to all regions.',
  },
];