// pages/Definicoes.jsx — Ecrã de definições e preferências

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Palette, Bell, Shield, LogOut, Trash2, ChevronRight,
  User, Lock, Globe,
} from 'lucide-react';

// ─── Configurações de tema e cores ───────────────────────────────────────────
const TEMAS = ['Escuro', 'Claro', 'Sistema'];
const CORES_DESTAQUE = [
  { nome: 'Índigo',   classe: 'bg-indigo-500',  anel: 'ring-indigo-500'  },
  { nome: 'Violeta',  classe: 'bg-violet-500',  anel: 'ring-violet-500'  },
  { nome: 'Céu',      classe: 'bg-sky-500',     anel: 'ring-sky-500'     },
  { nome: 'Esmeralda',classe: 'bg-emerald-500', anel: 'ring-emerald-500' },
  { nome: 'Âmbar',    classe: 'bg-amber-500',   anel: 'ring-amber-500'   },
];

// ─── Sub-componente: Secção agrupada ─────────────────────────────────────────
function SeccaoDefinicoes({ icone, titulo, children, perigo = false }) {
  return (
    <div
      className={`rounded-2xl border overflow-hidden mb-3 ${
        perigo
          ? 'border-red-500/15 bg-red-500/5'
          : 'border-zinc-800 bg-zinc-900'
      }`}
    >
      {/* Cabeçalho da secção */}
      <div
        className={`px-4 py-3 border-b flex items-center gap-2 ${
          perigo ? 'border-red-500/15' : 'border-zinc-800'
        }`}
      >
        <span className={perigo ? 'text-red-400' : 'text-zinc-500'}>{icone}</span>
        <span
          className={`text-xs font-semibold uppercase tracking-widest ${
            perigo ? 'text-red-400' : 'text-zinc-500'
          }`}
        >
          {titulo}
        </span>
      </div>
      {children}
    </div>
  );
}

// ─── Sub-componente: Item com toggle ─────────────────────────────────────────
function ItemToggle({ rotulo, descricao, ativo, aoAlterar }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-zinc-200 font-medium leading-tight">{rotulo}</p>
        {descricao && <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{descricao}</p>}
      </div>
      <button
        onClick={() => aoAlterar(!ativo)}
        aria-label={`${ativo ? 'Desativar' : 'Ativar'} ${rotulo}`}
        className={`relative w-10 h-5.5 h-[22px] rounded-full transition-colors duration-200 flex-shrink-0 ${
          ativo ? 'bg-stone-300' : 'bg-zinc-700'
        }`}
      >
        <span
          className={`absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-zinc-900 shadow-sm transition-transform duration-200 ${
            ativo ? 'translate-x-[18px]' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

// ─── Sub-componente: Item de navegação ────────────────────────────────────────
function ItemNavegacao({ icone: Icone, rotulo, descricao }) {
  return (
    <button className="w-full flex items-center gap-3 py-3 text-left hover:bg-zinc-800/50 rounded-xl px-2 -mx-2 transition-colors group">
      <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:bg-zinc-700 transition-colors">
        <Icone className="w-4 h-4 text-zinc-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-zinc-200 font-medium leading-tight">{rotulo}</p>
        {descricao && <p className="text-xs text-zinc-500 mt-0.5">{descricao}</p>}
      </div>
      <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0" />
    </button>
  );
}

// ─── Componente principal: Definições ────────────────────────────────────────
export default function Definicoes() {
  const [temaActivo, setTemaActivo]       = useState('Escuro');
  const [corActiva, setCorActiva]         = useState('Índigo');
  const [notifPush, setNotifPush]         = useState(true);
  const [notifEmail, setNotifEmail]       = useState(false);
  const [notifLembrete, setNotifLembrete] = useState(true);
  const [confirmarElim, setConfirmarElim] = useState(false);
  const navegar = useNavigate();

  const terminarSessao = () => {
    localStorage.removeItem('hotelai_auth');
    navegar('/login');
  };

  return (
    <div className="h-full overflow-y-auto px-6 py-6">
      <div className="max-w-md mx-auto">

        {/* ——— Cabeçalho ——— */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-50 tracking-tight">Definições</h1>
          <p className="text-sm text-zinc-500 mt-1">Gere a tua conta e preferências.</p>
        </div>

        {/* ——— Card de Perfil ——— */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-4 flex items-center gap-4">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500/30 to-violet-500/30 border-2 border-indigo-500/30 flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold text-indigo-300">F</span>
          </div>

          {/* Dados */}
          <div className="flex-1 min-w-0">
            <p className="text-zinc-100 font-semibold leading-tight">Filipe Tavares</p>
            <p className="text-zinc-500 text-sm truncate mt-0.5">filipe@exemplo.pt</p>
            <span className="inline-block text-xs text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded-full mt-1.5 border border-zinc-700/50">
              Plano gratuito
            </span>
          </div>

          {/* Botão editar */}
          <button className="text-xs px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-colors border border-zinc-700/50 flex-shrink-0">
            Editar
          </button>
        </div>

        {/* ——— Conta ——— */}
        <SeccaoDefinicoes titulo="Conta" icone={<User className="w-4 h-4" />}>
          <div className="px-4 py-2 divide-y divide-zinc-800/60">
            <ItemNavegacao
              icone={User}
              rotulo="Informações pessoais"
              descricao="Nome, email, fotografia"
            />
            <ItemNavegacao
              icone={Lock}
              rotulo="Segurança"
              descricao="Palavra-passe, autenticação em dois passos"
            />
            <ItemNavegacao
              icone={Globe}
              rotulo="Língua e região"
              descricao="Português (Portugal)"
            />
          </div>
        </SeccaoDefinicoes>

        {/* ——— Aparência ——— */}
        <SeccaoDefinicoes titulo="Aparência" icone={<Palette className="w-4 h-4" />}>
          <div className="px-4 py-4 space-y-5">

            {/* Selector de tema */}
            <div>
              <p className="text-xs text-zinc-500 mb-2 font-medium">Tema</p>
              <div className="flex gap-2">
                {TEMAS.map((tema) => (
                  <button
                    key={tema}
                    onClick={() => setTemaActivo(tema)}
                    className={`flex-1 py-2 text-xs rounded-xl border transition-all font-medium ${
                      temaActivo === tema
                        ? 'bg-stone-200 text-zinc-900 border-stone-200 shadow-sm'
                        : 'bg-transparent text-zinc-500 border-zinc-700 hover:border-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {tema}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de cor de destaque */}
            <div>
              <p className="text-xs text-zinc-500 mb-2.5 font-medium">Cor de destaque</p>
              <div className="flex gap-2.5">
                {CORES_DESTAQUE.map(({ nome, classe, anel }) => (
                  <button
                    key={nome}
                    onClick={() => setCorActiva(nome)}
                    title={nome}
                    className={`w-7 h-7 rounded-full ${classe} transition-all hover:scale-110 ${
                      corActiva === nome
                        ? `ring-2 ring-offset-2 ring-offset-zinc-900 ${anel}`
                        : ''
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </SeccaoDefinicoes>

        {/* ——— Notificações ——— */}
        <SeccaoDefinicoes titulo="Notificações" icone={<Bell className="w-4 h-4" />}>
          <div className="px-4 py-3 space-y-3">
            <ItemToggle
              rotulo="Notificações push"
              descricao="Alertas de reservas e confirmações no dispositivo"
              ativo={notifPush}
              aoAlterar={setNotifPush}
            />
            <div className="h-px bg-zinc-800" />
            <ItemToggle
              rotulo="Notificações por email"
              descricao="Confirmações e resumos de atividade"
              ativo={notifEmail}
              aoAlterar={setNotifEmail}
            />
            <div className="h-px bg-zinc-800" />
            <ItemToggle
              rotulo="Lembretes de reserva"
              descricao="Notificação 1 hora antes de cada marcação"
              ativo={notifLembrete}
              aoAlterar={setNotifLembrete}
            />
          </div>
        </SeccaoDefinicoes>

        {/* ——— Zona de Perigo ——— */}
        <SeccaoDefinicoes
          titulo="Zona de Perigo"
          icone={<Shield className="w-4 h-4" />}
          perigo
        >
          <div className="px-4 py-4">
            <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
              A eliminação da conta é permanente e irreversível. Todos os dados,
              reservas e histórico serão definitivamente apagados.
            </p>

            {!confirmarElim ? (
              <button
                onClick={() => setConfirmarElim(true)}
                className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 border border-red-500/25 hover:border-red-500/50 px-4 py-2.5 rounded-xl transition-all"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar conta
              </button>
            ) : (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <p className="text-red-300 text-sm font-medium mb-3">
                  Tens a certeza? Esta ação não pode ser desfeita.
                </p>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 text-xs bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-colors">
                    Confirmar eliminação
                  </button>
                  <button
                    onClick={() => setConfirmarElim(false)}
                    className="flex-1 py-2 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </SeccaoDefinicoes>

        {/* ——— Botão Terminar Sessão ——— */}
        <button
          onClick={terminarSessao}
          className="w-full flex items-center justify-center gap-2 mt-2 py-3.5 text-sm font-semibold bg-stone-200 hover:bg-stone-100 text-zinc-900 rounded-2xl transition-all shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          Terminar sessão
        </button>

        {/* Versão */}
        <p className="text-center text-xs text-zinc-700 mt-6">
          HotelAI · versão 1.0.0
        </p>
      </div>
    </div>
  );
}
