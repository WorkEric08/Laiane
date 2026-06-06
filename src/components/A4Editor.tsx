/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Client, CocktailEvent, Contract } from '../types';
import { 
  FileText, ArrowLeft, Printer, RefreshCw, CheckCircle, 
  Search, FileDown, Edit, Eye, Sparkles, BookOpen 
} from 'lucide-react';

interface A4EditorProps {
  clients: Client[];
  events: CocktailEvent[];
  contracts: Contract[];
  onSaveContract: (contract: Contract) => void;
  onCancel: () => void;
  initialContractId: string | null; // null if creating from scratch
}

// Default standard Portuguese contract template
const CONTRACT_TEMPLATE = `CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE BARMAN E COQUETELARIA

Este instrumento particular regula os serviços de barman e coquetelaria profissional para eventos celebrados entre:

CONTRATADA:
{{PERFIL_NOME}}, pessoa jurídica/física inscrita no CPF/CNPJ sob o nº _____________________, sediada em [Cidade/UF], contato corporativo.

CONTRATANTE:
Nome: {{CLIENTE_NOME}}
E-mail: {{CLIENTE_EMAIL}}
Telefone: {{CLIENTE_TELEFONE}}

CLÁUSULA PRIMEIRA - DO OBJETO DO SERVIÇO
A Contratada se compromete a prestar serviços de fornecimento de drinks e coquetéis finos de forma exclusiva para o evento "{{EVENTO_NOME}}" agendado para o dia {{EVENTO_DATA}}, no endereço: {{EVENTO_LOCAL}}.

CLÁUSULA SEGUNDA - DA INFRAESTRUTURA E PACOTE
O serviço atenderá de forma personalizada o quantitativo estimado de {{EVENTO_CONVIDADOS}} convidados durante o período contratado, sob o pacote de coquetéis "{{EVENTO_PACOTE}}". Os insumos de alta qualidade, frutas selecionadas, gelo filtrado, copos ecológicos, cardápio temático e utensílios profissionais serão integralmente fornecidos pela Contratada.

CLÁUSULA TERCEIRA - DOS VALORES E PAGAMENTO
Pelo serviço ora pactuado, o Contratante pagará o valor bruto total de R$ {{EVENTO_VALOR}}, divididos conforme cronograma acordado de forma prévia. O pagamento do sinal formaliza esta agenda.

CLÁUSULA QUARTA - DAS RESPONSABILIDADES
A Contratada manterá comportamento profissional e elegante com todos os convidados, garantindo a higiene do bar e o descarte seletivo das embalagens usadas durante seu turno de atividades.

Porto Alegre/RS, {{DATA_ATUAL}}

________________________________________________
Contratada ({{PERFIL_NOME}})

________________________________________________
Contratante ({{CLIENTE_NOME}})`;

export default function A4Editor({
  clients,
  events,
  contracts,
  onSaveContract,
  onCancel,
  initialContractId,
}: A4EditorProps) {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  const [searchClientQuery, setSearchClientQuery] = useState('');
  const [searchEventQuery, setSearchEventQuery] = useState('');
  
  const [editMode, setEditMode] = useState<'editor' | 'preview'>('editor');
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  // Load initial contract if editing
  useEffect(() => {
    if (initialContractId && initialContractId !== 'new') {
      const match = contracts.find(c => c.id === initialContractId);
      if (match) {
        setTitle(match.title);
        setContent(match.content);
        setSelectedClientId(match.clientId);
        setSelectedEventId(match.eventId);
        setEditMode('preview');
      }
    } else {
      setTitle('Contrato de Prestação de Serviços - Coquetelaria');
      setContent('');
      setSelectedClientId('');
      setSelectedEventId('');
      setEditMode('editor');
      setIsAutoFilled(false);
    }
  }, [initialContractId, contracts]);

  // Handle auto-generation
  const handleAutoFill = () => {
    if (!selectedClientId || !selectedEventId) return;
    
    const client = clients.find(c => c.id === selectedClientId);
    const event = events.find(e => e.id === selectedEventId);
    
    if (!client || !event) return;

    const savedProfileName = localStorage.getItem('mix_profile_name') || 'Mixology Eventos';

    let compiled = CONTRACT_TEMPLATE;
    compiled = compiled.replace(/{{PERFIL_NOME}}/g, savedProfileName);
    compiled = compiled.replace(/{{CLIENTE_NOME}}/g, client.name);
    compiled = compiled.replace(/{{CLIENTE_EMAIL}}/g, client.email || 'Não informado');
    compiled = compiled.replace(/{{CLIENTE_TELEFONE}}/g, client.phone || 'Não informado');
    compiled = compiled.replace(/{{EVENTO_NOME}}/g, event.name);
    
    // Format date beautifully
    const [year, month, day] = event.date.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    compiled = compiled.replace(/{{EVENTO_DATA}}/g, formattedDate);
    
    compiled = compiled.replace(/{{EVENTO_LOCAL}}/g, event.location);
    compiled = compiled.replace(/{{EVENTO_CONVIDADOS}}/g, String(event.guestCount));
    compiled = compiled.replace(/{{EVENTO_PACOTE}}/g, event.drinkPackage);
    compiled = compiled.replace(/{{EVENTO_VALOR}}/g, Number(event.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
    
    const today = new Date();
    compiled = compiled.replace(/{{DATA_ATUAL}}/g, today.toLocaleDateString('pt-BR'));
    
    setContent(compiled);
    const clientFirstName = client.name.split(' ')[0];
    setTitle(`Contrato - ${clientFirstName} (${event.name})`);
    setIsAutoFilled(true);
    setEditMode('editor');
  };

  // Preset custom standard terms if blank
  const loadStandardBlank = () => {
    const savedProfileName = localStorage.getItem('mix_profile_name') || 'Mixology Eventos';

    setContent(CONTRACT_TEMPLATE
      .replace(/{{PERFIL_NOME}}/g, savedProfileName)
      .replace(/{{CLIENTE_NOME}}/g, "___________________________")
      .replace(/{{CLIENTE_EMAIL}}/g, "___________________________")
      .replace(/{{CLIENTE_TELEFONE}}/g, "___________________________")
      .replace(/{{EVENTO_NOME}}/g, "___________________________")
      .replace(/{{EVENTO_DATA}}/g, "____/____/________")
      .replace(/{{EVENTO_LOCAL}}/g, "___________________________")
      .replace(/{{EVENTO_CONVIDADOS}}/g, "________")
      .replace(/{{EVENTO_PACOTE}}/g, "___________________________")
      .replace(/{{EVENTO_VALOR}}/g, "0,00")
      .replace(/{{DATA_ATUAL}}/g, new Date().toLocaleDateString('pt-BR'))
    );
    setIsAutoFilled(true);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    
    const client = clients.find(c => c.id === selectedClientId);
    const event = events.find(e => e.id === selectedEventId);

    const updatedContract: Contract = {
      id: initialContractId && initialContractId !== 'new' ? initialContractId : `con_${Date.now()}`,
      clientId: selectedClientId || 'unknown',
      clientName: client ? client.name : 'Cliente Avulso',
      eventId: selectedEventId || 'unknown',
      eventName: event ? event.name : 'Evento Avulso',
      date: new Date().toISOString().split('T')[0],
      title: title,
      content: content,
      status: 'rascunho'
    };

    onSaveContract(updatedContract);
  };

  const triggerPrint = () => {
    // Elegant system-native printable view
    window.print();
  };

  // Filter lists based on search
  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchClientQuery.toLowerCase()) ||
    c.phone.includes(searchClientQuery)
  );

  const filteredEventsForClient = events.filter(e => {
    const queryMatch = e.name.toLowerCase().includes(searchEventQuery.toLowerCase());
    if (selectedClientId) {
      return e.clientId === selectedClientId && queryMatch;
    }
    return queryMatch;
  });

  return (
    <div id="a4-contract-builder" className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Top action header bar - Will hide during print */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-brand-surface/85 p-4 rounded-2xl border border-brand-border print:hidden shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 rounded-xl text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-bg transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-brand-text-primary tracking-tight font-sans">
              {initialContractId && initialContractId !== 'new' ? 'Visualizar Contrato' : 'Novo Contrato Padrão'}
            </h2>
            <p className="text-xs text-brand-text-secondary">Editor com preenchimento dinâmico e formato de impressão A4</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          {/* Mode switch buttons */}
          <div className="flex bg-brand-bg p-0.5 rounded-lg border border-brand-border">
            <button
              onClick={() => setEditMode('editor')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                editMode === 'editor' 
                  ? 'bg-brand-accent/15 text-brand-accent font-bold shadow-sm' 
                  : 'text-brand-text-secondary hover:text-brand-text-primary'
              }`}
            >
              <Edit className="w-3.5 h-3.5" />
              Editar
            </button>
            <button
              onClick={() => setEditMode('preview')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                editMode === 'preview' 
                  ? 'bg-brand-accent/15 text-brand-accent font-bold shadow-sm' 
                  : 'text-brand-text-secondary hover:text-brand-text-primary'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Visualizar A4
            </button>
          </div>

          <button
            onClick={triggerPrint}
            disabled={!content}
            className="px-3 py-1.5 rounded-lg bg-brand-bg hover:bg-brand-surface text-brand-text-secondary hover:text-brand-text-primary border border-brand-border transition text-xs font-medium cursor-pointer flex items-center gap-1.5 disabled:opacity-40"
          >
            <Printer className="w-4 h-4" />
            PDF / Imprimir
          </button>

          <button
            onClick={handleSave}
            disabled={!title || !content}
            className="px-4 py-1.5 rounded-lg bg-brand-accent hover:bg-brand-accent/90 text-brand-bg font-semibold transition text-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-40"
          >
            <CheckCircle className="w-4 h-4" />
            Salvar Contrato
          </button>
        </div>
      </div>

      <div id="contract-form-and-editor-split" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column options form (only shows when editing/creating) - Hidden in print */}
        <div className="lg:col-span-4 flex flex-col gap-5 print:hidden">
          {/* Client & Event Binding Selector Card */}
          <div className="bg-brand-surface border border-brand-border p-5 rounded-2xl shadow-md">
            <h3 className="text-sm font-semibold text-brand-text-primary mb-4 flex items-center gap-2 font-sans">
              <Sparkles className="w-4 h-4 text-brand-accent" />
              Preenchimento Automático
            </h3>

            {/* Client bind dropdown */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-brand-text-secondary mb-1.5">Clientes cadastrados</label>
              <div className="relative">
                <select
                  value={selectedClientId}
                  onChange={(e) => {
                    setSelectedClientId(e.target.value);
                    setSelectedEventId('');
                  }}
                  className="w-full bg-brand-bg border border-brand-border text-brand-text-primary rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-brand-accent focus:outline-none"
                >
                  <option value="">Selecione um cliente...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Event bind dropdown */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-brand-text-secondary mb-1.5">Eventos do cliente</label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                disabled={!selectedClientId}
                className="w-full bg-brand-bg border border-brand-border text-brand-text-primary rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-brand-accent focus:outline-none disabled:opacity-40"
              >
                <option value="">Selecione o evento ligado...</option>
                {filteredEventsForClient.map(ev => (
                  <option key={ev.id} value={ev.id}>{ev.name} ({ev.date})</option>
                ))}
              </select>
              {!selectedClientId && (
                <p className="text-[10px] text-brand-text-secondary/50 mt-1">Escolha o cliente para carregar seus eventos ativos.</p>
              )}
            </div>

            <button
              onClick={handleAutoFill}
              disabled={!selectedClientId || !selectedEventId}
              className="w-full py-2.5 px-4 bg-brand-accent text-brand-bg font-semibold text-xs rounded-xl shadow-lg shadow-brand-accent/10 hover:bg-brand-accent/90 transition cursor-pointer flex items-center justify-center gap-2 disabled:bg-brand-bg disabled:text-brand-text-secondary/40 disabled:shadow-none font-sans"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-hover" />
              Mesclar & Gerar Contrato A4
            </button>

            <div className="relative my-4 flex items-center justify-center">
              <div className="border-t border-brand-border w-full" />
              <span className="absolute px-3 bg-brand-surface text-[10px] text-brand-text-secondary uppercase tracking-wider">Ou</span>
            </div>

            <button
              onClick={loadStandardBlank}
              className="w-full py-2.5 px-4 bg-brand-bg border border-brand-border text-brand-text-primary font-medium text-xs rounded-xl hover:bg-brand-surface transition cursor-pointer flex items-center justify-center gap-2"
            >
              <BookOpen className="w-3.5 h-3.5 text-brand-text-secondary" />
              Carregar Modelo em Branco
            </button>
          </div>

          {/* Quick instructions */}
          <div className="p-4 rounded-2xl bg-brand-surface border border-brand-border text-xs text-brand-text-secondary leading-relaxed space-y-2 font-sans">
            <h4 className="font-semibold text-brand-text-primary">Como funciona?</h4>
            <p>1. Ligue o contrato a um cliente e evento para mesclar e popular as variáveis organizadas automaticamente.</p>
            <p>2. Você pode editar o texto de forma livre, igual ao bloco de notas.</p>
            <p>3. Clique em <b>Visualizar A4</b> para ver o real layout de papel.</p>
            <p>4. Em "PDF / Imprimir", use a opção nativa para salvar como PDF.</p>
          </div>
        </div>

        {/* Right column editor / view block */}
        <div className="lg:col-span-8 flex flex-col gap-4 w-full">
          {/* Document details container */}
          <div className="bg-brand-surface p-4 rounded-xl border border-brand-border print:hidden flex flex-col gap-3">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-brand-text-secondary mb-1">Título do Documento de Gestão</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex. Contrato de Prestação de Serviços - Evento Marina"
                className="w-full bg-brand-bg border border-brand-border text-brand-text-primary rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-brand-accent focus:outline-none"
              />
            </div>
          </div>

          {/* Clean editor board */}
          {editMode === 'editor' ? (
            <div className="print:hidden w-full">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escreva ou adicione um template de contrato aqui..."
                rows={22}
                className="w-full bg-brand-surface border border-brand-border text-brand-text-primary rounded-2xl p-6 font-mono text-xs focus:ring-1 focus:ring-brand-accent focus:outline-none leading-relaxed resize-y shadow-inner min-h-[500px]"
              />
            </div>
          ) : (
            /* Elegant physical simulated A4 Sheet paper preview - Used also for PRINTING! */
            <div className="flex justify-center w-full px-1 overflow-x-auto overflow-y-hidden pb-4">
              <div 
                id="a4-sheet"
                className="w-[210mm] min-w-[210mm] min-h-[297mm] bg-white text-gray-900 shadow-2xl p-[18mm] rounded-sm md:rounded-md flex flex-col text-[11px] leading-relaxed relative print:-m-12 font-sans selection:bg-amber-100 shrink-0"
              >
                {/* Print Header Watermark Logo (for print sheets) */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-6">
                  <div className="flex items-center gap-2 text-zinc-800">
                    <FileText className="w-5 h-5 text-amber-600 print:text-zinc-800 shrink-0" />
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-zinc-800">MIXOLOGY EVENTOS</span>
                      <span className="block text-[9px] text-gray-500">Coquetelaria Profissional & Barman</span>
                    </div>
                  </div>
                  <div className="text-right text-[9px] text-gray-400 font-mono">
                    AUTOGERADO - DOC REF {String(Date.now()).slice(-5)}
                  </div>
                </div>

                {/* Main A4 Text Content - Samsung note style look, beautifully spaced */}
                <div className="flex-1 whitespace-pre-wrap font-sans text-[11px] text-gray-800 leading-relaxed text-justify space-y-4">
                  {content || (
                    <div className="text-gray-400 text-center py-20 font-sans italic">
                      Nenhum texto neste contrato. Use as opções da barra lateral para carregar um modelo ou escrever do zero!
                    </div>
                  )}
                </div>

                {/* Print Footer */}
                <div className="border-t border-gray-100 pt-3 mt-8 flex justify-between items-center text-[9px] text-gray-400 uppercase tracking-widest font-mono">
                  <span>Instrumento Contratual Privado</span>
                  <span>Página 1 de 1</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Styled custom CSS embedded inline to make @media print render flawlessly */}
      <style>{`
        @media print {
          /* Hide all UI components */
          body {
            background-color: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          #root {
            padding: 0 !important;
            max-width: 100% !important;
          }
          #bottom-sheet-overlay,
          .print\\:hidden,
          #contract-form-and-editor-split > :first-child,
          header,
          nav,
          footer,
          button,
          aside {
            display: none !important;
          }
          #contract-form-and-editor-split {
            display: block !important;
            grid-template-columns: none !important;
            gap: 0 !important;
          }
          #contract-form-and-editor-split > :last-child {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          /* A4 Paper specific constraints */
          #a4-sheet {
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            padding: 10mm !important;
            width: 100% !important;
            max-width: none !important;
            height: auto !important;
            aspect-ratio: auto !important;
            background-color: white !important;
            color: black !important;
          }
        }
      `}</style>
    </div>
  );
}
