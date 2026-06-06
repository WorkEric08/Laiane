/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Client, CocktailEvent, Contract } from '../types';
import { 
  Plus, Search, Phone, Mail, FileText, ChevronRight, 
  Trash2, Edit, Calendar, AlertCircle, ArrowLeft, CheckCircle 
} from 'lucide-react';
import { motion } from 'motion/react';

interface ClientManagementProps {
  clients: Client[];
  events: CocktailEvent[];
  contracts: Contract[];
  onAddClient: () => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
  onSelectContract: (contractId: string) => void;
}

export default function ClientManagement({
  clients,
  events,
  contracts,
  onAddClient,
  onEditClient,
  onDeleteClient,
  onSelectContract,
}: ClientManagementProps) {
  const [search, setSearch] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Search filter
  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const getClientEventStatus = (clientId: string) => {
    const clientEvents = events.filter(e => e.clientId === clientId);
    const active = clientEvents.some(e => e.status === 'confirmado' || e.status === 'pendente');
    return active;
  };

  const getActiveEvent = (clientId: string) => {
    return events.find(e => e.clientId === clientId && (e.status === 'confirmado' || e.status === 'pendente'));
  };

  const getClientContracts = (clientId: string) => {
    return contracts.filter(c => c.clientId === clientId);
  };

  const selectedClient = clients.find(c => c.id === selectedClientId);

  return (
    <div id="clients-view-container" className="flex flex-col gap-5 w-full">
      {/* If a specific client is selected, show details page (sub-page layout with hardware back behavior synced) */}
      {selectedClient ? (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-6"
        >
          {/* Sub-header with back action */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedClientId(null)}
              className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-100 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-zinc-100 tracking-tight">{selectedClient.name}</h2>
              <p className="text-xs text-zinc-400">Ficha detalhada do cliente</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column: profile parameters */}
            <div className="md:col-span-1 bg-brand-surface border border-brand-border p-5 rounded-2xl flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-brand-text-primary border-b border-brand-border pb-2">Informações de Contato</h3>
              
              <div className="flex items-center gap-3 text-brand-text-primary text-xs">
                <div className="p-2 rounded-xl bg-brand-bg text-brand-accent border border-brand-border">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-brand-text-secondary font-medium">Telefone</span>
                  <span className="font-semibold">{selectedClient.phone || 'Não informado'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-brand-text-primary text-xs">
                <div className="p-2 rounded-xl bg-brand-bg text-brand-accent border border-brand-border">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <span className="block text-brand-text-secondary font-medium">E-mail</span>
                  <span className="font-semibold block truncate">{selectedClient.email || 'Não informado'}</span>
                </div>
              </div>

              {selectedClient.notes && (
                <div className="mt-2 p-3.5 bg-brand-bg/50 rounded-xl border border-brand-border/60">
                  <span className="block text-[10px] text-brand-text-secondary font-bold uppercase tracking-wider mb-1">Notas do Bartender</span>
                  <p className="text-brand-text-primary text-xs whitespace-pre-line leading-relaxed">{selectedClient.notes}</p>
                </div>
              )}

              <div className="flex gap-2.5 mt-4">
                <button
                  onClick={() => onEditClient(selectedClient)}
                  className="flex-1 py-2 px-3 bg-brand-bg hover:bg-brand-surface border border-brand-border rounded-xl text-xs text-brand-text-primary font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5 text-brand-text-secondary" />
                  Editar
                </button>
                <button
                  onClick={() => {
                    setDeleteConfirmId(selectedClient.id);
                  }}
                  className="py-2 px-3 bg-red-900/10 hover:bg-red-900/20 border border-red-900/30 rounded-xl text-xs text-red-400 font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Excluir
                </button>
              </div>
            </div>

            {/* Right column: Active event + Contracts History */}
            <div className="md:col-span-2 flex flex-col gap-6">
              {/* Active events card info */}
              <div className="bg-brand-surface border border-brand-border p-5 rounded-2xl">
                <h3 className="text-sm font-semibold text-brand-text-primary mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-accent" />
                  Status de Eventos
                </h3>

                {getActiveEvent(selectedClient.id) ? (
                  (() => {
                    const ev = getActiveEvent(selectedClient.id)!;
                    return (
                      <div className="p-4 bg-brand-bg/80 rounded-xl border border-brand-border flex items-center justify-between">
                        <div>
                          <span className="inline-block px-2 py-0.5 bg-brand-accent/10 text-brand-accent border border-brand-accent/20 text-[9px] uppercase font-bold rounded-md mb-2">
                            Evento Ativo: {ev.status}
                          </span>
                          <h4 className="text-sm font-bold text-brand-text-primary">{ev.name}</h4>
                          <p className="text-xs text-brand-text-secondary mt-1">{ev.drinkPackage} • {ev.guestCount} convidados</p>
                          <p className="text-[11px] text-brand-text-secondary mt-0.5">Previsão: {ev.date}</p>
                        </div>
                        <span className="text-sm font-bold text-brand-accent">
                          R$ {Number(ev.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    );
                  })()
                ) : (
                  <div className="text-center py-6 bg-brand-bg/30 rounded-xl border border-brand-border/40 text-xs text-brand-text-secondary italic">
                    Nenhum evento ativo agendado para este cliente atualmente.
                  </div>
                )}
              </div>

              {/* History of Contracts */}
              <div className="bg-brand-surface border border-brand-border p-5 rounded-2xl">
                <h3 className="text-sm font-semibold text-brand-text-primary mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-accent" />
                  Histórico de Contratos
                </h3>

                {getClientContracts(selectedClient.id).length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {getClientContracts(selectedClient.id).map(c => (
                      <div
                        key={c.id}
                        onClick={() => onSelectContract(c.id)}
                        className="p-3 bg-brand-bg hover:bg-brand-surface border border-brand-border rounded-xl cursor-pointer flex items-center justify-between transition group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-brand-surface group-hover:bg-brand-bg border border-brand-border text-brand-text-secondary group-hover:text-brand-accent transition">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-brand-text-primary group-hover:text-[#ffffff]">{c.title}</h4>
                            <span className="text-[10px] text-brand-text-secondary font-mono">Data: {c.date}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-brand-text-secondary group-hover:text-brand-accent transition-transform group-hover:translate-x-0.5" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-brand-bg/30 rounded-xl border border-brand-border/40 text-xs text-brand-text-secondary italic">
                    Nenhum contrato assinado ou gerado para este cliente.
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        /* Default clients list display */
        <div className="flex flex-col gap-5">
          {/* Header Action shelf */}
          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-brand-text-primary tracking-tight font-sans">Fichário de Clientes</h2>
              <p className="text-xs text-brand-text-secondary">Cadastre e acompanhe os dados de contato de seus contratantes</p>
            </div>
            
            <button
              onClick={onAddClient}
              className="py-2.5 px-4 bg-brand-accent hover:bg-brand-accent/90 text-brand-bg font-semibold text-xs rounded-xl shadow-lg shadow-brand-accent/10 flex items-center justify-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Novo Cliente
            </button>
          </div>

          {/* Search tool block */}
          <div className="relative w-full text-brand-text-secondary">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brand-text-secondary" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar cliente por nome, telefone ou e-mail..."
              className="w-full bg-brand-surface border border-brand-border rounded-xl pl-11 pr-4 py-3 text-xs text-brand-text-primary placeholder-brand-text-secondary/50 focus:ring-1 focus:ring-brand-accent focus:outline-none transition"
            />
          </div>

          {/* Clients Grid list */}
          {filteredClients.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClients.map(client => {
                const isActive = getClientEventStatus(client.id);
                return (
                  <div
                    key={client.id}
                    className="bg-brand-surface border border-brand-border rounded-2xl p-4 flex flex-col justify-between hover:border-brand-border/60 transition duration-150 shadow-md"
                  >
                    {/* Expand card header link */}
                    <div 
                      onClick={() => setSelectedClientId(client.id)}
                      className="cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-bold text-brand-text-primary group-hover:text-brand-accent transition truncate">
                          {client.name}
                        </h3>
                        {isActive ? (
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold rounded-full flex items-center gap-1 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Ativo
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-brand-bg text-brand-text-secondary text-[9px] font-bold rounded-full shrink-0">
                            Inativo
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-1 text-[11px] text-brand-text-secondary mt-3 pt-2 border-t border-brand-border/40 font-mono">
                        {client.phone && (
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-brand-text-secondary/60" />
                            {client.phone}
                          </span>
                        )}
                        {client.email && (
                          <span className="flex items-center gap-1.5 truncate">
                            <Mail className="w-3 h-3 text-brand-text-secondary/60" />
                            {client.email}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom specific trigger buttons */}
                    <div className="flex items-center justify-between border-t border-brand-border/60 mt-4 pt-3 gap-2">
                      <button
                        onClick={() => setSelectedClientId(client.id)}
                        className="text-[10px] text-brand-text-secondary hover:text-brand-accent font-semibold transition cursor-pointer"
                      >
                        Ver Ficha Completa
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEditClient(client)}
                          className="p-1.5 hover:bg-brand-bg/85 rounded-lg text-brand-text-secondary hover:text-brand-text-primary transition cursor-pointer"
                          title="Editar"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(client.id)}
                          className="p-1.5 hover:bg-red-950/25 rounded-lg text-brand-text-secondary hover:text-red-400 transition cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-brand-surface border border-dashed border-brand-border text-xs text-brand-text-secondary rounded-2xl">
              {search ? 'Nenhum cliente encontrado com estes critérios.' : 'Nenhum cliente cadastrado ainda. Clique em "Novo Cliente" para começar.'}
            </div>
          )}
        </div>
      )}

      {/* Exclusão Confirmation Popup Modal */}
      {deleteConfirmId && (
        <div id="delete-alert-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
              <h4 className="text-base font-bold text-brand-text-primary">Excluir Cliente?</h4>
              <p className="text-xs text-brand-text-secondary mt-2 leading-relaxed font-sans">
                Tem certeza que deseja excluir este cliente? Se você fizer isso, as informações de contato serão excluídas. Contratos vinculados virarão registros avulsos.
              </p>
            </div>

            <div className="flex gap-3 justify-center mt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 px-4 bg-brand-bg hover:bg-brand-surface border border-brand-border text-brand-text-primary rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDeleteClient(deleteConfirmId);
                  setDeleteConfirmId(null);
                  setSelectedClientId(null);
                }}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
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
