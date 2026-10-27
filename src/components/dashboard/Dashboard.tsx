import React from 'react';
import { HeroProgress } from './HeroProgress';
import { KPISummary } from './KPISummary';
import { EnrolledCoursesOverview } from './EnrolledCoursesOverview';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* 1. Hero Progress Banner (Personalized Greeting & Smart Resume) */}
      <HeroProgress />

      {/* 2. 4 Macro Executive KPI Summary Cards */}
      <KPISummary />

      {/* 3. Enrolled Courses Overview (Course-Centric Grid Cards) */}
      <EnrolledCoursesOverview />
    </div>
  );
};
