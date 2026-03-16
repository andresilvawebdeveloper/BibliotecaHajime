"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { 
  Users, ChevronLeft, Shield, User, Trash2, Mail, CheckCircle2, Clock, Calendar
} from 'lucide-react';

export default function TreinadoresPage() {
  const [treinadores, setTreinadores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [perfilAdmin, setPerfilAdmin] = useState<any>(null);
  
  const supabase = createClient();
  const router = useRouter();

  const fetchTreinadores = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }

    // Verificar se o utilizador é realmente admin
    const { data: pData } = await supabase.from('perfis').select('*').eq('id', user.id).single();
    if (pData?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    setPerfilAdmin(pData);

    const { data: lista } = await supabase
      .from('perfis')
      .select('*')
      .order('aprovado', { ascending: true }); // Mostra os não aprovados primeiro
    
    setTreinadores(lista || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTreinadores();
  }, []);

  const aprovarTreinador = async (id: string) => {
    const { error } = await supabase
      .from('perfis')
      .update({ aprovado: true })
      .eq('id', id);

    if (error) {
      alert("Erro ao aprovar: " + error.message);
    } else {
      // Atualizar localmente para feedback instantâneo
      setTreinadores(treinadores.map(t => t.id === id ? { ...t, aprovado: true } : t));
    }
  };

  const eliminarPerfil = async (id: string, nome: string) => {
    if (id === perfilAdmin.id) return;
    if (window.confirm(`Remover permanentemente o acesso de ${nome}?`)) {
      const { error } = await supabase.from('perfis').delete().eq('id', id);
      if (!error) setTreinadores(treinadores.filter(t => t.id !== id));
    }
  };

  if (loading) return <div style={centerStyle}>A carregar equipa...</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'sans-serif' }}>
      
      {/* HEADER COM LOGO */}
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => router.push('/dashboard')} style={backBtnStyle}><ChevronLeft size={20} /></button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/icons/logo-hajime.jpg" alt="Logo Hajime" style={{ width: '35px', borderRadius: '8px' }} />
            <h1 style={{ fontSize: '18px', fontWeight: '900', margin: 0 }}>Gestão de Treinadores</h1>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0055A4' }}>
            <span style={{ fontSize: '12px', fontWeight: '800' }}>{treinadores.length} MEMBROS</span>
            <Users size={24} />
        </div>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '30px 20px' }}>
        
        {/* LISTA DE TREINADORES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {treinadores.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                Nenhum treinador registado.
            </div>
          ) : (
            treinadores.map((t) => (
              <div key={t.id} style={userCardStyle(t.aprovado)}>
                <div style={avatarStyle(t.role === 'admin')}>
                  {t.role === 'admin' ? <Shield size={20} /> : <User size={20} />}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0 }}>{t.nome} {t.apelido}</h3>
                    {!t.aprovado && <span style={pendingBadgeStyle}>AGUARDA APROVAÇÃO</span>}
                    {t.role === 'admin' && <span style={adminBadgeStyle}>ADMIN</span>}
                  </div>
                  <div style={userInfoStyle}>
                    <Mail size={12} /> {t.email}
                    <Calendar size={12} style={{ marginLeft: '10px' }} /> {t.data_nascimento || 'Data não registada'}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {!t.aprovado && (
                    <button onClick={() => aprovarTreinador(t.id)} style={approveBtnStyle}>
                      <CheckCircle2 size={16} /> Aprovar
                    </button>
                  )}
                  
                  {t.id !== perfilAdmin.id && (
                    <button 
                      onClick={() => eliminarPerfil(t.id, t.nome)} 
                      style={deleteBtnStyle}
                      title="Eliminar Treinador"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

// ESTILOS
const centerStyle: React.CSSProperties = { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#0055A4', fontWeight: '800' };
const headerStyle: React.CSSProperties = { backgroundColor: 'white', padding: '15px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E7EB', position: 'sticky', top: 0, zIndex: 10 };
const backBtnStyle: React.CSSProperties = { background: '#F1F5F9', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer' };

const userCardStyle = (aprovado: boolean): React.CSSProperties => ({
  backgroundColor: 'white', 
  padding: '16px 20px', 
  borderRadius: '20px', 
  border: aprovado ? '1px solid #E5E7EB' : '2px solid #0055A4',
  display: 'flex', 
  alignItems: 'center', 
  gap: '15px', 
  boxShadow: aprovado ? 'none' : '0 4px 12px rgba(0,85,164,0.1)',
  transition: 'all 0.2s ease'
});

const avatarStyle = (isAdmin: boolean): React.CSSProperties => ({ 
  width: '48px', 
  height: '48px', 
  borderRadius: '14px', 
  backgroundColor: isAdmin ? '#0055A4' : '#F1F5F9', 
  color: isAdmin ? 'white' : '#94A3B8', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center' 
});

const userInfoStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '5px', color: '#64748B', fontSize: '12px', marginTop: '4px' };
const pendingBadgeStyle: React.CSSProperties = { backgroundColor: '#FEE2E2', color: '#B91C1C', fontSize: '9px', fontWeight: '900', padding: '3px 8px', borderRadius: '6px' };
const adminBadgeStyle: React.CSSProperties = { backgroundColor: '#E0EEFF', color: '#0055A4', fontSize: '9px', fontWeight: '900', padding: '3px 8px', borderRadius: '6px' };

const approveBtnStyle: React.CSSProperties = { 
  backgroundColor: '#0055A4', 
  color: 'white', 
  border: 'none', 
  padding: '8px 16px', 
  borderRadius: '10px', 
  fontWeight: '700', 
  fontSize: '13px', 
  cursor: 'pointer', 
  display: 'flex', 
  alignItems: 'center', 
  gap: '6px' 
};

const deleteBtnStyle: React.CSSProperties = { 
  background: 'none', 
  border: 'none', 
  color: '#FDA4AF', 
  cursor: 'pointer',
  padding: '8px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};