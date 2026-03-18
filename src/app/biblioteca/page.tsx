"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { 
  Library, ChevronLeft, Play, Search, Video, Trash2, Filter, Heart 
} from 'lucide-react';

export default function BibliotecaGeral() {
  const [videos, setVideos] = useState<any[]>([]);
  const [favoritos, setFavoritos] = useState<string[]>([]); // Guarda os IDs dos vídeos favoritos
  const [perfil, setPerfil] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Estados de Filtragem
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [filtroIdade, setFiltroIdade] = useState('Todos');
  const [pesquisa, setPesquisa] = useState('');
  const [apenasFavoritos, setApenasFavoritos] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }

    // Buscar Perfil
    const { data: pData } = await supabase.from('perfis').select('*').eq('id', user.id).single();
    setPerfil(pData);

    // Buscar Vídeos
    const { data: vData } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
    setVideos(vData || []);

    // Buscar Favoritos do Utilizador
    const { data: fData } = await supabase.from('favoritos').select('video_id').eq('user_id', user.id);
    setFavoritos(fData?.map(f => f.video_id) || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [supabase]);

  const toggleFavorito = async (e: React.MouseEvent, videoId: string) => {
    e.stopPropagation(); // Impede de abrir o detalhe do vídeo
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (favoritos.includes(videoId)) {
      await supabase.from('favoritos').delete().eq('user_id', user.id).eq('video_id', videoId);
      setFavoritos(favoritos.filter(id => id !== videoId));
    } else {
      await supabase.from('favoritos').insert([{ user_id: user.id, video_id: videoId }]);
      setFavoritos([...favoritos, videoId]);
    }
  };

  const getThumbnail = (url: string) => {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : null;
    return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
  };

  const removerVideo = async (e: React.MouseEvent, id: string, titulo: string) => {
    e.stopPropagation();
    if (window.confirm(`Eliminar técnica: "${titulo}"?`)) {
      const { error } = await supabase.from('videos').delete().eq('id', id);
      if (!error) setVideos(videos.filter(v => v.id !== id));
    }
  };

  // Lógica de Filtragem Combinada
  const videosExibidos = videos.filter(v => {
    const correspondeCat = filtroCategoria === 'Todas' || v.categoria === filtroCategoria;
    const correspondeIdade = filtroIdade === 'Todos' || v.faixa_etaria === filtroIdade;
    const correspondePesquisa = v.titulo.toLowerCase().includes(pesquisa.toLowerCase());
    const correspondeFavorito = apenasFavoritos ? favoritos.includes(v.id) : true;
    return correspondeCat && correspondeIdade && correspondePesquisa && correspondeFavorito;
  });

  if (loading) return <div style={centerStyle}>A carregar biblioteca...</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'sans-serif', paddingBottom: '40px' }}>
      
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => router.push('/dashboard')} style={backBtnStyle}><ChevronLeft size={20} /></button>
          <h1 style={{ fontSize: '18px', fontWeight: '900' }}>Biblioteca Técnica</h1>
        </div>
        <img src="/icons/logo-hajime-biblioteca.png" alt="Logo" style={{ width: '42px' }} />
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        
        {/* PESQUISA E FILTRO FAVORITOS */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <div style={searchContainerStyle}>
            <Search size={18} color="#94A3B8" />
            <input 
              type="text" 
              placeholder="Procurar por nome..." 
              style={searchInputStyle}
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setApenasFavoritos(!apenasFavoritos)}
            style={favToggleButtonStyle(apenasFavoritos)}
          >
            <Heart size={18} fill={apenasFavoritos ? "white" : "none"} />
            {!isMobile && (apenasFavoritos ? "Ver Todos" : "Meus Favoritos")}
          </button>
        </div>

        {/* FILTROS DE CATEGORIA */}
        <p style={filterLabelStyle}>Categoria:</p>
        <div style={filterContainerStyle}>
          {['Todas', 'Nage-waza', 'Ne-waza', 'Transicao pé-chao'].map((cat) => (
            <button key={cat} onClick={() => setFiltroCategoria(cat)} style={filterButtonStyle(filtroCategoria === cat)}>{cat}</button>
          ))}
        </div>

        {/* FILTROS DE FAIXA ETÁRIA */}
        <p style={filterLabelStyle}>Faixa Etária:</p>
        <div style={filterContainerStyle}>
          {['Todos', '3-5', '6-9', '10+'].map((idade) => (
            <button key={idade} onClick={() => setFiltroIdade(idade)} style={ageButtonStyle(filtroIdade === idade)}>
              {idade === 'Todos' ? 'Todas as idades' : `${idade} anos`}
            </button>
          ))}
        </div>

        <div style={{ height: '1px', backgroundColor: '#E2E8F0', margin: '24px 0' }} />

        {/* LISTAGEM */}
        {videosExibidos.length === 0 ? (
          <div style={emptyStateStyle}><Video size={40} color="#CBD5E1" /><p>Sem resultados para estes filtros.</p></div>
        ) : (
          <div style={gridStyle}>
            {videosExibidos.map((video) => (
              <div key={video.id} onClick={() => router.push(`/biblioteca/${video.id}`)} style={videoCardStyle}>
                <div style={{ position: 'relative', height: '160px', backgroundColor: '#000' }}>
                  <img src={getThumbnail(video.youtube_url) || ''} style={thumbStyle} alt={video.titulo} />
                  
                  {/* BOTÃO FAVORITO (CORAÇÃO) */}
                  <button 
                    onClick={(e) => toggleFavorito(e, video.id)}
                    style={heartButtonStyle(favoritos.includes(video.id))}
                  >
                    <Heart size={18} fill={favoritos.includes(video.id) ? "#EF4444" : "none"} />
                  </button>

                  {perfil?.role === 'admin' && (
                    <button onClick={(e) => removerVideo(e, video.id, video.titulo)} style={deleteButtonStyle}><Trash2 size={16} /></button>
                  )}
                  <div style={ageBadgeStyle}>{video.faixa_etaria || 'Todos'}</div>
                  <div style={playOverlayStyle}><Play size={32} color="white" fill="white" /></div>
                </div>
                <div style={{ padding: '16px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '800', color: '#0055A4' }}>{video.categoria.toUpperCase()}</span>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '4px 0', color: '#111827' }}>{video.titulo}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// ESTILOS ATUALIZADOS
const heartButtonStyle = (active: boolean): React.CSSProperties => ({
  position: 'absolute', top: '10px', left: '10px', background: 'white', border: 'none', 
  width: '34px', height: '34px', borderRadius: '10px', display: 'flex', alignItems: 'center', 
  justifyContent: 'center', cursor: 'pointer', color: active ? '#EF4444' : '#CBD5E1', 
  zIndex: 11, boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
});

const favToggleButtonStyle = (active: boolean): React.CSSProperties => ({
  display: 'flex', 
  alignItems: 'center', 
  gap: '8px', 
  padding: '0 20px', 
  borderRadius: '14px',
  backgroundColor: active ? '#EF4444' : 'white', 
  color: active ? 'white' : '#64748B',
  fontWeight: '700', 
  fontSize: '14px', 
  cursor: 'pointer', 
  border: active ? '1px solid #EF4444' : '1px solid #E2E8F0', // Apenas uma vez aqui
  transition: 'all 0.2s'
});

const filterLabelStyle: React.CSSProperties = { fontSize: '11px', fontWeight: '800', color: '#94A3B8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' };
const ageButtonStyle = (active: boolean): React.CSSProperties => ({
  padding: '8px 16px', borderRadius: '10px', border: active ? 'none' : '1px solid #E2E8F0',
  backgroundColor: active ? '#111827' : 'white', color: active ? 'white' : '#64748B',
  fontWeight: '700', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s'
});
const ageBadgeStyle: React.CSSProperties = { position: 'absolute', bottom: '10px', left: '10px', backgroundColor: '#0055A4', color: 'white', padding: '3px 8px', borderRadius: '5px', fontSize: '10px', fontWeight: '900' };
const centerStyle: React.CSSProperties = { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' };
const headerStyle: React.CSSProperties = { backgroundColor: 'white', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E7EB', position: 'sticky', top: 0, zIndex: 50 };
const backBtnStyle: React.CSSProperties = { background: '#F1F5F9', border: 'none', cursor: 'pointer', color: '#111827', padding: '8px', borderRadius: '10px' };
const searchContainerStyle: React.CSSProperties = { flex: 1, display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'white', padding: '12px 16px', borderRadius: '14px', border: '1px solid #E2E8F0' };
const searchInputStyle: React.CSSProperties = { border: 'none', outline: 'none', width: '100%', fontSize: '14px', fontWeight: '500' };
const filterContainerStyle: React.CSSProperties = { display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '15px' };
const filterButtonStyle = (active: boolean): React.CSSProperties => ({
  padding: '8px 18px', borderRadius: '10px', border: active ? 'none' : '1px solid #E2E8F0',
  backgroundColor: active ? '#0055A4' : 'white', color: active ? 'white' : '#64748B',
  fontWeight: '700', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap'
});
const gridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' };
const videoCardStyle: React.CSSProperties = { backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #E5E7EB', cursor: 'pointer' };
const thumbStyle: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 };
const deleteButtonStyle: React.CSSProperties = { position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(255,255,255,0.9)', color: '#E11D48', padding: '5px', borderRadius: '6px', border: 'none', cursor: 'pointer', zIndex: 10 };
const playOverlayStyle: React.CSSProperties = { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.1)' };
const emptyStateStyle: React.CSSProperties = { textAlign: 'center', padding: '40px', color: '#94A3B8', backgroundColor: 'white', borderRadius: '20px', border: '1px solid #E2E8F0' };

// Detetar se é mobile para esconder texto do botão favoritos
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;