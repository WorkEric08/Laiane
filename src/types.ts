/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  notes?: string;
  createdAt: string;
}

export interface CocktailEvent {
  id: string;
  clientId: string;
  clientName: string;
  name: string;          // e.g., "Marina's Wedding" or "Aniversário Pedro"
  date: string;          // YYYY-MM-DD
  location: string;
  drinkPackage: string;  // e.g. "Combo Premium", "Standard - 4h", "Apenas Caipirinhas"
  guestCount: number;
  price: number;
  status: 'confirmado' | 'pendente' | 'concluido' | 'cancelado';
}

export interface Payment {
  id: string;
  clientId: string;
  clientName: string;
  eventId: string;
  eventName: string;
  amount: number;
  dueDate: string;       // YYYY-MM-DD
  payDate: string | null; // YYYY-MM-DD when paid
  status: 'pago' | 'pendente' | 'atrasado';
  notes?: string;
}

export interface Contract {
  id: string;
  clientId: string;
  clientName: string;
  eventId: string;
  eventName: string;
  date: string;
  title: string;
  content: string; // The full contract body formatted as raw markdown or simple lines
  status: 'rascunho' | 'assinado' | 'arquivado';
}

export type ActiveTab = 'dashboard' | 'clients' | 'events' | 'payments' | 'contracts';

export interface NavigationState {
  tab: ActiveTab;
  activeClientDetailId: string | null;
  activeEventDetailId: string | null;
  activeContractDetailId: string | null;
  activeContractEditorId: string | null; // 'new' or actual contract ID
  activePaymentDetailId: string | null;
  isBottomSheetOpen: boolean;
  bottomSheetType: 'client' | 'event' | 'payment' | 'contract' | null;
  bottomSheetAction: 'create' | 'edit' | null;
  editTargetId: string | null; // ID being edited if any
}
