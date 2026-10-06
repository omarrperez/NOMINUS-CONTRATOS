import React, { useState, useEffect } from 'react';
import { 
  LaborContract, 
  JobClassification, 
  ContractModality,
  CloudDocument,
  PredefinedTemplateId,
  Company
} from './types/contract';
import { INITIAL_CONTRACTS, DEFAULT_COMPANIES } from './utils/defaultData';
import { INITIAL_CLOUD_DOCUMENTS } from './utils/defaultCloudDocuments';
import { CURRENT_DEFAULT_BCV_RATE } from './utils/lotttCalculations';
import { createContractFromPredefinedTemplate } from './utils/fivePredefinedTemplates';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { ContractWizard } from './components/Wizard/ContractWizard';
import { ContractViewer } from './components/ContractViewer';
import { LopcymatViewer } from './components/LopcymatViewer';
import { SignModal } from './components/SignModal';
import { AuditCertificateModal } from './components/AuditCertificateModal';
import { AddendumManager } from './components/AddendumManager';
import { CalculatorModal } from './components/CalculatorModal';
import { WorkerMobileView } from './components/WorkerMobileView';
import { CloudDocumentManager } from './components/CloudDocuments/CloudDocumentManager';
import { LotttAdvisor } from './components/Assistant/LotttAdvisor';
import { CompanyManagerModal } from './components/Companies/CompanyManagerModal';
import { FirebaseStatusModal } from './components/Firebase/FirebaseStatusModal';
import { 
  testFirestoreConnection, 
  auth 
} from './firebase/config';
import { 
  subscribeToCompanies, 
  subscribeToContracts, 
  subscribeToCloudDocuments, 
  subscribeToSettings,
  saveCompanyToFirestore,
  saveContractToFirestore,
  batchSaveContractsToFirestore,
  saveCloudDocumentToFirestore,
  deleteCloudDocumentFromFirestore,
  saveBcvRateToFirestore,
  seedInitialFirestoreData
} from './firebase/firestoreService';

export default function App() {
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(true);

  // Persistence for Companies (Multi-Empresa)
  const [companies, setCompanies] = useState<Company[]>(() => {
    try {
      const saved = localStorage.getItem('nominus_companies_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_COMPANIES;
  });

  const [selectedCompanyId, setSelectedCompanyId] = useState<string | 'all'>(() => {
    try {
      const saved = localStorage.getItem('nominus_selected_company_v1');
      if (saved) return saved;
    } catch {
      // Fallback
    }
    return 'all';
  });

  const [isCompanyManagerOpen, setIsCompanyManagerOpen] = useState(false);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);

  // Persistence for Contracts
  const [contracts, setContracts] = useState<LaborContract[]>(() => {
    try {
      const saved = localStorage.getItem('nominus_contratos_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_CONTRACTS;
  });

  // Persistence for Cloud Documents
  const [cloudDocuments, setCloudDocuments] = useState<CloudDocument[]>(() => {
    try {
      const savedDocs = localStorage.getItem('nominus_cloud_docs_v2');
      if (savedDocs) return JSON.parse(savedDocs);
    } catch {
      // Fallback
    }
    return INITIAL_CLOUD_DOCUMENTS;
  });

  // BCV Rate
  const [bcvRate, setBcvRate] = useState<number>(() => {
    try {
      const savedRate = localStorage.getItem('nominus_bcv_rate_v2');
      if (savedRate) return parseFloat(savedRate);
    } catch {
      // Fallback
    }
    return CURRENT_DEFAULT_BCV_RATE;
  });

  // Initial connection test & Seed Firestore database if first time
  useEffect(() => {
    let isMounted = true;
    testFirestoreConnection().then((connected) => {
      if (isMounted) {
        setIsFirebaseConnected(connected);
      }
    });

    // Seed defaults into Firestore so initial multi-companies and sample contracts exist in the cloud
    seedInitialFirestoreData(DEFAULT_COMPANIES, INITIAL_CONTRACTS, INITIAL_CLOUD_DOCUMENTS, CURRENT_DEFAULT_BCV_RATE);

    return () => {
      isMounted = false;
    };
  }, []);

  // Real-time Firestore Listeners (cloud database sync)
  useEffect(() => {
    const unsubCompanies = subscribeToCompanies((cloudCompanies) => {
      if (cloudCompanies.length > 0) {
        setCompanies(cloudCompanies);
      }
    });

    const unsubContracts = subscribeToContracts((cloudContracts) => {
      if (cloudContracts.length > 0) {
        setContracts(cloudContracts);
      }
    });

    const unsubDocs = subscribeToCloudDocuments((cloudDocs) => {
      if (cloudDocs.length > 0) {
        setCloudDocuments(cloudDocs);
      }
    });

    const unsubSettings = subscribeToSettings((settings) => {
      if (settings.bcvRate && typeof settings.bcvRate === 'number') {
        setBcvRate(settings.bcvRate);
      }
    });

    return () => {
      unsubCompanies();
      unsubContracts();
      unsubDocs();
      unsubSettings();
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('nominus_companies_v1', JSON.stringify(companies));
    } catch {
      // Silent
    }
  }, [companies]);

  useEffect(() => {
    try {
      localStorage.setItem('nominus_selected_company_v1', selectedCompanyId);
    } catch {
      // Silent
    }
  }, [selectedCompanyId]);

  useEffect(() => {
    try {
      localStorage.setItem('nominus_contratos_v2', JSON.stringify(contracts));
    } catch {
      // Silent
    }
  }, [contracts]);

  useEffect(() => {
    try {
      localStorage.setItem('nominus_cloud_docs_v2', JSON.stringify(cloudDocuments));
    } catch {
      // Silent
    }
  }, [cloudDocuments]);

  useEffect(() => {
    try {
      localStorage.setItem('nominus_bcv_rate_v2', bcvRate.toString());
    } catch {
      // Silent
    }
  }, [bcvRate]);

  // Tab & Navigation State
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedContract, setSelectedContract] = useState<LaborContract | null>(contracts[0] || null);

  // Template State for Wizard
  const [editingContract, setEditingContract] = useState<LaborContract | null>(null);
  const [wizardTemplate, setWizardTemplate] = useState<{
    classification: JobClassification;
    modality: ContractModality;
  }>({
    classification: 'administrativo',
    modality: 'indeterminado'
  });

  // Modal States
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Handlers
  const handleSelectContract = (
    contract: LaborContract, 
    viewType: 'contract' | 'lopcymat' | 'audit' | 'sign'
  ) => {
    setSelectedContract(contract);
    if (viewType === 'contract') {
      setCurrentTab('contract_view');
    } else if (viewType === 'lopcymat') {
      setCurrentTab('lopcymat_view');
    } else if (viewType === 'audit') {
      setIsAuditModalOpen(true);
    } else if (viewType === 'sign') {
      setIsSignModalOpen(true);
    }
  };

  const handleNewContractWithTemplate = (
    templateType: JobClassification, 
    modality: ContractModality
  ) => {
    setEditingContract(null);
    setWizardTemplate({ classification: templateType, modality });
    setCurrentTab('wizard');
  };

  // Load one of the 5 requested common predefined templates
  const handleLoadPredefinedTemplate = (templateId: PredefinedTemplateId) => {
    const generated = createContractFromPredefinedTemplate(templateId, bcvRate, contracts.length);
    setEditingContract(generated);
    setWizardTemplate({ classification: generated.clasificacion, modality: generated.modalidad });
    setCurrentTab('wizard');
  };

  const handleSaveContract = (newOrUpdatedContract: LaborContract) => {
    // 1. Update local state
    setContracts(prev => {
      const index = prev.findIndex(c => c.id === newOrUpdatedContract.id);
      if (index >= 0) {
        const copy = [...prev];
        copy[index] = newOrUpdatedContract;
        return copy;
      }
      return [newOrUpdatedContract, ...prev];
    });

    // 2. Persist to Firestore Cloud
    saveContractToFirestore(newOrUpdatedContract);

    // Also automatically register/sync into Cloud Documents
    const cloudDocId = `doc-contract-${newOrUpdatedContract.id}`;
    setCloudDocuments(prev => {
      const exists = prev.some(d => d.id === cloudDocId);
      if (exists) return prev;
      const newCloudDoc: CloudDocument = {
        id: cloudDocId,
        nombre: `Contrato_${newOrUpdatedContract.trabajador.nombres.replace(/\s+/g, '_')}_${newOrUpdatedContract.codigoExpediente}.pdf`,
        tipo: 'contrato_firmado',
        tipoDescripcion: `Contrato de Trabajo (${newOrUpdatedContract.cargo})`,
        contractId: newOrUpdatedContract.id,
        codigoExpediente: newOrUpdatedContract.codigoExpediente,
        empresaId: newOrUpdatedContract.empresaId,
        empresaNombre: newOrUpdatedContract.empresa.alias || newOrUpdatedContract.empresa.denominacionSocial,
        empleadoNombre: `${newOrUpdatedContract.trabajador.nombres} ${newOrUpdatedContract.trabajador.apellidos}`,
        empleadoCedula: newOrUpdatedContract.trabajador.cedula,
        fechaSubida: new Date().toISOString().split('T')[0],
        tamanioKb: 215,
        formato: 'PDF',
        sha256Hash: newOrUpdatedContract.auditTrail?.sha256DocumentHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        estadoSeguridad: newOrUpdatedContract.status === 'firmado_ambos' ? 'Certificado SUSCERTE' : 'Cifrado SHA-256',
        nubeProvider: 'Nominus Vault (Firestore)',
        etiquetas: ['Contrato', newOrUpdatedContract.cargo, newOrUpdatedContract.modalidad],
        notas: `Expediente generado digitalmente en Nominus Contratos conforme a la LOTTT.`
      };

      // Save new cloud doc to Firestore
      saveCloudDocumentToFirestore(newCloudDoc);
      return [newCloudDoc, ...prev];
    });

    setSelectedContract(newOrUpdatedContract);
    setCurrentTab('dashboard');
  };

  const handleContractSigned = (signedContract: LaborContract) => {
    setContracts(prev => 
      prev.map(c => c.id === signedContract.id ? signedContract : c)
    );
    setSelectedContract(signedContract);
    setIsSignModalOpen(false);

    // Save signed contract to Firestore
    saveContractToFirestore(signedContract);

    // Update cloud document if exists
    setCloudDocuments(prev => 
      prev.map(d => {
        if (d.contractId === signedContract.id) {
          const updatedDoc = {
            ...d,
            estadoSeguridad: 'Certificado SUSCERTE',
            sha256Hash: signedContract.auditTrail?.sha256DocumentHash || d.sha256Hash
          };
          saveCloudDocumentToFirestore(updatedDoc);
          return updatedDoc;
        }
        return d;
      })
    );
  };

  const handleAddCloudDocument = (doc: CloudDocument) => {
    setCloudDocuments(prev => [doc, ...prev]);
    saveCloudDocumentToFirestore(doc);
  };

  const handleDeleteCloudDocument = (docId: string) => {
    setCloudDocuments(prev => prev.filter(d => d.id !== docId));
    deleteCloudDocumentFromFirestore(docId);
  };

  const employeesList = contracts.map(c => ({
    nombre: `${c.trabajador.nombres} ${c.trabajador.apellidos}`,
    cedula: c.trabajador.cedula
  }));

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-900">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        bcvRate={bcvRate}
        setBcvRate={setBcvRate}
        contractsCount={contracts.length}
        cloudDocsCount={cloudDocuments.length}
        companies={companies}
        selectedCompanyId={selectedCompanyId}
        onSelectCompany={setSelectedCompanyId}
        onOpenCompanyManager={() => setIsCompanyManagerOpen(true)}
        contracts={contracts}
        isFirebaseConnected={isFirebaseConnected}
        onOpenFirebasePanel={() => setIsFirebaseModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {/* Dashboard View */}
        {currentTab === 'dashboard' && (
          <Dashboard
            contracts={contracts}
            onSelectContract={handleSelectContract}
            onNewContractWithTemplate={handleNewContractWithTemplate}
            onLoadPredefinedTemplate={handleLoadPredefinedTemplate}
            onGoToWizard={() => {
              setEditingContract(null);
              setWizardTemplate({ classification: 'administrativo', modality: 'indeterminado' });
              setCurrentTab('wizard');
            }}
            onGoToCloud={() => setCurrentTab('cloud_docs')}
            onGoToAdvisor={() => setCurrentTab('asesor_ia')}
            bcvRate={bcvRate}
            companies={companies}
            selectedCompanyId={selectedCompanyId}
            onSelectCompany={setSelectedCompanyId}
            onOpenCompanyManager={() => setIsCompanyManagerOpen(true)}
            onOpenFirebasePanel={() => setIsFirebaseModalOpen(true)}
          />
        )}

        {/* Expedientes Table View */}
        {currentTab === 'expedientes' && (
          <div className="space-y-6 pb-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
                  Expedientes Contractuales Patronales
                </h1>
                <p className="text-xs text-slate-500">
                  Archivo documental digitalizado con doble ejemplar conforme al Artículo 59 numeral 14 LOTTT
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingContract(null);
                  setWizardTemplate({ classification: 'administrativo', modality: 'indeterminado' });
                  setCurrentTab('wizard');
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all"
              >
                + Nuevo Contrato
              </button>
            </div>

            <Dashboard
              contracts={contracts}
              onSelectContract={handleSelectContract}
              onNewContractWithTemplate={handleNewContractWithTemplate}
              onLoadPredefinedTemplate={handleLoadPredefinedTemplate}
              onGoToWizard={() => {
                setEditingContract(null);
                setCurrentTab('wizard');
              }}
              onGoToCloud={() => setCurrentTab('cloud_docs')}
              onGoToAdvisor={() => setCurrentTab('asesor_ia')}
              bcvRate={bcvRate}
              companies={companies}
              selectedCompanyId={selectedCompanyId}
              onSelectCompany={setSelectedCompanyId}
              onOpenCompanyManager={() => setIsCompanyManagerOpen(true)}
              onOpenFirebasePanel={() => setIsFirebaseModalOpen(true)}
            />
          </div>
        )}

        {/* Cloud Documents Management View */}
        {currentTab === 'cloud_docs' && (
          <CloudDocumentManager
            documents={cloudDocuments}
            onAddDocument={handleAddCloudDocument}
            onDeleteDocument={handleDeleteCloudDocument}
            employees={employeesList}
            companies={companies}
            selectedCompanyId={selectedCompanyId}
          />
        )}

        {/* Virtual HR Consultant LOTTT Advisor */}
        {currentTab === 'asesor_ia' && (
          <div className="space-y-4 pb-12">
            <LotttAdvisor
              currentContract={selectedContract}
              contracts={contracts}
              onOpenContract={(c) => {
                setSelectedContract(c);
                setCurrentTab('contract_view');
              }}
            />
          </div>
        )}

        {/* Contract Creation / Editing Wizard */}
        {currentTab === 'wizard' && (
          <ContractWizard
            initialContract={editingContract}
            initialClassification={wizardTemplate.classification}
            initialModality={wizardTemplate.modality}
            onSaveContract={handleSaveContract}
            onProceedToSign={(c) => {
              handleSaveContract(c);
              setSelectedContract(c);
              setIsSignModalOpen(true);
            }}
            onCancel={() => setCurrentTab('dashboard')}
            bcvRate={bcvRate}
            totalContractsCount={contracts.length}
            companies={companies}
            selectedCompanyId={selectedCompanyId}
          />
        )}

        {/* Contract Printable Viewer */}
        {currentTab === 'contract_view' && selectedContract && (
          <ContractViewer
            contract={selectedContract}
            onBack={() => setCurrentTab('dashboard')}
            onProceedToSign={(c) => {
              setSelectedContract(c);
              setIsSignModalOpen(true);
            }}
          />
        )}

        {/* LOPCYMAT Risk Notification Viewer */}
        {currentTab === 'lopcymat_view' && selectedContract && (
          <LopcymatViewer
            contract={selectedContract}
            onBack={() => setCurrentTab('dashboard')}
          />
        )}

        {/* Calculator Tab */}
        {currentTab === 'calculadora' && (
          <CalculatorModal bcvRate={bcvRate} />
        )}

        {/* Mass Addendums Tab */}
        {currentTab === 'adendas' && (
          <AddendumManager
            contracts={contracts}
            onUpdateContracts={(updatedList) => {
              setContracts(updatedList);
              batchSaveContractsToFirestore(updatedList);
            }}
            bcvRate={bcvRate}
            companies={companies}
            selectedCompanyId={selectedCompanyId}
          />
        )}

        {/* Worker Mobile Phone Simulator */}
        {currentTab === 'simulador_movil' && (
          <WorkerMobileView
            contracts={contracts}
            onContractSigned={handleContractSigned}
          />
        )}
      </main>

      {/* Signature Modal */}
      {isSignModalOpen && selectedContract && (
        <SignModal
          contract={selectedContract}
          onClose={() => setIsSignModalOpen(false)}
          onContractSigned={handleContractSigned}
        />
      )}

      {/* SUSCERTE Digital Audit Certificate Modal */}
      {isAuditModalOpen && selectedContract && (
        <AuditCertificateModal
          contract={selectedContract}
          onClose={() => setIsAuditModalOpen(false)}
        />
      )}

      {/* Company Management Modal (Multi-Empresa) */}
      <CompanyManagerModal
        isOpen={isCompanyManagerOpen}
        onClose={() => setIsCompanyManagerOpen(false)}
        companies={companies}
        selectedCompanyId={selectedCompanyId}
        onSelectCompany={(id) => {
          setSelectedCompanyId(id);
          setIsCompanyManagerOpen(false);
        }}
        onSaveCompany={(companyToSave) => {
          setCompanies(prev => {
            const index = prev.findIndex(c => c.id === companyToSave.id);
            if (index >= 0) {
              const updated = [...prev];
              updated[index] = companyToSave;
              return updated;
            }
            return [...prev, companyToSave];
          });
          // Persist to Firestore Cloud
          saveCompanyToFirestore(companyToSave);
        }}
        onNewContractForCompany={(company) => {
          setIsCompanyManagerOpen(false);
          setSelectedCompanyId(company.id);
          setEditingContract(null);
          setWizardTemplate({ classification: 'administrativo', modality: 'indeterminado' });
          setCurrentTab('wizard');
        }}
        contracts={contracts}
      />

      {/* Firebase Firestore Connection Status Modal */}
      <FirebaseStatusModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
        contractsCount={contracts.length}
        companiesCount={companies.length}
        cloudDocsCount={cloudDocuments.length}
        bcvRate={bcvRate}
      />

      {/* Light Pastel Footer */}
      <footer className="border-t border-amber-200/60 bg-white py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-slate-800">NOMINUS CONTRATOS</span>
            <span className="text-amber-300">·</span>
            <span className="text-slate-600">LegalTech Laboral & SST en Venezuela</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Conforme a LOTTT (G.O. 6.076 Ext.), LOPCYMAT (G.O. 38.236), NT-04-2023, y Decreto-Ley 1.204 de Mensajes de Datos.
          </div>
        </div>
      </footer>
    </div>
  );
}
