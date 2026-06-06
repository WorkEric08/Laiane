/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CocktailEvent, Client } from '../types';
import { 
  Plus, Search, Calendar, MapPin, Wine, Users, DollarSign,
  Trash2, Edit, AlertCircle, ArrowLeft, ChevronRight, FileText, Filter
} from 'lucide-react';
import { motion } from 'motion/react';

interface EventManagementProps {
  events: CocktailEvent[];
  clients: Client[];
  onAddEvent: () => void;
  onEditEvent: (event: CocktailEvent) => void;
  onDeleteEvent: (id: string) => void;
  onGenerateContract: (clientId: string, eventId: string) => void;
}

export default function EventManagement({
  events,
  clients,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onGenerateContract,
}: EventManagementProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'pendente' | 'confirmado' | 'concluido'>('todos');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter events list
  const filteredEvents = events.filter(e => {
    const searchMatch = e.name.toLowerCase().includes(search.toLowerCase()) || 
                        e.clientName.toLowerCase().includes(search.toLowerCase()) ||
                        e.drinkPackage.toLowerCase().includes(search.toLowerCase());
                        
    const statusMatch = statusFilter === 'todos' || e.status === statusFilter;
    
    return searchMatch && statusMatch;
  });

  const selectedEvent = events.find(e => e.id === selectedEventId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmado':
        return <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold rounded-full">Confirmado</span>;
      case 'pendente':
        return <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-bold rounded-full">Pendente</span>;
      case 'concluido':
        return <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 border border-zinc-700/60 text-[9px] font-bold rounded-full">Concluído</span>;
      case 'cancelado':
        return <span className="px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] font-bold rounded-full">Cancelado</span>;
      default:
        return null;
    }
  };

  return (
    <div id="events-view-container" className="flex flex-col gap-5 w-full">
      {selectedEvent ? (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-6"
        >
          {/* Detailed event header */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedEventId(null)}
              className="p-2 bg-brand-surface border border-brand-border rounded-xl text-brand-text-secondary hover:text-brand-text-primary transition cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-brand-text-primary tracking-tight font-sans">{selectedEvent.name}</h2>
              <p className="text-xs text-brand-text-secondary">Detalhes do evento e cardápio de drinks</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column: Quick Parameters */}
            <div className="md:col-span-1 bg-brand-surface border border-brand-border p-5 rounded-2xl flex flex-col gap-5">
              <div className="border-b border-brand-border pb-3 flex items-center justify-between">
                <span className="text-brand-text-secondary text-xs font-semibold">Status do Evento</span>
                {getStatusBadge(selectedEvent.status)}
              </div>

              <div className="flex flex-col gap-3.5">
                <div className="flex items-center gap-3 text-brand-text-primary text-xs">
                  <div className="p-2 rounded-xl bg-brand-bg text-brand-accent border border-brand-border">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-brand-text-secondary font-medium">Data do Evento</span>
                    <span className="font-semibold">{(() => {
                      const [year, m, d] = selectedEvent.date.split('-');
                      return `${d}/${m}/${year}`;
                    })()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-brand-text-primary text-xs">
                  <div className="p-2 rounded-xl bg-brand-bg text-brand-accent border border-brand-border">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-brand-text-secondary font-medium font-sans">Endereço / Local</span>
                    <span className="font-semibold">{selectedEvent.location || 'Local a definir'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-brand-text-primary text-xs">
                  <div className="p-2 rounded-xl bg-brand-bg text-brand-accent border border-brand-border">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-brand-text-secondary font-medium font-sans">Estimativa de Convidados</span>
                    <span className="font-semibold">{selectedEvent.guestCount} pessoas</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-brand-text-primary text-xs">
                  <div className="p-2 rounded-xl bg-brand-bg text-brand-accent border border-brand-border">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-brand-text-secondary font-medium font-sans">Orçamento cobrado</span>
                    <span className="font-semibold text-brand-accent">
                      R$ {Number(selectedEvent.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5 mt-2 pt-3 border-t border-brand-border">
                <button
                  onClick={() => onEditEvent(selectedEvent)}
                  className="flex-1 py-1.5 px-3 bg-brand-bg hover:bg-brand-surface border border-brand-border rounded-xl text-xs text-brand-text-primary font-medium flex items-center justify-center gap-1 transition cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5 text-brand-text-secondary" />
                  Editar
                </button>
                <button
                  onClick={() => {
                    setDeleteConfirmId(selectedEvent.id);
                  }}
                  className="py-1.5 px-3 bg-red-900/10 hover:bg-red-900/20 border border-red-900/30 rounded-xl text-xs text-red-400 font-medium flex items-center justify-center gap-1 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right column: Menu, Packages & Quick Contracts links */}
            <div className="md:col-span-2 flex flex-col gap-6">
              {/* Drink package overview */}
              <div className="bg-brand-surface border border-brand-border p-5 rounded-2xl">
                <h3 className="text-sm font-semibold text-brand-text-primary mb-4 flex items-center gap-2">
                  <Wine className="w-4.5 h-4.5 text-brand-accent" />
                  Menu & Pacotes de Drinks Selecionados
                </h3>
                <div className="p-4 bg-brand-bg/50 border border-brand-border/60 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-brand-text-secondary tracking-wider">Identificador do Plano</span>
                  <p className="text-[#ffffff] text-sm font-semibold mt-0.5">{selectedEvent.drinkPackage}</p>

                  <div className="mt-4 pt-4 border-t border-brand-border text-xs text-brand-text-secondary leading-relaxed">
                    <p className="font-medium text-brand-text-primary mb-1.5">O que acompanha este plano tradicionalmente?</p>
                    <ul className="list-disc list-inside space-y-1 text-brand-text-secondary pl-1">
                      <li>Fornecimento de frutas premium (Limão siciliano, Morango, Abacaxi, Kiwi, Maracujá).</li>
                      <li>Insumos e destilados inclusos (Vodka importada, Cachaça artesanal, Gin premium).</li>
                      <li>Cardápios personalizados impressos e disponibilizados no balcão de atendimento.</li>
                      <li>Isopor de gelo e materiais térmicos profissionais para conservação dos ingredientes.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bound client reference */}
              <div className="bg-brand-surface border border-brand-border p-5 rounded-2xl flex flex-col sm:flex-row shadow-sm sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs text-brand-text-secondary font-medium">Contratante do Evento</h4>
                  <p className="text-sm font-bold text-[#ffffff] mt-0.5">{selectedEvent.clientName}</p>
                </div>

                <button
                  onClick={() => onGenerateContract(selectedEvent.clientId, selectedEvent.id)}
                  className="py-2 px-3.5 bg-brand-accent/10 hover:bg-brand-accent/20 border border-brand-accent/20 rounded-xl text-xs text-brand-accent font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer font-sans"
                >
                  <FileText className="w-4 h-4" />
                  Gerar Contrato Formatado A4
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        /* Event listing view */
        <div className="flex flex-col gap-5">
          {/* Header */}
          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-brand-text-primary tracking-tight font-sans">Agenda de Eventos</h2>
              <p className="text-xs text-brand-text-secondary font-sans">Configure orçamentos, datas e pacotes de coquetelaria por debaixo de cada festa</p>
            </div>
            
            <button
              onClick={onAddEvent}
              className="py-2.5 px-4 bg-brand-accent hover:bg-brand-accent/90 text-brand-bg font-semibold text-xs rounded-xl shadow-lg shadow-brand-accent/10 flex items-center justify-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Novo Evento
            </button>
          </div>

          {/* Quick Filter tabs & Search layout */}
          <div className="flex flex-col md:flex-row gap-3 w-full">
            {/* Search inputs */}
            <div className="relative flex-1 text-brand-text-secondary">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brand-text-secondary" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome do evento, cliente ou pacote..."
                className="w-full bg-brand-surface border border-brand-border rounded-xl pl-11 pr-4 py-2.5 text-xs text-brand-text-primary placeholder-brand-text-secondary/50 focus:ring-1 focus:ring-brand-accent focus:outline-none transition animate-none"
              />
            </div>

            {/* Quick Filter Select tab pills */}
            <div className="flex bg-brand-surface border border-brand-border p-0.5 rounded-xl shrink-0 overflow-x-auto gap-0.5 text-brand-text-secondary">
              {(['todos', 'pendente', 'confirmado', 'concluido'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                    statusFilter === status
                      ? 'bg-brand-accent/15 text-brand-accent font-bold'
                      : 'text-brand-text-secondary hover:text-brand-text-primary'
                  }`}
                >
                  {status === 'todos' ? 'Todos' : status}
                </button>
              ))}
            </div>
          </div>

          {/* Grid listing */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents.map(ev => (
                <div
                  key={ev.id}
                  className="bg-brand-surface border border-brand-border rounded-2xl p-4 flex flex-col justify-between hover:border-brand-border/60 transition duration-150 shadow-md"
                >
                  <div 
                    onClick={() => setSelectedEventId(ev.id)}
                    className="cursor-pointer group flex-1"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <h3 className="text-sm font-bold text-brand-text-primary group-hover:text-brand-accent transition line-clamp-1">
                        {ev.name}
                      </h3>
                      <div className="shrink-0">{getDateBadge(ev.date)}</div>
                    </div>

                    <div className="flex flex-col gap-1.5 text-xs text-brand-text-secondary mt-2.5 pt-2.5 border-t border-brand-border/40 font-mono font-sans">
                      <span className="flex items-center gap-1.5 text-brand-text-primary">
                        <Users className="w-3.5 h-3.5 text-brand-text-secondary/60 shrink-0" />
                        Cliente: <b>{ev.clientName}</b>
                      </span>
                      <span className="flex items-center gap-1.5 text-brand-text-secondary text-[11px] truncate">
                        <Wine className="w-3.5 h-3.5 text-brand-text-secondary/60 shrink-0" />
                        {ev.drinkPackage}
                      </span>
                      <span className="flex items-center gap-1.5 text-brand-text-secondary text-[11px] truncate">
                        <MapPin className="w-3.5 h-3.5 text-brand-text-secondary/60 shrink-0" />
                        {ev.location || 'Local a definir'}
                      </span>
                    </div>
                  </div>

                  {/* Actions and Pricing area */}
                  <div className="flex items-center justify-between border-t border-brand-border/40 mt-4 pt-3 gap-2 shrink-0">
                    <div>
                      <span className="block text-[9px] text-brand-text-secondary uppercase font-bold tracking-wider">Orçamento</span>
                      <span className="text-sm font-bold text-brand-accent">
                        R$ {Number(ev.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEditEvent(ev)}
                        className="p-1.5 hover:bg-brand-bg rounded-lg text-brand-text-secondary hover:text-brand-text-primary transition cursor-pointer"
                        title="Editar Evento"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(ev.id)}
                        className="p-1.5 hover:bg-red-950/20 rounded-lg text-brand-text-secondary hover:text-red-400 transition cursor-pointer"
                        title="Excluir Evento"
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
              Nenhum evento encontrado para as seleções correntes.
            </div>
          )}
        </div>
      )}

      {/* Delete Popup dialog */}
      {deleteConfirmId && (
        <div id="delete-alert-event-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
              <h4 className="text-base font-bold text-brand-text-primary">Excluir Evento?</h4>
              <p className="text-xs text-brand-text-secondary mt-2 leading-relaxed font-sans">
                Tem certeza que deseja excluir esta agenda? Todos os dados financeiros deste orçamento serão cancelados.
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
                  onDeleteEvent(deleteConfirmId);
                  setDeleteConfirmId(null);
                  setSelectedEventId(null);
                }}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold cursor-pointer transition"
              >
                Confirmar Exclusão
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// Quick tiny helper function for elegant small tag-dates inside lists
function getDateBadge(rawDate: string) {
  if (!rawDate) return null;
  const parts = rawDate.split('-');
  if (parts.length < 3) return null;
  const [, monthStr, dayStr] = parts;
  
  const monthsAbbr: { [k: string]: string } = {
    '01': 'Jan', '02': 'Fev', '03': 'Mar', '04': 'Abr', '05': 'Mai', '06': 'Jun',
    '07': 'Jul', '08': 'Ago', '09': 'Set', '10': 'Out', '11': 'Nov', '12': 'Dez'
  };
  
  return (
    <div className="bg-brand-surface rounded-lg p-1.5 px-2.5 border border-brand-border flex flex-col items-center">
      <span className="text-xs font-bold text-brand-accent">{dayStr}</span>
      <span className="text-[9px] uppercase tracking-wider text-brand-text-secondary font-mono font-medium">{monthsAbbr[monthStr] || 'Mês'}</span>
    </div>
  );
}
