import React from 'react';
import { useLMS } from '../../context/LMSContext';
import { StepAttendance } from './StepAttendance';
import { StepPreTest } from './StepPreTest';
import { StepMaterial } from './StepMaterial';
import { StepPostTest } from './StepPostTest';

export const ModuleWorkspace: React.FC = () => {
  const { activeModuleId, moduleProgresses } = useLMS();
  const progress = moduleProgresses[activeModuleId];
  const currentStep = progress?.currentStep || 'attendance';

  return (
    <div key={currentStep} className="space-y-6 animate-fadeIn">
      {currentStep === 'attendance' && <StepAttendance />}
      {currentStep === 'pretest' && <StepPreTest />}
      {currentStep === 'material' && <StepMaterial />}
      {currentStep === 'posttest' && <StepPostTest />}
    </div>
  );
};
