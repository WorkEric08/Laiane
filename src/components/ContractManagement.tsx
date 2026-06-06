/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Contract } from '../types';
import { 
  FileText, Search, Plus, Calendar, ArrowUpRight, 
  Trash2, Edit, AlertCircle, Eye, Printer, User 
} from 'lucide-react';
import { motion } from 'motion/react';

interface ContractManagementProps {
  contracts: Contract[];
  onAddContract: () => void;
  onEditContract: (contract: Contract) => void;
  onDeleteContract: (id: string) => void;
  onSelectContract: (id: string | null) => void; // Launches the full page editor
}

export default function ContractManagement({
  contracts,
  onAddContract,
  onEditContract,
  onDeleteContract,
  onSelectContract,
}: ContractManagementProps) {
  const [search, setSearch] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter contract entries based on matches
  const filteredContracts = contracts.filter(c => {
    const term = search.toLowerCase();
    return (
      c.title.toLowerCase().includes(term) ||
      c.clientName.toLowerCase().includes(term) ||
      c.eventName.toLowerCase().includes(term) ||
      c.date.includes(term)
    );
  });

  return (
    <div id="contracts-view-container" className="flex flex-col gap-5 w-full">
      {/* Header bar */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-brand-text-primary tracking-tight font-sans">Gestão de Contratos</h2>
          <p className="text-xs text-brand-text-secondary">Emita termos, revise clausulas de pacotes de drinks e exporte PDFs</p>
        </div>
        
        <button
          onClick={onAddContract}
          className="py-2.5 px-4 bg-brand-accent hover:bg-brand-accent/90 text-brand-bg font-semibold text-xs rounded-xl shadow-lg shadow-brand-accent/10 flex items-center justify-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Novo Contratante A4
        </button>
      </div>

      {/* Filter and searching tool */}
      <div className="relative w-full text-brand-text-secondary">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brand-text-secondary" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar contrato por cliente, nome do evento, título ou data..."
          className="w-full bg-brand-surface border border-brand-border rounded-xl pl-11 pr-4 py-2.5 text-xs text-brand-text-primary placeholder-brand-text-secondary/50 focus:ring-1 focus:ring-brand-accent focus:outline-none transition"
        />
      </div>

      {/* Grid rendering cards */}
      {filteredContracts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContracts.map(c => (
            <div
              key={c.id}
              className="bg-brand-surface border border-brand-border rounded-xl p-3.5 flex flex-col justify-between active:scale-[0.98] transition-transform shadow-sm"
            >
              <div 
                onClick={() => onSelectContract(c.id)}
                className="cursor-pointer group flex-1"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-accent/10 text-brand-accent rounded-full border border-brand-accent/20 flex items-center justify-center shrink-0">
                    <FileText className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[13px] font-bold text-brand-text-primary group-hover:text-brand-accent transition line-clamp-1">
                       {c.title}
                    </h3>
                    <span className="text-[10px] text-brand-text-secondary font-mono">Emissão: {c.date}</span>
                  </div>
                  <div className="shrink-0 p-1.5 bg-brand-bg rounded-full text-brand-text-secondary border border-brand-border/40">
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="bg-brand-bg/50 rounded-lg p-2.5 mt-3 border border-brand-border/40 flex flex-col gap-1.5">
                  <span className="flex items-center gap-2 text-[11px] text-brand-text-primary truncate">
                    <User className="w-3.5 h-3.5 text-brand-text-secondary shrink-0" />
                    <span className="truncate flex-1"><b>{c.clientName}</b></span>
                  </span>
                  <span className="flex items-center gap-2 text-[11px] text-brand-text-primary truncate">
                    <Calendar className="w-3.5 h-3.5 text-brand-text-secondary shrink-0" />
                    <span className="truncate flex-1">{c.eventName}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-brand-border/50">
                <button
                  onClick={() => onSelectContract(c.id)}
                  className="flex-1 py-2 bg-brand-accent text-brand-bg rounded-lg text-[11px] font-bold shadow-sm active:bg-brand-accent/80 transition flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Visualizar Contrato
                </button>

                <button
                  onClick={() => setDeleteConfirmId(c.id)}
                  className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg transition active:bg-red-500/30 shrink-0 flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-brand-surface border border-dashed border-brand-border text-xs text-brand-text-secondary rounded-2xl">
          Nenhum contrato cadastrado ou correspondente encontrado.
        </div>
      )}

      {/* Exclusão Modal Confirm Popup */}
      {deleteConfirmId && (
        <div id="delete-alert-contract-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
              <h4 className="text-base font-bold text-brand-text-primary">Excluir Contrato?</h4>
              <p className="text-xs text-brand-text-secondary mt-2 leading-relaxed font-sans">
                Tem certeza que deseja apagar esse documento de contrato permanentemente? Esta ação de exclusão não poderá ser revertida.
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
                  onDeleteContract(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold cursor-pointer transition"
              >
                Excluir
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
