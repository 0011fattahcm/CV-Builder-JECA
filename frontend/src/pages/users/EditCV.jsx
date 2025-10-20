import React, { useState } from 'react';
import DashboardLayout from '../../components/users/DashboardLayout';
import SessionHeader from './SessionHeader';
import DataPribadiSection from './DataPribadiSection';
import PendidikanSection from './PendidikanSection';
import PekerjaanSection from './PekerjaanSection';
import KeluargaSection from './KeluargaSection';
import RiwayatJepangSection from './RiwayatJepangSection';
import ExportCvPage from './ExportCvPage';

const steps = [
  'Data Pribadi',
  'Pendidikan',
  'Pekerjaan',
  'Keluarga',
  'Riwayat',
  'Export CV'
];

const EditCV = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <DataPribadiSection />;
      case 1:
        return <PendidikanSection />;
      case 2:
        return <PekerjaanSection/>;
      case 3:
        return <KeluargaSection/>;
      case 4:
        return <RiwayatJepangSection/>;
      case 5:
        return <ExportCvPage/>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <SessionHeader steps={steps} currentStep={currentStep} />

        <div className="mt-6">
          {renderStep()}

          <div className="mt-8 flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="px-4 py-2 bg-gray-300 text-sm rounded-lg disabled:opacity-50"
            >
              ◀ Sebelumnya
            </button>

            <button
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Selanjutnya ▶
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditCV;
