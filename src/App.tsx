/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Client, CocktailEvent, Payment, Contract, 
  ActiveTab, NavigationState 
} from './types';
import BottomSheet from './components/BottomSheet';
import ClientManagement from './components/ClientManagement';
import EventManagement from './components/EventManagement';
import PaymentManagement from './components/PaymentManagement';
import ContractManagement from './components/ContractManagement';
import A4Editor from './components/A4Editor';
import { PhoneInput, CurrencyInput, CustomSelect, CustomDatePicker } from './components/FormControls';

// Icons from lucide-react
import { 
  LayoutDashboard, Users, Calendar, DollarSign, FileText, 
  Plus, ArrowRight, UserPlus, CalendarPlus, BadgeDollarSign, 
  Sparkles, Zap, Smartphone, CheckCircle, AlertTriangle,
  Settings, Moon, Sun, RefreshCw, Github
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Seeding standard, beautiful premium initial data for immediate premium product evaluation
const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli_1',
    name: 'Helena Ribeiro Castro',
    phone: '(51) 99823-4554',
    email: 'helena.ribeiro@email.com',
    notes: 'Noiva detalhista. Prefere cardápio focado em Gin Tônica artesanal e coquetéis moleculares.',
    createdAt: '2026-05-10',
  },
  {
    id: 'cli_2',
    name: 'Eduardo Silveira Mendes',
    phone: '(11) 98111-2233',
    email: 'eduardo.silveira@email.com',
    notes: 'Aniversariante de 40 anos. Quer bar rústico de madeira e drinks temáticos de cinema.',
    createdAt: '2026-05-15',
  },
  {
    id: 'cli_3',
    name: 'Patrícia Schmidt Reis',
    phone: '(21) 97555-9090',
    email: 'patricia.reis@email.com',
    notes: 'Evento corporativo para 150 convidados. Necessita de rapidez no atendimento e drinks sem álcool.',
    createdAt: '2026-05-20',
  }
];

const INITIAL_EVENTS: CocktailEvent[] = [
  {
    id: 'ev_1',
    clientId: 'cli_1',
    clientName: 'Helena Ribeiro Castro',
    name: 'Casamento Helena & Roberto',
    date: '2026-11-28',
    location: 'Recanto das Hortênsias, Gramado - RS',
    drinkPackage: 'Premium Completo 5 Horas (Bar Especializado)',
    guestCount: 180,
    price: 5400.00,
    status: 'confirmado',
  },
  {
    id: 'ev_2',
    clientId: 'cli_2',
    clientName: 'Eduardo Silveira Mendes',
    name: 'Aniversário 40 Anos Eduardo',
    date: '2026-07-11',
    location: 'Salão Rústico Boulevard, São Paulo - SP',
    drinkPackage: 'Tradicional Caipirinhas & Gin Tônicas',
    guestCount: 80,
    price: 3200.00,
    status: 'pendente',
  },
  {
    id: 'ev_3',
    clientId: 'cli_3',
    clientName: 'Patrícia Schmidt Reis',
    name: 'Festa de Fim de Ano TechCorp',
    date: '2026-12-15',
    location: 'Espaço Inovação Flamboyant, Rio de Janeiro - RJ',
    drinkPackage: 'Premium Soft Sem Álcool & Aperitivos',
    guestCount: 150,
    price: 4800.00,
    status: 'pendente',
  }
];

const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay_1',
    clientId: 'cli_1',
    clientName: 'Helena Ribeiro Castro',
    eventId: 'ev_1',
    eventName: 'Casamento Helena & Roberto',
    amount: 1800.00,
    dueDate: '2026-05-11',
    payDate: '2026-05-11',
    status: 'pago',
    notes: 'Sinal de 30% pago via PIX para reserva de data.'
  },
  {
    id: 'pay_2',
    clientId: 'cli_1',
    clientName: 'Helena Ribeiro Castro',
    eventId: 'ev_1',
    eventName: 'Casamento Helena & Roberto',
    amount: 3600.00,
    dueDate: '2026-11-10',
    payDate: null,
    status: 'pendente',
    notes: 'Saldo restante agendado para 18 dias antes do casamento.'
  },
  {
    id: 'pay_3',
    clientId: 'cli_2',
    clientName: 'Eduardo Silveira Mendes',
    eventId: 'ev_2',
    eventName: 'Aniversário 40 Anos Eduardo',
    amount: 1000.00,
    dueDate: '2026-05-20',
    payDate: null,
    status: 'atrasado',
    notes: 'Sinal de reserva de data em atraso.'
  }
];

const INITIAL_CONTRACTS: Contract[] = [
  {
    id: 'ctr_1',
    clientId: 'cli_1',
    clientName: 'Helena Ribeiro Castro',
    eventId: 'ev_1',
    eventName: 'Casamento Helena & Roberto',
    date: '2026-05-11',
    title: 'Contrato de Prestação de Serviços - Casamento Helena',
    content: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE BARMAN E COQUETELARIA

Este instrumento particular regula os serviços de barman e coquetelaria profissional celebrados entre:

CONTRATADA:
Mixology Eventos, representada por Eric Fernando, Porto Alegre/RS.

CONTRATANTE:
Nome: Helena Ribeiro Castro
E-mail: helena.ribeiro@email.com
Telefone: (51) 99823-4554

CLÁUSULA PRIMEIRA - DO OBJETO DO SERVIÇO
A Contratada compromete-se a prestar serviço de coquetelaria fina para o evento "Casamento Helena & Roberto" agendado para 28/11/2026, no endereço: Recanto das Hortênsias, Gramado - RS.

CLÁUSULA SEGUNDA - ESPECIFICAÇÃO
Será fornecido o plano Premium Completo 5 Horas para estimativa de 180 pessoas. A estrutura do bar, copos de cristal, frutas premium fatiadas na hora e barmens uniformizados serão de encargo da Contratada.

CLÁUSULA TERCEIRA - CONTRAPARTIDA FINANCEIRA
O valor acertado totaliza R$ 5.400,00, a ser saldado em R$ 1.800,00 como sinal, e o saldo restante de R$ 3.600,00 até dez dias antes do evento.

Porto Alegre/RS, 11/05/2026`,
    status: 'rascunho'
  }
];

export default function App() {
  // Load initial states from localStorage with seed defaults
  const [clients, setClients] = useState<Client[]>(() => {
    const raw = localStorage.getItem('mix_clients');
    return raw ? JSON.parse(raw) : INITIAL_CLIENTS;
  });

  const [events, setEvents] = useState<CocktailEvent[]>(() => {
    const raw = localStorage.getItem('mix_events');
    return raw ? JSON.parse(raw) : INITIAL_EVENTS;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const raw = localStorage.getItem('mix_payments');
    return raw ? JSON.parse(raw) : INITIAL_PAYMENTS;
  });

  const [contracts, setContracts] = useState<Contract[]>(() => {
    const raw = localStorage.getItem('mix_contracts');
    return raw ? JSON.parse(raw) : INITIAL_CONTRACTS;
  });

  // Master navigation state
  const [navigation, setNavigation] = useState<NavigationState>({
    tab: 'dashboard',
    activeClientDetailId: null,
    activeEventDetailId: null,
    activeContractDetailId: null,
    activeContractEditorId: null,
    activePaymentDetailId: null,
    isBottomSheetOpen: false,
    bottomSheetType: null,
    bottomSheetAction: null,
    editTargetId: null,
  });

  // Forms active values inside bottom sheets
  const [clientForm, setClientForm] = useState({ name: '', phone: '', email: '', notes: '' });
  const [eventForm, setEventForm] = useState({ name: '', clientId: '', date: '', location: '', drinkPackage: 'Premium Completo', guestCount: 100, price: 0 });
  const [paymentForm, setPaymentForm] = useState({ clientId: '', eventId: '', amount: 0, dueDate: '', status: 'pendente' as 'pago' | 'pendente' | 'atrasado', notes: '' });

  // Settings & Theme State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [profileName, setProfileName] = useState(() => localStorage.getItem('mix_profile_name') || '');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('mix_theme');
    if (saved) return saved === 'dark';
    return document.documentElement.classList.contains('dark');
  });

  // Theme Sync
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('mix_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('mix_theme', 'light');
    }
  }, [isDarkMode]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('mix_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('mix_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('mix_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('mix_contracts', JSON.stringify(contracts));
  }, [contracts]);

  // CRITICAL REQUIREMENT: Complete Hardware/Software Back Button Alignment for Native App Feel in PWAs!
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Direct action when popstate fires (user clicked back button on mobile phone or swipe back gesture)
      setNavigation(prev => {
        // 1. If bottom sheet drawer is active, back event should close it FIRST
        if (prev.isBottomSheetOpen) {
          return {
            ...prev,
            isBottomSheetOpen: false,
            bottomSheetType: null,
            bottomSheetAction: null,
            editTargetId: null,
          };
        }
        // 2. If client detail / list subscreen is active, return to general clients list
        if (prev.activeClientDetailId) {
          return { ...prev, activeClientDetailId: null };
        }
        // 3. If event detail is active, return to events agenda list
        if (prev.activeEventDetailId) {
          return { ...prev, activeEventDetailId: null };
        }
        // 4. If contract editor is deep active, return to contract list screen
        if (prev.activeContractEditorId) {
          return { ...prev, activeContractEditorId: null, activeContractDetailId: null };
        }
        // 5. If on any secondary tab, you can decide to return to 'dashboard' tab
        if (prev.tab !== 'dashboard') {
          return { ...prev, tab: 'dashboard' };
        }
        return prev;
      });
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Scroll to top on screen change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigation.tab, navigation.activeClientDetailId, navigation.activeEventDetailId, navigation.activeContractEditorId]);

  // Helper push navigator that adds history state items so the user has an actual backstack to pop from
  const triggerPushState = (metaType: string) => {
    // Standard web browser back navigation is simulated cleanly
    window.history.pushState({ type: metaType, timestamp: Date.now() }, '');
  };

  const handleTabChange = (newTab: ActiveTab) => {
    setNavigation(prev => ({
      ...prev,
      tab: newTab,
      activeClientDetailId: null,
      activeEventDetailId: null,
      activeContractDetailId: null,
      activeContractEditorId: null,
    }));
  };

  // Launch Bottom Sheets Actions safely with history awareness
  const handleOpenBottomSheet = (
    type: 'client' | 'event' | 'payment' | 'contract',
    action: 'create' | 'edit',
    targetId: string | null = null
  ) => {
    triggerPushState('bottom_sheet');
    
    // Clear forms or prepare them with matching defaults
    if (action === 'create') {
      if (type === 'client') {
        setClientForm({ name: '', phone: '', email: '', notes: '' });
      } else if (type === 'event') {
        setEventForm({ name: '', clientId: '', date: '', location: '', drinkPackage: 'Premium Completo 5 Horas', guestCount: 100, price: 3000 });
      } else if (type === 'payment') {
        setPaymentForm({ clientId: '', eventId: '', amount: 1500, dueDate: new Date().toISOString().split('T')[0], status: 'pendente', notes: '' });
      }
    } else if (action === 'edit' && targetId) {
      if (type === 'client') {
        const item = clients.find(c => c.id === targetId);
        if (item) setClientForm({ name: item.name, phone: item.phone, email: item.email, notes: item.notes || '' });
      } else if (type === 'event') {
        const item = events.find(e => e.id === targetId);
        if (item) setEventForm({ name: item.name, clientId: item.clientId, date: item.date, location: item.location, drinkPackage: item.drinkPackage, guestCount: item.guestCount, price: item.price });
      } else if (type === 'payment') {
        const item = payments.find(p => p.id === targetId);
        if (item) setPaymentForm({ clientId: item.clientId, eventId: item.eventId, amount: item.amount, dueDate: item.dueDate, status: item.status, notes: item.notes || '' });
      }
    }

    setNavigation(prev => ({
      ...prev,
      isBottomSheetOpen: true,
      bottomSheetType: type,
      bottomSheetAction: action,
      editTargetId: targetId
    }));
  };

  const handleCloseBottomSheet = () => {
    // If we're closing manually, pop the browser history once so it doesn't leave an orphaned state
    if (window.history.state?.type === 'bottom_sheet') {
      window.history.back();
    } else {
      setNavigation(prev => ({
        ...prev,
        isBottomSheetOpen: false,
        bottomSheetType: null,
        bottomSheetAction: null,
        editTargetId: null
      }));
    }
  };

  // CRUD Implementations
  // Client CRUD
  const handleSaveClientForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientForm.name.trim()) return;

    if (navigation.bottomSheetAction === 'create') {
      const newClient: Client = {
        id: `cli_${Date.now()}`,
        name: clientForm.name,
        phone: clientForm.phone,
        email: clientForm.email,
        notes: clientForm.notes,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setClients(prev => [newClient, ...prev]);
    } else if (navigation.bottomSheetAction === 'edit' && navigation.editTargetId) {
      setClients(prev => prev.map(c => c.id === navigation.editTargetId ? { ...c, ...clientForm } : c));
    }
    
    handleCloseBottomSheet();
  };

  const handleDeleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  // Event CRUD
  const handleSaveEventForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.name.trim() || !eventForm.clientId) return;

    const matchedClient = clients.find(c => c.id === eventForm.clientId);
    const clientName = matchedClient ? matchedClient.name : 'Cliente Anônimo';

    if (navigation.bottomSheetAction === 'create') {
      const newEvent: CocktailEvent = {
        id: `ev_${Date.now()}`,
        clientId: eventForm.clientId,
        clientName: clientName,
        name: eventForm.name,
        date: eventForm.date || new Date().toISOString().split('T')[0],
        location: eventForm.location,
        drinkPackage: eventForm.drinkPackage,
        guestCount: Number(eventForm.guestCount),
        price: Number(eventForm.price),
        status: 'pendente',
      };
      setEvents(prev => [newEvent, ...prev]);
      
      // Auto-register default payment (Sinal payment row) for convenience and better financials
      const defaultPayment: Payment = {
        id: `pay_sinal_${Date.now()}`,
        clientId: eventForm.clientId,
        clientName: clientName,
        eventId: newEvent.id,
        eventName: newEvent.name,
        amount: Number(eventForm.price) * 0.3, // 30% standard deposit sinal
        dueDate: newEvent.date,
        payDate: null,
        status: 'pendente',
        notes: 'Sinal sugerido de 30% referente à contratação do bar.'
      };
      setPayments(prev => [defaultPayment, ...prev]);

    } else if (navigation.bottomSheetAction === 'edit' && navigation.editTargetId) {
      setEvents(prev => prev.map(ev => ev.id === navigation.editTargetId ? { 
        ...ev, 
        name: eventForm.name,
        clientId: eventForm.clientId,
        clientName: clientName,
        date: eventForm.date,
        location: eventForm.location,
        drinkPackage: eventForm.drinkPackage,
        guestCount: Number(eventForm.guestCount),
        price: Number(eventForm.price),
      } : ev));
    }

    handleCloseBottomSheet();
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    // Remove linked payments too
    setPayments(prev => prev.filter(p => p.eventId !== id));
  };

  // Payment CRUD
  const handleSavePaymentForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentForm.clientId || !paymentForm.amount) return;

    const client = clients.find(c => c.id === paymentForm.clientId);
    const clientName = client ? client.name : 'Avulso';

    const linkedEvent = events.find(ev => ev.id === paymentForm.eventId);
    const eventName = linkedEvent ? linkedEvent.name : 'Geral / Outro';

    if (navigation.bottomSheetAction === 'create') {
      const newPayment: Payment = {
        id: `pay_${Date.now()}`,
        clientId: paymentForm.clientId,
        clientName: clientName,
        eventId: paymentForm.eventId || 'unknown',
        eventName: eventName,
        amount: Number(paymentForm.amount),
        dueDate: paymentForm.dueDate || new Date().toISOString().split('T')[0],
        payDate: paymentForm.status === 'pago' ? new Date().toISOString().split('T')[0] : null,
        status: paymentForm.status,
        notes: paymentForm.notes,
      };
      setPayments(prev => [newPayment, ...prev]);
    } else if (navigation.bottomSheetAction === 'edit' && navigation.editTargetId) {
      setPayments(prev => prev.map(pay => pay.id === navigation.editTargetId ? {
        ...pay,
        clientId: paymentForm.clientId,
        clientName: clientName,
        eventId: paymentForm.eventId || 'unknown',
        eventName: eventName,
        amount: Number(paymentForm.amount),
        dueDate: paymentForm.dueDate,
        status: paymentForm.status,
        payDate: paymentForm.status === 'pago' ? (pay.payDate || new Date().toISOString().split('T')[0]) : null,
        notes: paymentForm.notes,
      } : pay));
    }

    handleCloseBottomSheet();
  };

  const handleDeletePayment = (id: string) => {
    setPayments(prev => prev.filter(p => p.id !== id));
  };

  const handleMarkAsPaid = (id: string) => {
    setPayments(prev => prev.map(p => p.id === id ? { 
      ...p, 
      status: 'pago', 
      payDate: new Date().toISOString().split('T')[0] 
    } : p));
  };

  // Contracts Actions
  const handleSaveContract = (contract: Contract) => {
    const existsMatch = contracts.some(c => c.id === contract.id);
    if (existsMatch) {
      setContracts(prev => prev.map(c => c.id === contract.id ? contract : c));
    } else {
      setContracts(prev => [contract, ...prev]);
    }
    setNavigation(prev => ({
      ...prev,
      activeContractEditorId: null,
      activeContractDetailId: null,
    }));
  };

  const handleDeleteContract = (id: string) => {
    setContracts(prev => prev.filter(c => c.id !== id));
  };

  const handleLaunchAutomaticContract = (clientId: string, eventId: string) => {
    triggerPushState('contract_editor');
    // Save to deep view editor and pass automatic seeds
    setNavigation(prev => ({
      ...prev,
      tab: 'contracts',
      activeContractEditorId: 'new', // Flag for new generated contract sheet
    }));
  };

  // Finance indicators computation
  const stats = {
    received: payments.filter(p => p.status === 'pago').reduce((a, b) => a + b.amount, 0),
    pending: payments.filter(p => p.status === 'pendente').reduce((a, b) => a + b.amount, 0),
    overdue: payments.filter(p => p.status === 'atrasado').reduce((a, b) => a + b.amount, 0),
    activeEvents: events.filter(e => e.status === 'confirmado' || e.status === 'pendente').length
  };

  // Next 3 Upcoming agendas
  const upcomingEvents = events
    .filter(ev => ev.status === 'confirmado' || ev.status === 'pendente')
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  return (
    <div id="pwa-app-root" className="min-h-screen bg-brand-bg text-brand-text-primary flex flex-col font-sans selection:bg-brand-accent/20">
      
      {/* Top Professional Mixology Header Bar - Hides during system print */}
      {navigation.tab === 'dashboard' && !navigation.activeContractEditorId && (
        <header className="sticky top-0 z-30 bg-brand-bg/95 backdrop-blur-md border-b border-brand-border px-4 py-4 md:px-8 print:hidden flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/icon.png" alt="Mixology Logo" className="h-10" />
          </div>

          <div className="flex items-center gap-2">
            {/* Quick status bar */}
            <div className="hidden sm:flex items-center gap-2 bg-brand-surface border border-brand-border p-1 px-3 rounded-full text-[11px] text-brand-text-secondary mr-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Offline PWA Pronto para Festas
            </div>
            
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 bg-brand-surface border border-brand-border rounded-xl text-brand-text-secondary hover:text-brand-text-primary transition active:scale-95"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>
      )}

      {/* Main Container viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 pb-28 md:pb-12 h-full flex flex-col">
        <AnimatePresence mode="wait">
          
          {/* Main conditional display router */}
          {navigation.activeContractEditorId ? (
            /* Inside A4 subscreen editor */
            <A4Editor
              clients={clients}
              events={events}
              contracts={contracts}
              onSaveContract={handleSaveContract}
              onCancel={() => setNavigation(prev => ({ ...prev, activeContractEditorId: null }))}
              initialContractId={navigation.activeContractEditorId}
            />
          ) : (
            /* Traditional tab boards selectors */
            <motion.div
              key={navigation.tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col gap-6 w-full flex-1"
            >
              
              {/* TELA 1 - MAIN DASHBOARD COCKTAIL BOARD */}
              {navigation.tab === 'dashboard' && (
                <div id="dashboard-tab-panel" className="flex flex-col gap-7">
                  
                  {/* Dynamic greeting title */}
                  <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold tracking-tight text-brand-text-primary flex items-center gap-1.5 font-sans">
                      Início
                    </h2>
                  </div>

                  {/* Financial Metrics Cards banner */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                    
                    <div className="bg-brand-surface border border-brand-border p-3.5 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden">
                      <div className="absolute right-2 top-2 p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
                        <CheckCircle className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-semibold text-brand-text-secondary uppercase tracking-widest block mb-1">Recebidos</span>
                      <span className="text-sm font-bold text-emerald-500 font-sans tracking-tight block">
                        R$ {stats.received.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="bg-brand-surface border border-brand-border p-3.5 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden">
                      <div className="absolute right-2 top-2 p-1.5 bg-amber-500/10 text-amber-500 rounded-lg">
                        <Zap className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-semibold text-brand-text-secondary uppercase tracking-widest block mb-1">Pendentes</span>
                      <span className="text-sm font-bold text-brand-accent font-sans tracking-tight block">
                        R$ {stats.pending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="bg-brand-surface border border-brand-border p-3.5 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden">
                      <div className="absolute right-2 top-2 p-1.5 bg-red-500/10 text-red-400 rounded-lg">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-semibold text-brand-text-secondary uppercase tracking-widest block mb-1">Atrasados</span>
                      <span className="text-sm font-bold text-red-500 font-sans tracking-tight block">
                        R$ {stats.overdue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="bg-brand-surface border border-brand-border p-3.5 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden">
                      <span className="text-[10px] font-semibold text-brand-text-secondary uppercase tracking-widest block mb-1">Eventos Ativos</span>
                      <span className="text-sm font-bold text-[#ffffff] font-sans tracking-tight block">
                        {stats.activeEvents} em andamento
                      </span>
                    </div>

                  </div>

                  {/* QUICK ACTIONS PANEL (Modal calls with custom inputs layout) */}
                  <div className="bg-brand-surface border border-brand-border p-5 rounded-2xl flex flex-col gap-4">
                    <h3 className="text-xs uppercase tracking-widest font-extrabold text-brand-text-secondary">
                      Painel de Ações Rápidas
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      
                      {/* Trigger Novo Cliente */}
                      <div 
                        onClick={() => handleOpenBottomSheet('client', 'create')}
                        className="bg-brand-bg border border-brand-border hover:border-brand-accent/40 p-4 rounded-2xl cursor-pointer transition duration-150 group flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-brand-accent/10 text-brand-accent rounded-xl border border-brand-accent/20 group-hover:bg-brand-accent group-hover:text-brand-bg transition duration-200">
                            <UserPlus className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#ffffff]">Novo Cliente</h4>
                            <p className="text-[10px] text-brand-text-secondary">Cadastrar no fichário</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-brand-text-secondary transition-transform group-hover:translate-x-1" />
                      </div>

                      {/* Trigger Novo Evento */}
                      <div 
                        onClick={() => handleOpenBottomSheet('event', 'create')}
                        className="bg-brand-bg border border-brand-border hover:border-brand-accent/40 p-4 rounded-2xl cursor-pointer transition duration-150 group flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-brand-accent/10 text-brand-accent rounded-xl border border-brand-accent/20 group-hover:bg-brand-accent group-hover:text-brand-bg transition duration-200">
                            <CalendarPlus className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#ffffff]">Novo Evento</h4>
                            <p className="text-[10px] text-brand-text-secondary">Reservar bar e data</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-brand-text-secondary transition-transform group-hover:translate-x-1" />
                      </div>

                      {/* Trigger Registrar Pagamento */}
                      <div 
                        onClick={() => handleOpenBottomSheet('payment', 'create')}
                        className="bg-brand-bg border border-brand-border hover:border-brand-accent/40 p-4 rounded-2xl cursor-pointer transition duration-150 group flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-brand-accent/10 text-brand-accent rounded-xl border border-brand-accent/20 group-hover:bg-brand-accent group-hover:text-brand-bg transition duration-200">
                            <BadgeDollarSign className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#ffffff]">Nova Parcela</h4>
                            <p className="text-[10px] text-brand-text-secondary">Registrar transação</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-brand-text-secondary transition-transform group-hover:translate-x-1" />
                      </div>

                    </div>
                  </div>

                  {/* Upcoming events timeline section */}
                  <div className="bg-brand-surface border border-brand-border p-5 rounded-2xl flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs uppercase tracking-widest font-extrabold text-brand-text-secondary">
                        Próximas Festas & Agendas
                      </h3>
                      <button 
                        onClick={() => handleTabChange('events')}
                        className="text-[10px] text-brand-accent font-bold hover:underline"
                      >
                        Ver agenda completa
                      </button>
                    </div>

                    {upcomingEvents.length > 0 ? (
                      <div className="flex flex-col gap-3">
                        {upcomingEvents.map(ev => {
                          const [year, m, d] = ev.date.split('-');
                          const formatted = `${d}/${m}/${year}`;
                          return (
                            <div 
                              key={ev.id}
                              onClick={() => {
                                handleTabChange('events');
                                triggerPushState('event_details');
                                setNavigation(prev => ({ ...prev, activeEventDetailId: ev.id }));
                              }}
                              className="bg-brand-bg border border-brand-border hover:border-white/10 p-3.5 rounded-xl flex items-center justify-between cursor-pointer transition animate-none"
                            >
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className="p-2 bg-brand-surface border border-brand-border rounded-xl text-brand-text-secondary text-center text-[10px] font-mono leading-none flex flex-col shrink-0 min-w-[42px]">
                                  <span className="text-xs font-bold text-brand-accent">{d}</span>
                                  <span className="uppercase text-[8px] mt-0.5">{m}</span>
                                </div>
                                <div className="overflow-hidden">
                                  <h4 className="text-xs font-bold text-brand-text-primary truncate">{ev.name}</h4>
                                  <span className="text-[10px] text-brand-text-secondary block truncate">Contratante: {ev.clientName} | {ev.drinkPackage}</span>
                                </div>
                              </div>

                              <div className="text-right pl-2 shrink-0">
                                <span className={`inline-block px-2 py-0.5 border text-[9px] uppercase font-bold rounded-lg ${
                                  ev.status === 'confirmado' 
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15'
                                    : 'bg-amber-500/10 text-amber-400 border-amber-500/15'
                                }`}>
                                  {ev.status}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-brand-bg/40 rounded-2xl border border-dashed border-brand-border text-xs text-brand-text-secondary">
                        Nenhum evento ativo programado atualmente no calendário.
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TELA 2 - CLIENTS */}
              {navigation.tab === 'clients' && (
                <ClientManagement
                  clients={clients}
                  events={events}
                  contracts={contracts}
                  onAddClient={() => handleOpenBottomSheet('client', 'create')}
                  onEditClient={(c) => handleOpenBottomSheet('client', 'edit', c.id)}
                  onDeleteClient={handleDeleteClient}
                  onSelectContract={(id) => {
                    triggerPushState('contract_editor');
                    setNavigation(prev => ({ ...prev, activeContractEditorId: id }));
                  }}
                />
              )}

              {/* TELA 3 - EVENTS */}
              {navigation.tab === 'events' && (
                <EventManagement
                  events={events}
                  clients={clients}
                  onAddEvent={() => handleOpenBottomSheet('event', 'create')}
                  onEditEvent={(ev) => handleOpenBottomSheet('event', 'edit', ev.id)}
                  onDeleteEvent={handleDeleteEvent}
                  onGenerateContract={handleLaunchAutomaticContract}
                />
              )}

              {/* TELA 4 - PAYMENTS */}
              {navigation.tab === 'payments' && (
                <PaymentManagement
                  payments={payments}
                  onAddPayment={() => handleOpenBottomSheet('payment', 'create')}
                  onEditPayment={(pay) => handleOpenBottomSheet('payment', 'edit', pay.id)}
                  onDeletePayment={handleDeletePayment}
                  onMarkAsPaid={handleMarkAsPaid}
                />
              )}

              {/* TELA 5 - CONTRACTS */}
              {navigation.tab === 'contracts' && (
                <ContractManagement
                  contracts={contracts}
                  onAddContract={() => {
                    triggerPushState('contract_editor');
                    // Launch plain empty sheet
                    setNavigation(prev => ({ ...prev, activeContractEditorId: 'new' }));
                  }}
                  onEditContract={(c) => {
                    triggerPushState('contract_editor');
                    setNavigation(prev => ({ ...prev, activeContractEditorId: c.id }));
                  }}
                  onDeleteContract={handleDeleteContract}
                  onSelectContract={(id) => {
                    triggerPushState('contract_editor');
                    setNavigation(prev => ({ ...prev, activeContractEditorId: id }));
                  }}
                />
              )}

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER TAB NAV BAR - For PWA Mobile Native look, stickies on hand - Hides on Print */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-brand-surface/95 backdrop-blur-lg border-t border-brand-border p-2 sm:p-3 print:hidden safe-bottom">
        <div className="max-w-md mx-auto flex items-center justify-between px-4">
          
          <button
            onClick={() => handleTabChange('dashboard')}
            className={`flex flex-col items-center gap-1 p-1 sm:p-2 transition duration-200 outline-none cursor-pointer ${
              navigation.tab === 'dashboard' ? 'text-brand-accent font-bold' : 'text-brand-text-secondary hover:text-brand-text-primary'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 shrink-0" />
            <span className="text-[9px] font-bold tracking-tight uppercase">Painel</span>
          </button>

          <button
            onClick={() => handleTabChange('clients')}
            className={`flex flex-col items-center gap-1 p-1 sm:p-2 transition duration-200 outline-none cursor-pointer ${
              navigation.tab === 'clients' ? 'text-brand-accent font-bold' : 'text-brand-text-secondary hover:text-brand-text-primary'
            }`}
          >
            <Users className="w-5 h-5 shrink-0" />
            <span className="text-[9px] font-bold tracking-tight uppercase">Clientes</span>
          </button>

          <button
            onClick={() => handleTabChange('events')}
            className={`flex flex-col items-center gap-1 p-1 sm:p-2 transition duration-200 outline-none cursor-pointer ${
              navigation.tab === 'events' ? 'text-brand-accent font-bold' : 'text-brand-text-secondary hover:text-brand-text-primary'
            }`}
          >
            <Calendar className="w-5 h-5 shrink-0" />
            <span className="text-[9px] font-bold tracking-tight uppercase">Eventos</span>
          </button>

          <button
            onClick={() => handleTabChange('payments')}
            className={`flex flex-col items-center gap-1 p-1 sm:p-2 transition duration-200 outline-none cursor-pointer ${
              navigation.tab === 'payments' ? 'text-brand-accent font-bold' : 'text-brand-text-secondary hover:text-brand-text-primary'
            }`}
          >
            <DollarSign className="w-5 h-5 shrink-0" />
            <span className="text-[9px] font-bold tracking-tight uppercase">Entradas</span>
          </button>

          <button
            onClick={() => handleTabChange('contracts')}
            className={`flex flex-col items-center gap-1 p-1 sm:p-2 transition duration-200 outline-none cursor-pointer ${
              navigation.tab === 'contracts' ? 'text-brand-accent font-bold' : 'text-brand-text-secondary hover:text-brand-text-primary'
            }`}
          >
            <FileText className="w-5 h-5 shrink-0" />
            <span className="text-[9px] font-bold tracking-tight uppercase">Contratos</span>
          </button>

        </div>
      </footer>

      {/* GLOBAL SLIDE UP DRAWERS / BOTTOM SHEET INTEGRATIONS */}
      {/* 1. CLIENT FORM BOTTOM SHEET */}
      <BottomSheet
        isOpen={navigation.isBottomSheetOpen && navigation.bottomSheetType === 'client'}
        onClose={handleCloseBottomSheet}
        title={navigation.bottomSheetAction === 'create' ? 'Cadastrar Novo Cliente' : 'Editar Dados do Cliente'}
      >
        <form onSubmit={handleSaveClientForm} className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-semibold text-brand-text-secondary mb-1">Nome Completo</label>
              <input
                type="text"
                required
                placeholder="Ex. Helena Ribeiro Castro"
                value={clientForm.name}
                onChange={(e) => setClientForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-brand-bg border border-brand-border text-brand-text-primary rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-brand-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-text-secondary mb-1">Whatsapp de Contato</label>
              <PhoneInput
                placeholder="Ex. (51) 99823-4554"
                value={clientForm.phone}
                onChange={(val: string) => setClientForm(prev => ({ ...prev, phone: val }))}
                className="w-full bg-brand-bg border border-brand-border text-brand-text-primary rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-brand-accent focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-brand-text-secondary mb-1">E-mail</label>
              <input
                type="email"
                placeholder="Ex. helena@email.com"
                value={clientForm.email}
                onChange={(e) => setClientForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full bg-brand-bg border border-brand-border text-brand-text-primary rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-brand-accent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Notas do Atendimento & Preferências</label>
            <textarea
              rows={4}
              placeholder="Ex. Noiva solicitou bar móvel rústico e coquetéis sem álcool..."
              value={clientForm.notes}
              onChange={(e) => setClientForm(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-150 rounded-xl p-3 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-[#141517] font-bold text-xs rounded-xl shadow-lg transition mt-2"
          >
            {navigation.bottomSheetAction === 'create' ? 'Cadastrar Cliente' : 'Salvar Alterações'}
          </button>
        </form>
      </BottomSheet>

      {/* 2. EVENT FORM BOTTOM SHEET */}
      <BottomSheet
        isOpen={navigation.isBottomSheetOpen && navigation.bottomSheetType === 'event'}
        onClose={handleCloseBottomSheet}
        title={navigation.bottomSheetAction === 'create' ? 'Agendar Novo Evento' : 'Editar Configuração do Evento'}
      >
        <form onSubmit={handleSaveEventForm} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-brand-text-secondary mb-1">Unidade Contratante (Cliente)</label>
            <CustomSelect
              disabled={navigation.bottomSheetAction === 'edit'}
              value={eventForm.clientId}
              onChange={(val: string) => setEventForm(prev => ({ ...prev, clientId: val }))}
              options={[{ value: '', label: 'Selecione quem está contratando...' }, ...clients.map(c => ({ value: c.id, label: c.name }))]}
              className="w-full bg-brand-bg border border-brand-border text-brand-text-primary rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-brand-accent focus:outline-none disabled:opacity-40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Título / Identificador da Festa</label>
            <input
              type="text"
              required
              placeholder="Ex. Casamento Helena & Roberto"
              value={eventForm.name}
              onChange={(e) => setEventForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-150 rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-semibold text-brand-text-secondary mb-1">Data do Evento</label>
              <CustomDatePicker
                required
                value={eventForm.date}
                onChange={(val: string) => setEventForm(prev => ({ ...prev, date: val }))}
                className="w-full bg-brand-bg border border-brand-border text-brand-text-primary rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-brand-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-text-secondary mb-1">Convidados</label>
              <input
                type="number"
                required
                min="1"
                value={eventForm.guestCount}
                onChange={(e) => setEventForm(prev => ({ ...prev, guestCount: Number(e.target.value) }))}
                className="w-full bg-brand-bg border border-brand-border text-brand-text-primary rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-brand-accent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Endereço do Local</label>
            <input
              type="text"
              placeholder="Ex. Avenida de Gramado, 120 - Recanto das Hortênsias"
              value={eventForm.location}
              onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-150 rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-semibold text-brand-text-secondary mb-1">Plano de Bebidas / Menu</label>
              <CustomSelect
                value={eventForm.drinkPackage}
                onChange={(val: string) => setEventForm(prev => ({ ...prev, drinkPackage: val }))}
                options={[
                  { value: 'Premium Completo 5 Horas', label: 'Premium Completo 5h' },
                  { value: 'Básico Caipirinhas & Gin 4 Horas', label: 'Básico Caipis & Gin 4h' },
                  { value: 'Somente Sem Álcool & Aperol', label: 'Sem Álcool & Aperol' },
                  { value: 'Customizado/Personalizado', label: 'Customizado Único' }
                ]}
                className="w-full bg-brand-bg border border-brand-border text-brand-text-primary rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-brand-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-text-secondary mb-1">Orçamento Cobrado (R$)</label>
              <CurrencyInput
                required
                value={eventForm.price}
                onChange={(val: number) => setEventForm(prev => ({ ...prev, price: val }))}
                className="w-full bg-brand-bg border border-brand-border text-brand-text-primary rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-brand-accent focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-[#141517] font-bold text-xs rounded-xl shadow-lg transition mt-2"
          >
            {navigation.bottomSheetAction === 'create' ? 'Agendar & Criar Evento' : 'Salvar Alterações'}
          </button>
        </form>
      </BottomSheet>

      {/* 3. PAYMENT FORM BOTTOM SHEET */}
      <BottomSheet
        isOpen={navigation.isBottomSheetOpen && navigation.bottomSheetType === 'payment'}
        onClose={handleCloseBottomSheet}
        title={navigation.bottomSheetAction === 'create' ? 'Registrar Novo Pagamento' : 'Editar Registro Financeiro'}
      >
        <form onSubmit={handleSavePaymentForm} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-brand-text-secondary mb-1">Cliente Associado</label>
            <CustomSelect
              disabled={navigation.bottomSheetAction === 'edit'}
              value={paymentForm.clientId}
              onChange={(val: string) => setPaymentForm(prev => ({ ...prev, clientId: val, eventId: '' }))}
              options={[{ value: '', label: 'Selecione o titular pagador...' }, ...clients.map(c => ({ value: c.id, label: c.name }))]}
              className="w-full bg-brand-bg border border-brand-border text-brand-text-primary rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-brand-accent focus:outline-none disabled:opacity-40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-text-secondary mb-1">Evento Vinculado</label>
            <CustomSelect
              value={paymentForm.eventId}
              onChange={(val: string) => setPaymentForm(prev => ({ ...prev, eventId: val }))}
              options={[
                { value: '', label: 'Selecione a festa correspondente...' },
                ...events.filter(ev => !paymentForm.clientId || ev.clientId === paymentForm.clientId).map(ev => ({ value: ev.id, label: ev.name }))
              ]}
              className="w-full bg-brand-bg border border-brand-border text-brand-text-primary rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-brand-accent focus:outline-none disabled:opacity-40"
            />
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-semibold text-brand-text-secondary mb-1">Valor da Parcela (R$)</label>
              <CurrencyInput
                required
                value={paymentForm.amount}
                onChange={(val: number) => setPaymentForm(prev => ({ ...prev, amount: val }))}
                className="w-full bg-brand-bg border border-brand-border text-brand-text-primary rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-brand-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-text-secondary mb-1">Data de Vencimento</label>
              <CustomDatePicker
                required
                value={paymentForm.dueDate}
                onChange={(val: string) => setPaymentForm(prev => ({ ...prev, dueDate: val }))}
                className="w-full bg-brand-bg border border-brand-border text-brand-text-primary rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-brand-accent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-text-secondary mb-1">Status da Entrada</label>
            <CustomSelect
              value={paymentForm.status}
              onChange={(val: any) => setPaymentForm(prev => ({ ...prev, status: val }))}
              options={[
                { value: 'pendente', label: 'Pendente / Aguardando' },
                { value: 'pago', label: 'Quitado / Recebido' },
                { value: 'atrasado', label: 'Atrasado em Cobrança' }
              ]}
              className="w-full bg-brand-bg border border-brand-border text-brand-text-primary rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-brand-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Observações Financeiras (Opcional)</label>
            <input
              type="text"
              placeholder="Ex. Dividido em 2x no PIX, correspondendo ao sinal de reserva..."
              value={paymentForm.notes}
              onChange={(e) => setPaymentForm(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-150 rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-[#141517] font-bold text-xs rounded-xl shadow-lg transition mt-2"
          >
            {navigation.bottomSheetAction === 'create' ? 'Registrar Recebimento' : 'Salvar Alterações'}
          </button>
        </form>
      </BottomSheet>

      {/* 4. SETTINGS BOTTOM SHEET */}
      <BottomSheet
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="Configurações do Sistema"
      >
        <div className="flex flex-col gap-6">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-4 bg-brand-surface rounded-xl border border-brand-border shadow-sm">
            <div>
              <h4 className="text-sm font-bold text-brand-text-primary">Aparência do PWA</h4>
              <p className="text-xs text-brand-text-secondary mt-0.5">Mudar entre modo claro e escuro</p>
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 bg-brand-bg rounded-xl text-brand-text-secondary hover:text-brand-accent transition flex items-center justify-center border border-brand-border"
            >
              {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </div>

          {/* Profile Name */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-brand-text-primary border-b border-brand-border pb-2">Seu Perfil (Contratos)</h4>
            <div>
              <label className="block text-xs font-semibold text-brand-text-secondary mb-1">Nome do Prestador/Responsável</label>
              <input
                type="text"
                placeholder="Ex. Eric Fernando"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full bg-brand-surface border border-brand-border text-brand-text-primary rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-brand-accent focus:outline-none"
              />
            </div>
            <button
              onClick={() => {
                localStorage.setItem('mix_profile_name', profileName);
                setIsSettingsOpen(false);
              }}
              className="w-full py-2.5 bg-brand-accent hover:bg-brand-accent/90 text-brand-bg font-bold text-xs rounded-xl shadow-lg transition mt-1"
            >
              Salvar Perfil
            </button>
          </div>

          {/* Dev Info (Easter Egg) */}
          {profileName.toLowerCase() === 'devinfo' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-xl flex flex-col gap-3"
            >
              <div className="flex items-center gap-2 text-blue-500 border-b border-blue-500/20 pb-2">
                <Github className="w-4 h-4" />
                <h4 className="text-sm font-bold">Sobre o Desenvolvedor</h4>
              </div>
              
              <div className="flex flex-col gap-1 text-xs">
                <p className="text-brand-text-primary"><span className="text-blue-500/80 font-mono">Último commit:</span> d8f9e2a - "Ajustes PWA e UI"</p>
                <p className="text-brand-text-primary"><span className="text-blue-500/80 font-mono">Data:</span> 06 de Junho de 2026</p>
              </div>

              <button
                onClick={() => window.location.reload()}
                className="mt-2 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Forçar Atualização
              </button>
            </motion.div>
          )}

        </div>
      </BottomSheet>

    </div>
  );
}
