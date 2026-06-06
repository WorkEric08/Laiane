/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Payment } from '../types';
import { 
  DollarSign, Search, Calendar, ChevronRight, CheckCircle2,
  AlertCircle, Clock, Trash2, Edit, Plus, Filter, CornerDownRight 
} from 'lucide-react';
import { motion } from 'motion/react';

interface PaymentManagementProps {
  payments: Payment[];
  onAddPayment: () => void;
  onEditPayment: (payment: Payment) => void;
  onDeletePayment: (id: string) => void;
  onMarkAsPaid: (id: string) => void;
}

export default function PaymentManagement({
  payments,
  onAddPayment,
  onEditPayment,
  onDeletePayment,
  onMarkAsPaid,
}: PaymentManagementProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'todos' | 'pago' | 'pendente' | 'atrasado'>('todos');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Financial status computations
  const totalReceived = payments
    .filter(p => p.status === 'pago')
    .reduce((acc, p) => acc + p.amount, 0);

  const totalReceivable = payments
    .filter(p => p.status === 'pendente')
    .reduce((acc, p) => acc + p.amount, 0);

  const totalOverdue = payments
    .filter(p => p.status === 'atrasado')
    .reduce((acc, p) => acc + p.amount, 0);

  // Filters application
  const filteredPayments = payments.filter(p => {
    const searchMatch = p.clientName.toLowerCase().includes(search.toLowerCase()) ||
                        p.eventName.toLowerCase().includes(search.toLowerCase());
    const filterMatch = filter === 'todos' || p.status === filter;
    return searchMatch && filterMatch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pago':
        return (
          <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/10 text-[9px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Recebido
          </span>
        );
      case 'pendente':
        return (
          <span className="px-2 py-0.5 bg-amber-500/15 text-amber-400 border border-amber-500/10 text-[9px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-2.5 h-2.5 animate-pulse" />
            Pendente
          </span>
        );
      case 'atrasado':
        return (
          <span className="px-2 py-0.5 bg-red-500/15 text-red-400 border border-red-500/10 text-[9px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
            <AlertCircle className="w-2.5 h-2.5" />
            Atrasado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div id="payments-view-container" className="flex flex-col gap-6 w-full">
      {/* Top action metrics banner */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-brand-text-primary tracking-tight font-sans">Controle de Entradas</h2>
          <p className="text-xs text-brand-text-secondary">Gerencie recebimentos de parcelas, depósitos e orçamentos globais</p>
        </div>
        
        <button
          onClick={onAddPayment}
          className="py-2.5 px-4 bg-brand-accent hover:bg-brand-accent/90 text-brand-bg font-semibold text-xs rounded-xl shadow-lg shadow-brand-accent/10 flex items-center justify-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Registrar Pagamento
        </button>
      </div>

      {/* Side-by-side Finance Summary Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-brand-surface border border-brand-border p-4 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute right-3 top-3 p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/15">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-semibold text-brand-text-secondary uppercase tracking-widest block mb-1">Recebidos</span>
          <span className="text-lg font-bold text-emerald-500 font-sans tracking-tight block">
            R$ {totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="bg-brand-surface border border-brand-border p-4 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute right-3 top-3 p-2 bg-brand-accent/10 text-brand-accent rounded-xl border border-brand-accent/15">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-semibold text-brand-text-secondary uppercase tracking-widest block mb-1">A Receber</span>
          <span className="text-lg font-bold text-brand-accent font-sans tracking-tight block">
            R$ {totalReceivable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="bg-brand-surface border border-brand-border p-4 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute right-3 top-3 p-2 bg-red-500/10 text-red-500 rounded-xl border border-red-500/15">
            <AlertCircle className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-semibold text-brand-text-secondary uppercase tracking-widest block mb-1">Atrasados</span>
          <span className="text-lg font-bold text-red-400 font-sans tracking-tight block">
            R$ {totalOverdue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Filter and search utilities block */}
      <div className="flex flex-col gap-4">
        {/* Filters pills row */}
        <div className="flex items-center gap-2 overflow-x-auto shrink-0 py-0.5 border-b border-brand-border/40 pb-3">
          <span className="text-brand-text-secondary text-xs font-semibold uppercase tracking-wider flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5" />
            Filtros:
          </span>
          {(['todos', 'pago', 'pendente', 'atrasado'] as const).map((curr) => {
            const labels = { todos: 'Todos', pago: 'Recebidos (Pagos)', pendente: 'Pendentes', atrasado: 'Atrasados' };
            return (
              <button
                key={curr}
                onClick={() => setFilter(curr)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition shrink-0 ${
                  filter === curr
                    ? 'bg-brand-accent/15 text-brand-accent border border-brand-accent/20 font-bold'
                    : 'bg-brand-surface text-brand-text-secondary hover:text-brand-text-primary border border-transparent'
                }`}
              >
                {labels[curr]}
              </button>
            );
          })}
        </div>

        {/* Searching tool */}
        <div className="relative w-full text-brand-text-secondary">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brand-text-secondary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome do cliente ou pelo evento..."
            className="w-full bg-brand-surface border border-brand-border rounded-xl pl-11 pr-4 py-2.5 text-xs text-brand-text-primary placeholder-brand-text-secondary/50 focus:ring-1 focus:ring-brand-accent focus:outline-none transition"
          />
        </div>
      </div>

      {/* Grid structure of payments */}
      {filteredPayments.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filteredPayments.map(p => (
            <div
              key={p.id}
              className="bg-brand-surface border border-brand-border p-4 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:border-brand-border/60 transition"
            >
              {/* Left group info */}
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <div className={`p-3 rounded-xl border shrink-0 ${
                  p.status === 'pago' 
                    ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10' 
                    : p.status === 'atrasado'
                    ? 'bg-red-500/5 text-red-400 border-red-500/10'
                    : 'bg-brand-accent/5 text-brand-accent border-brand-accent/10'
                }`}>
                  <DollarSign className="w-5 h-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#ffffff] font-bold text-sm tracking-tight truncate block font-mono">
                      R$ {Number(p.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    {getStatusBadge(p.status)}
                  </div>
                  
                  <div className="text-xs text-brand-text-secondary font-medium font-sans">
                    Contratante: <span className="text-brand-text-primary font-bold">{p.clientName}</span>
                  </div>
                  
                  <div className="text-[11px] text-brand-text-secondary flex items-center gap-1 mt-0.5 font-mono">
                    <CornerDownRight className="w-3.5 h-3.5 shrink-0 text-brand-text-secondary/50" />
                    Evento: <span className="truncate">{p.eventName}</span>
                  </div>
                </div>
              </div>

              {/* Right timing details & quick action controls */}
              <div className="flex items-center justify-between md:justify-end gap-5 border-t border-brand-border/40 md:border-0 pt-3 md:pt-0 shrink-0">
                <div className="text-left md:text-right text-[11px] text-brand-text-secondary font-mono">
                  <span className="block text-brand-text-secondary/75">Vencimento</span>
                  <span className="font-semibold text-brand-text-primary">{(() => {
                    const [year, m, d] = p.dueDate.split('-');
                    return `${d}/${m}/${year}`;
                  })()}</span>
                  {p.payDate && (
                    <span className="block text-emerald-500 text-[10px] mt-0.5 font-bold">Pago em: {(() => {
                      const [year, m, d] = p.payDate.split('-');
                      return `${d}/${m}/${year}`;
                    })()}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {p.status !== 'pago' && (
                    <button
                      onClick={() => onMarkAsPaid(p.id)}
                      className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg cursor-pointer transition"
                      title="Marcar como Pago"
                    >
                      Dar Baixa
                    </button>
                  )}
                  <button
                    onClick={() => onEditPayment(p)}
                    className="p-1.5 hover:bg-brand-bg rounded-lg text-brand-text-secondary hover:text-brand-text-primary transition border border-transparent cursor-pointer"
                    title="Editar"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(p.id)}
                    className="p-1.5 hover:bg-red-950/20 rounded-lg text-brand-text-secondary hover:text-red-400 transition cursor-pointer"
                    title="Excluir"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-brand-surface border border-dashed border-brand-border text-xs text-brand-text-secondary rounded-2xl">
          Nenhum registro de pagamento correspondente encontrado.
        </div>
      )}

      {/* Delete conformation popup modal */}
      {deleteConfirmId && (
        <div id="delete-alert-payment-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setDeleteConfirmId(null)}
          />
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-10 bg-brand-surface border border-brand-border rounded-2xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-4 text-center"
          >
            <div className="mx-auto p-3 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 mb-1">
              <AlertCircle className="w-6 h-6" />
            </div>
            
            <div>
              <h4 className="text-base font-bold text-brand-text-primary">Excluir Pagamento?</h4>
              <p className="text-xs text-brand-text-secondary mt-2 leading-relaxed font-sans">
                Tem certeza que deseja apagar permanentemente esse registro financeiro de recebimento?
              </p>
            </div>

            <div className="flex gap-3 justify-center mt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 px-4 bg-brand-bg hover:bg-brand-surface border border-brand-border text-brand-text-primary rounded-xl text-xs font-semibold cursor-pointer transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDeletePayment(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold cursor-pointer transition"
              >
                Excluir Registro
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
