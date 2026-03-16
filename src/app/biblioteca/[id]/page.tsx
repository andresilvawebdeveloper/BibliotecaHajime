"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import { 
  ChevronLeft, Info, Target, Users, Calendar, ExternalLink, 
  CalendarPlus, Check, Clock, CalendarDays, CalendarRange
} from 'lucide-react';

export default function VideoDetailPage() {
  const { id } = useParams();
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPlanMenu, setShowPlanMenu] = useState(false);
  const [planeadoComSucesso, setPlaneadoComSucesso] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchVideo = async () => {
      const { data, error } = await supabase.from('videos').select('*').eq('id', id).single();
      if (error || !data) router.push('/biblioteca');
      else setVideo(data);
      setLoading(false);
    };
    fetchVideo();
  }, [id, supabase, router]);

  const adicionarAoPlano = async (tipo: 'diario' | 'semanal' | 'mensal') => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('planeamentos').insert([{
      treinador_id: user.id,
      video_id: id,
      tipo_plano: tipo,
      data_planeada: new Date().toISOString().split('T')[0]
    }]);

    if (!error) {
      setPlaneadoComSucesso(true);
      setShowPlanMenu(false);
      setTimeout(() => setPlaneadoComSucesso(false), 3000);
    }
  };

  // PROTEÇÃO CONTRA ERRO 153/253
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    
    if (!videoId) return '';
    
    // youtube-nocookie é essencial para evitar bloqueios de domínio/cookies
    return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0&enablejsapi=1`;
  };

  if (loading) return (
    <div style={centerStyle}>
      <div style={{ color: '#0055A4', fontWeight: '900', letterSpacing: '2px' }}>HAJIME...</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', paddingBottom: '80px', fontFamily: 'sans-serif' }}>
      
      {/* NAVBAR */}
      <nav style={navStyle}>
        <button onClick={() => router.push('/biblioteca')} style={backButtonStyle}>
          <ChevronLeft size={20} /> Biblioteca
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
          {/* BOTÃO DE PLANEAMENTO - AGORA DISCRETO */}
          <button 
            onClick={() => setShowPlanMenu(!showPlanMenu)} 
            style={planBtnStyle(planeadoComSucesso)}
          >
            {planeadoComSucesso ? <Check size={18}/> : <CalendarPlus size={18}/>}
            <span className="mobile-hide">{planeadoComSucesso ? 'Adicionado' : 'Planear'}</span>
          </button>

          {/* DROPDOWN QUE SÓ APARECE AO CLICAR */}
          {showPlanMenu && (
            <div style={dropdownPlan}>
              <p style={dropdownTitle}>Adicionar ao plano:</p>
              <button style={dropdownItem} onClick={() => adicionarAoPlano('diario')}><Clock size={14}/> Diário (Hoje)</button>
              <button style={dropdownItem} onClick={() => adicionarAoPlano('semanal')}><CalendarDays size={14}/> Semanal</button>
              <button style={dropdownItem} onClick={() => adicionarAoPlano('mensal')}><CalendarRange size={14}/> Mensal</button>
            </div>
          )}
          
          <img src="/icons/logo-hajime.jpg" alt="Logo" style={{ width: '42px', borderRadius: '10px' }} />
        </div>
      </nav>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* PLAYER DE VÍDEO - FOCO PRINCIPAL */}
        <div style={videoWrapperStyle}>
          {video && (
            <iframe 
              src={getEmbedUrl(video.youtube_url)}
              style={iframeStyle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="no-referrer-when-downgrade" // CRÍTICO PARA ERRO 153
              allowFullScreen
              title={video.titulo}
            />
          )}
        </div>

        {/* INFO GRID */}
        <div style={contentGridStyle}>
          
          <div style={{ flex: 2, minWidth: '300px' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
               <span style={categoryBadgeStyle}>{video?.categoria}</span>
               <span style={ageBadgeStyle(video?.faixa_etaria)}>{video?.faixa_etaria} anos</span>
            </div>
            
            <h1 style={mainTitleStyle}>{video?.titulo}</h1>
            
            <div style={descriptionBoxStyle}>
              <div style={boxHeaderStyle}>
                <Info size={20} color="#0055A4" />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Notas do Treinador</h3>
              </div>
              <p style={descriptionTextStyle}>
                {video?.descricao || "Sem observações técnicas registadas."}
              </p>
            </div>
          </div>

          {/* SIDEBAR DE DETALHES */}
          <div style={sidebarInfoStyle}>
            <div style={detailItemStyle}>
              <Target size={18} color="#64748B" />
              <div><p style={detailLabel}>Foco</p><p style={detailValue}>{video?.categoria}</p></div>
            </div>
            <div style={detailItemStyle}>
              <Users size={18} color="#64748B" />
              <div><p style={detailLabel}>Classe</p><p style={detailValue}>{video?.faixa_etaria} anos</p></div>
            </div>
            <div style={detailItemStyle}>
              <Calendar size={18} color="#64748B" />
              <div>
                <p style={detailLabel}>Criado em</p>
                <p style={detailValue}>{video?.created_at ? new Date(video.created_at).toLocaleDateString('pt-PT') : '---'}</p>
              </div>
            </div>
            <a href={video?.youtube_url} target="_blank" rel="noreferrer" style={youtubeLinkStyle}>
              <ExternalLink size={16} /> Abrir no YouTube
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

// ESTILOS
const centerStyle: React.CSSProperties = { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const navStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', position: 'sticky', top: 0, zIndex: 1000 };
const backButtonStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '6px', background: '#F1F5F9', border: 'none', cursor: 'pointer', fontWeight: '700', color: '#111827', padding: '8px 14px', borderRadius: '10px', fontSize: '13px' };
const planBtnStyle = (success: boolean): React.CSSProperties => ({ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '10px', border: 'none', backgroundColor: success ? '#DCFCE7' : '#111827', color: success ? '#166534' : 'white', fontWeight: '700', cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s' });
const dropdownPlan: React.CSSProperties = { position: 'absolute', top: '50px', right: '0', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', border: '1px solid #E5E7EB', padding: '8px', width: '170px', display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 1100 };
const dropdownTitle: React.CSSProperties = { margin: '4px 8px', fontSize: '10px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' };
const dropdownItem: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#334155', borderRadius: '8px' };
const videoWrapperStyle: React.CSSProperties = { position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: '20px', overflow: 'hidden', backgroundColor: 'black', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' };
const iframeStyle: React.CSSProperties = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' };
const contentGridStyle: React.CSSProperties = { marginTop: '30px', display: 'flex', gap: '30px', flexWrap: 'wrap' };
const mainTitleStyle: React.CSSProperties = { fontSize: '28px', fontWeight: '900', color: '#111827', margin: '0 0 20px 0' };
const categoryBadgeStyle: React.CSSProperties = { backgroundColor: '#0055A4', color: 'white', padding: '5px 12px', borderRadius: '6px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' };
const ageBadgeStyle = (idade: string): React.CSSProperties => ({ backgroundColor: '#F1F5F9', color: '#475569', padding: '5px 12px', borderRadius: '6px', fontSize: '10px', fontWeight: '900' });
const descriptionBoxStyle: React.CSSProperties = { backgroundColor: 'white', padding: '24px', borderRadius: '18px', border: '1px solid #E5E7EB' };
const boxHeaderStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' };
const descriptionTextStyle: React.CSSProperties = { color: '#4B5563', lineHeight: '1.6', fontSize: '15px', margin: 0, whiteSpace: 'pre-line' };
const sidebarInfoStyle: React.CSSProperties = { flex: 1, minWidth: '250px', display: 'flex', flexDirection: 'column', gap: '15px' };
const detailItemStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E5E7EB' };
const detailLabel: React.CSSProperties = { margin: 0, fontSize: '10px', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase' };
const detailValue: React.CSSProperties = { margin: 0, fontSize: '13px', color: '#111827', fontWeight: '700' };
const youtubeLinkStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '10px', textDecoration: 'none', fontWeight: '800', fontSize: '12px' };