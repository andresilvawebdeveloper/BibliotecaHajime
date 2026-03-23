"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Library, Users, PlusCircle, LogOut, Menu, X, 
  ShieldCheck, MessageSquare, ChevronRight, Clock, Send, Trash2, 
  CalendarCheck, Video 
} from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [perfil, setPerfil] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const [avisos, setAvisos] = useState<any[]>([]);
  const [novoAviso, setNovoAviso] = useState('');
  
  const [showModalVideo, setShowModalVideo] = useState(false);
  const [submetendo, setSubmetendo] = useState(false);
  
  const [novoVideo, setNovoVideo] = useState({ 
    titulo: '', 
    categoria: 'Nage-waza', 
    url: '', 
    descricao: '', 
    faixa_etaria: 'Todos' 
  });

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUser(user);
      
      const { data: pData } = await supabase.from('perfis').select('*').eq('id', user.id).single();
      
      // BLOQUEIO DE SEGURANÇA: Se não for admin e não estiver aprovado, vai para a página pendente
      if (pData && pData.role !== 'admin' && pData.aprovado === false) {
        router.push('/pendente');
        return;
      }

      setPerfil(pData);

      const { data: aData } = await supabase.from('avisos').select('*').order('created_at', { ascending: false }).limit(5);
      setAvisos(aData || []);
      setLoading(false);
    };
    fetchData();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const publicarAviso = async () => {
    if (!novoAviso.trim()) return;
    const { data, error } = await supabase.from('avisos').insert([
      { conteudo: novoAviso, autor_nome: perfil?.nome || 'Admin' }
    ]).select();
    if (!error && data) { setAvisos([data[0], ...avisos]); setNovoAviso(''); }
  };

  const eliminarAviso = async (id: string) => {
    await supabase.from('avisos').delete().eq('id', id);
    setAvisos(avisos.filter(a => a.id !== id));
  };

  const salvarVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmetendo(true);
    
    const { error } = await supabase.from('videos').insert([{ 
      titulo: novoVideo.titulo, 
      categoria: novoVideo.categoria, 
      youtube_url: novoVideo.url,
      descricao: novoVideo.descricao,
      faixa_etaria: novoVideo.faixa_etaria,
      criado_por: user.id 
    }]);

    if (!error) {
      setShowModalVideo(false);
      setNovoVideo({ titulo: '', categoria: 'Nage-waza', url: '', descricao: '', faixa_etaria: 'Todos' });
      alert("Técnica adicionada!");
    } else {
      alert("Erro: " + error.message);
    }
    setSubmetendo(false);
  };

  if (loading) return <div style={centerStyle}>A verificar credenciais...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR */}
      <aside style={sidebarStyle(isSidebarOpen, isMobile)}>
        <div style={logoAreaStyle}>
          <img src="/icons/logo-hajime-biblioteca.png" alt="Logo" style={{ width: '40px', borderRadius: '8px' }} />
          <div><h2 style={{ fontSize: '15px', fontWeight: '800', margin: 0 }}>Hajime</h2><p style={{ fontSize: '10px', color: '#9CA3AF', margin: 0 }}>MANAGER</p></div>
        </div>
        <nav style={{ flex: 1, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div onClick={() => router.push('/dashboard')} style={navItemStyle(true)}><LayoutDashboard size={18}/> Início</div>
          <div onClick={() => router.push('/biblioteca')} style={navItemStyle(false)}><Library size={18}/> Biblioteca</div>
          <div onClick={() => router.push('/planeamento')} style={navItemStyle(false)}><CalendarCheck size={18}/> Planeamento</div>
          {perfil?.role === 'admin' && (
            <div onClick={() => router.push('/dashboard/treinadores')} style={navItemStyle(false)}><Users size={18}/> Treinadores</div>
          )}
        </nav>
        <button onClick={handleLogout} style={logoutButtonStyle}><LogOut size={18} /> Sair</button>
      </aside>

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <main style={{ flex: 1, padding: isMobile ? '20px' : '40px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <header style={headerDashboardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {isMobile && <Menu size={24} onClick={() => setSidebarOpen(true)} style={{ cursor: 'pointer' }} />}
              <h1 style={{ fontSize: '24px', fontWeight: '900' }}>Olá, {perfil?.nome}</h1>
            </div>
            {perfil?.role === 'admin' && <div style={adminBadgeStyle}><ShieldCheck size={14} /> ADMIN</div>}
          </header>

          {/* MURAL */}
          <div style={muralWrapperStyle}>
            <div style={boxHeaderStyle}><MessageSquare size={20} color="#0055A4" /><h3 style={{ margin: 0, fontWeight: '800' }}>Mural da Equipa</h3></div>
            {perfil?.role === 'admin' && (
              <div style={inputAvisoArea}>
                <input style={inputAvisoStyle} placeholder="Novo aviso..." value={novoAviso} onChange={(e) => setNovoAviso(e.target.value)} />
                <button onClick={publicarAviso} style={sendBtnStyle}><Send size={18} /></button>
              </div>
            )}
            <div style={listaAvisosStyle}>
              {avisos.length === 0 ? (
                <p style={{ color: '#94A3B8', fontSize: '13px' }}>Sem avisos recentes.</p>
              ) : (
                avisos.map((a) => (
                  <div key={a.id} style={avisoCardStyle}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600' }}>{a.conteudo}</p>
                      <span style={{ fontSize: '10px', color: '#94A3B8' }}>{a.autor_nome.toUpperCase()}</span>
                    </div>
                    {perfil?.role === 'admin' && <button onClick={() => eliminarAviso(a.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} color="#FDA4AF" /></button>}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ACÇÕES RÁPIDAS */}
          <div style={actionsGridStyle}>
            <div onClick={() => router.push('/planeamento')} style={actionCardStyle('#0055A4')}>
              <CalendarCheck size={32} color="white" />
              <h3 style={{ color: 'white', margin: '12px 0 5px 0', fontWeight: '800' }}>O Meu Plano</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>Ver aulas agendadas</p>
            </div>
            {perfil?.role === 'admin' && (
              <div onClick={() => setShowModalVideo(true)} style={actionCardStyle('#111827')}>
                <PlusCircle size={32} color="white" />
                <h3 style={{ color: 'white', margin: '12px 0 5px 0', fontWeight: '800' }}>Novo Vídeo</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>Adicionar técnica</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MODAL VÍDEO COMPLETO */}
      {showModalVideo && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontWeight: '900', fontSize: '20px' }}>Adicionar Técnica</h3>
              <X size={24} onClick={() => setShowModalVideo(false)} style={{ cursor: 'pointer' }} />
            </div>
            
            <form onSubmit={salvarVideo} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={labelStyle}>Nome da Técnica</label>
                <input required style={inputFormStyle} placeholder="Ex: Ippon Seoi Nage" value={novoVideo.titulo} onChange={e => setNovoVideo({...novoVideo, titulo: e.target.value})} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={labelStyle}>Categoria</label>
                  <select style={inputFormStyle} value={novoVideo.categoria} onChange={e => setNovoVideo({...novoVideo, categoria: e.target.value})}>
                    <option value="Nage-waza">Nage-waza</option>
                    <option value="Ne-waza">Ne-waza</option>
                    <option value="Transicao pé-chao">Transição</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Faixa Etária</label>
                  <select style={inputFormStyle} value={novoVideo.faixa_etaria} onChange={e => setNovoVideo({...novoVideo, faixa_etaria: e.target.value})}>
                    <option value="3-5">3-5 anos</option>
                    <option value="6-9">6-9 anos</option>
                    <option value="10+">10+ anos</option>
                    <option value="Todos">Todos</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>URL do YouTube</label>
                <input required style={inputFormStyle} placeholder="https://youtube.com/watch?v=..." value={novoVideo.url} onChange={e => setNovoVideo({...novoVideo, url: e.target.value})} />
              </div>

              <div>
                <label style={labelStyle}>Descrição Técnica</label>
                <textarea rows={3} style={{ ...inputFormStyle, resize: 'none' }} placeholder="Detalhes sobre a execução..." value={novoVideo.descricao} onChange={e => setNovoVideo({...novoVideo, descricao: e.target.value})} />
              </div>

              <button disabled={submetendo} type="submit" style={btnSubmitStyle}>
                {submetendo ? 'A carregar...' : 'Publicar na Biblioteca'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ESTILOS (Inalterados)
const centerStyle: React.CSSProperties = { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' };
const sidebarStyle = (open: boolean, mobile: boolean): React.CSSProperties => ({ width: '260px', backgroundColor: '#111827', color: 'white', display: 'flex', flexDirection: 'column', position: mobile ? 'fixed' : 'relative', height: '100vh', zIndex: 100, transform: mobile ? (open ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)', transition: 'transform 0.3s' });
const logoAreaStyle: React.CSSProperties = { padding: '30px 24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #1F2937' };
const navItemStyle = (active: boolean): React.CSSProperties => ({ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', color: active ? 'white' : '#9CA3AF', backgroundColor: active ? 'rgba(255,255,255,0.05)' : 'transparent', fontWeight: '600', fontSize: '14px' });
const logoutButtonStyle: React.CSSProperties = { margin: '20px', padding: '12px', backgroundColor: 'transparent', border: 'none', color: '#F87171', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700' };
const headerDashboardStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' };
const adminBadgeStyle: React.CSSProperties = { backgroundColor: '#DCFCE7', color: '#166534', padding: '5px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold' };
const muralWrapperStyle: React.CSSProperties = { backgroundColor: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #E5E7EB', marginBottom: '30px' };
const boxHeaderStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' };
const inputAvisoArea: React.CSSProperties = { display: 'flex', gap: '10px', marginBottom: '20px', backgroundColor: '#F8FAFC', padding: '8px', borderRadius: '14px', border: '1px solid #E2E8F0' };
const inputAvisoStyle: React.CSSProperties = { flex: 1, background: 'none', border: 'none', outline: 'none', padding: '8px', fontSize: '14px' };
const sendBtnStyle: React.CSSProperties = { backgroundColor: '#0055A4', color: 'white', border: 'none', borderRadius: '10px', padding: '8px 15px', cursor: 'pointer' };
const listaAvisosStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '12px' };
const avisoCardStyle: React.CSSProperties = { padding: '12px 16px', borderLeft: '4px solid #0055A4', backgroundColor: '#F8FAFC', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' };
const actionsGridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' };
const actionCardStyle = (bg: string): React.CSSProperties => ({ backgroundColor: bg, padding: '24px', borderRadius: '24px', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' });
const modalOverlayStyle: React.CSSProperties = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' };
const modalContentStyle: React.CSSProperties = { backgroundColor: 'white', padding: '30px', borderRadius: '24px', width: '100%', maxWidth: '480px' };
const inputFormStyle: React.CSSProperties = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px', boxSizing: 'border-box' };
const labelStyle: React.CSSProperties = { fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', marginBottom: '5px', display: 'block' };
const btnSubmitStyle: React.CSSProperties = { width: '100%', padding: '14px', backgroundColor: '#111827', color: 'white', borderRadius: '10px', border: 'none', fontWeight: '700', cursor: 'pointer', marginTop: '10px' };