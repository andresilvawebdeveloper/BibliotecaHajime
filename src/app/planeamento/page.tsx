"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Clock, 
  CalendarDays, 
  CalendarRange,
  PlayCircle
} from 'lucide-react';

export default function PlaneamentoPage() {
  const [aba, setAba] = useState<'diario' | 'semanal' | 'mensal'>('diario');
  const [planos, setPlanos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchPlanos();
  }, [aba]);

  const fetchPlanos = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('planeamentos')
      .select('*, videos(titulo, categoria, youtube_url)')
      .eq('tipo_plano', aba)
      .order('data_planeada', { ascending: true });

    setPlanos(data || []);
    setLoading(false);
  };

  const removerDoPlano = async (id: string) => {
    const { error } = await supabase.from('planeamentos').delete().eq('id', id);
    if (!error) setPlanos(planos.filter(p => p.id !== id));
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'sans-serif' }}>
      
      {/* HEADER */}
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={() => router.push('/dashboard')} style={backBtn}><ChevronLeft size={20}/></button>
          <h1 style={{ fontSize: '20px', fontWeight: '900' }}>Planeamento Hajime</h1>
        </div>
        <img src="/icons/logo-hajime.jpg" alt="Logo" style={{ width: '40px', borderRadius: '8px' }} />
      </header>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '30px 20px' }}>
        
        {/* SELECTOR DE VISTA */}
        <div style={tabsContainer}>
          <button onClick={() => setAba('diario')} style={tabStyle(aba === 'diario')}>
            <Clock size={18}/> Diário
          </button>
          <button onClick={() => setAba('semanal')} style={tabStyle(aba === 'semanal')}>
            <CalendarDays size={18}/> Semanal
          </button>
          <button onClick={() => setAba('mensal')} style={tabStyle(aba === 'mensal')}>
            <CalendarRange size={18}/> Mensal
          </button>
        </div>

        {/* BOTÃO ADICIONAR (REDIRECIONA PARA BIBLIOTECA) */}
        <button onClick={() => router.push('/biblioteca')} style={addBtnLarge}>
          <Plus size={20} /> Adicionar Técnica da Biblioteca
        </button>

        {/* LISTA DE TÉCNICAS PLANEADAS */}
        <div style={{ marginTop: '30px' }}>
          {loading ? (
            <p style={emptyText}>A carregar planeamento...</p>
          ) : planos.length === 0 ? (
            <div style={emptyState}>
              <Calendar size={48} color="#CBD5E1" />
              <p style={emptyText}>Ainda não planeou técnicas para esta vista.</p>
            </div>
          ) : (
            planos.map((item) => (
              <div key={item.id} style={planoCard}>
                <div style={{ flex: 1 }}>
                  <span style={catBadge}>{item.videos?.categoria}</span>
                  <h3 style={videoTitle}>{item.videos?.titulo}</h3>
                  <p style={dateText}>
                    {aba === 'diario' ? new Date(item.data_planeada).toLocaleDateString() : `Planeado para ${aba}`}
                  </p>
                </div>
                <div style={actionsArea}>
                  <button onClick={() => router.push(`/biblioteca/${item.video_id}`)} style={iconBtn}><PlayCircle size={22} color="#0055A4"/></button>
                  <button onClick={() => removerDoPlano(item.id)} style={iconBtn}><Trash2 size={20} color="#FDA4AF"/></button>
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
const headerStyle: React.CSSProperties = { backgroundColor: 'white', padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E7EB', position: 'sticky', top: 0, zIndex: 10 };
const backBtn: React.CSSProperties = { background: '#F1F5F9', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer' };
const tabsContainer: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '25px' };
const tabStyle = (active: boolean): React.CSSProperties => ({
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '12px',
  border: 'none', backgroundColor: active ? '#111827' : 'white', color: active ? 'white' : '#64748B',
  fontWeight: '700', cursor: 'pointer', transition: '0.2s'
});
const addBtnLarge: React.CSSProperties = { width: '100%', padding: '15px', borderRadius: '15px', border: '2px dashed #CBD5E1', backgroundColor: 'transparent', color: '#64748B', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' };
const planoCard: React.CSSProperties = { backgroundColor: 'white', padding: '20px', borderRadius: '18px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', marginBottom: '12px' };
const catBadge: React.CSSProperties = { fontSize: '10px', fontWeight: '900', color: '#0055A4', textTransform: 'uppercase' };
const videoTitle: React.CSSProperties = { margin: '4px 0', fontSize: '16px', fontWeight: '800', color: '#111827' };
const dateText: React.CSSProperties = { margin: 0, fontSize: '12px', color: '#94A3B8' };
const actionsArea: React.CSSProperties = { display: 'flex', gap: '15px' };
const iconBtn: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer' };
const emptyState: React.CSSProperties = { textAlign: 'center', padding: '60px 20px' };
const emptyText: React.CSSProperties = { color: '#94A3B8', marginTop: '15px', fontWeight: '500' };