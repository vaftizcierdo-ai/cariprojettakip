'use client';

import { useState, useRef } from 'react';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import { svg2pdf } from 'svg2pdf.js';

export default function FabricDrawingPage() {
    const [projeAdi, setProjeAdi] = useState<string>('Örnek Proje');
    const [kumasRengi, setKumasRengi] = useState<string>('Beyaz');
    const [kumasAdet, setKumasAdet] = useState<number>(1);
    const [sistemCephe, setSistemCephe] = useState<number>(200);
    const [sistemRayKesim, setSistemRayKesim] = useState<number>(150);
    const [tekerSayisi, setTekerSayisi] = useState<number>(4);
    const [isikSayisi, setIsikSayisi] = useState<number>(0);
    const svgRef = useRef<SVGSVGElement>(null);

    // FIXED: Swapped dimensions - Cephe is now height, Ray Kesim is now width
    const mainHeight = sistemCephe - 6;  // Height from Cephe
    const mainWidth = sistemRayKesim - 10;  // Width from Ray Kesim

    // Saçak dimensions
    const leftSacakWidth = 7;
    const rightSacakWidth = 30;
    const sacakHeight = mainHeight;

    // Total dimensions
    const totalWidth = leftSacakWidth + mainWidth + rightSacakWidth;
    const totalHeight = mainHeight;

    // Calculate divisions based on teker count
    const calculateDivisions = (): number[] => {
        const divisionCount = tekerSayisi - 1;
        if (divisionCount <= 0) return [mainWidth];

        const targetWidth = mainWidth / tekerSayisi;
        const divisions: number[] = [];

        if (targetWidth >= 42 && targetWidth <= 49) {
            const baseWidth = Math.floor(mainWidth / tekerSayisi);
            const remainder = mainWidth - (baseWidth * tekerSayisi);

            for (let i = 0; i < tekerSayisi; i++) {
                divisions.push(baseWidth + (i < remainder ? 1 : 0));
            }
        } else {
            let remaining = mainWidth;
            for (let i = 0; i < tekerSayisi; i++) {
                const segmentsLeft = tekerSayisi - i;
                const avgRemaining = remaining / segmentsLeft;

                let segmentWidth: number;
                if (avgRemaining < 42) {
                    segmentWidth = 42;
                } else if (avgRemaining > 49) {
                    segmentWidth = 49;
                } else {
                    segmentWidth = Math.round(avgRemaining);
                }

                if (i === tekerSayisi - 1) {
                    segmentWidth = remaining;
                }

                divisions.push(segmentWidth);
                remaining -= segmentWidth;
            }
        }

        return divisions;
    };

    const divisions = calculateDivisions();

    // Calculate 300cm fabric roll markers
    const calculate300cmMarkers = (): { index: number; cumulativeWidth: number }[] => {
        const markers: { index: number; cumulativeWidth: number }[] = [];
        let cumulative = 0;
        let lastMarkerAt = 0;

        for (let i = 0; i < divisions.length; i++) {
            cumulative += divisions[i];

            // Check if we've crossed or are close to a 300cm boundary
            const distanceFrom300 = cumulative - lastMarkerAt;

            // If adding this segment exceeds 300cm, mark at the PREVIOUS position
            if (distanceFrom300 > 300) {
                // Mark at previous position (before adding current segment)
                if (i > 0) {
                    const previousCumulative = cumulative - divisions[i];
                    markers.push({ index: i - 1, cumulativeWidth: previousCumulative });
                    lastMarkerAt = previousCumulative;
                }
            }
        }

        // Add final marker for the total width
        if (cumulative > lastMarkerAt) {
            markers.push({ index: divisions.length - 1, cumulativeWidth: cumulative });
        }

        return markers;
    };

    const fabricRollMarkers = calculate300cmMarkers();

    // Calculate hypotenuse
    const hypotenuse = Math.sqrt(mainWidth ** 2 + mainHeight ** 2).toFixed(2);

    // FIXED: Responsive scaling - calculate scale to fit viewport
    const maxDrawingWidth = 800;  // Max width for drawing area
    const maxDrawingHeight = 600; // Max height for drawing area
    const padding = 120; // Increased padding for frame

    // Calculate scale to fit
    const scaleX = (maxDrawingWidth - padding * 2) / totalWidth;
    const scaleY = (maxDrawingHeight - padding * 2) / totalHeight;
    const scale = Math.min(scaleX, scaleY, 3); // Max scale of 3 for small drawings

    const svgWidth = totalWidth * scale + padding * 2;
    const svgHeight = totalHeight * scale + padding * 2;

    // Get current date
    const currentDate = new Date().toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const exportToPDF = async () => {
        if (!svgRef.current) return;

        const pdf = new jsPDF({
            orientation: svgWidth > svgHeight ? 'landscape' : 'portrait',
            unit: 'pt',
            format: [svgWidth, svgHeight]
        });

        await svg2pdf(svgRef.current, pdf, {
            x: 0,
            y: 0,
            width: svgWidth,
            height: svgHeight
        });

        pdf.save(`${projeAdi.replace(/\s+/g, '-')}-kumas-cizimi.pdf`);
    };

    return (
        <div style={{
            padding: '2rem',
            maxWidth: '1600px',
            margin: '0 auto'
        }}>
            <div style={{
                background: 'rgba(30, 30, 46, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '1.5rem',
                padding: '2rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem'
                }}>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        background: 'linear-gradient(to right, #34d399, #10b981)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Kumaş Çizimi
                    </h1>
                    <button
                        onClick={exportToPDF}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            border: 'none',
                            borderRadius: '0.75rem',
                            color: 'white',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                        }}
                    >
                        <Download size={18} />
                        PDF Olarak İndir
                    </button>
                </div>

                {/* Input Form - Horizontal at Top */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '1rem'
                    }}>
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: '#d1d5db',
                                marginBottom: '0.5rem'
                            }}>
                                Proje Adı
                            </label>
                            <input
                                type="text"
                                value={projeAdi}
                                onChange={(e) => setProjeAdi(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    background: '#16161f',
                                    border: '1px solid #2a2a3a',
                                    borderRadius: '0.5rem',
                                    color: '#e8e8f0',
                                    fontSize: '0.75rem',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: '#d1d5db',
                                marginBottom: '0.5rem'
                            }}>
                                Kumaş Rengi
                            </label>
                            <input
                                type="text"
                                value={kumasRengi}
                                onChange={(e) => setKumasRengi(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    background: '#16161f',
                                    border: '1px solid #2a2a3a',
                                    borderRadius: '0.5rem',
                                    color: '#e8e8f0',
                                    fontSize: '0.75rem',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: '#d1d5db',
                                marginBottom: '0.5rem'
                            }}>
                                Kumaş Adet
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={kumasAdet}
                                onChange={(e) => setKumasAdet(Math.max(1, Number(e.target.value)))}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    background: '#16161f',
                                    border: '1px solid #2a2a3a',
                                    borderRadius: '0.5rem',
                                    color: '#e8e8f0',
                                    fontSize: '0.75rem',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: '#d1d5db',
                                marginBottom: '0.5rem'
                            }}>
                                Sistem Cephe (cm)
                            </label>
                            <input
                                type="number"
                                value={sistemCephe}
                                onChange={(e) => setSistemCephe(Number(e.target.value))}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    background: '#16161f',
                                    border: '1px solid #2a2a3a',
                                    borderRadius: '0.5rem',
                                    color: '#e8e8f0',
                                    fontSize: '0.75rem',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: '#d1d5db',
                                marginBottom: '0.5rem'
                            }}>
                                Sistem Ray Kesim (cm)
                            </label>
                            <input
                                type="number"
                                value={sistemRayKesim}
                                onChange={(e) => setSistemRayKesim(Number(e.target.value))}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    background: '#16161f',
                                    border: '1px solid #2a2a3a',
                                    borderRadius: '0.5rem',
                                    color: '#e8e8f0',
                                    fontSize: '0.75rem',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: '#d1d5db',
                                marginBottom: '0.5rem'
                            }}>
                                Teker Sayısı (adet)
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={tekerSayisi}
                                onChange={(e) => setTekerSayisi(Math.max(1, Number(e.target.value)))}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    background: '#16161f',
                                    border: '1px solid #2a2a3a',
                                    borderRadius: '0.5rem',
                                    color: '#e8e8f0',
                                    fontSize: '0.75rem',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: '#d1d5db',
                                marginBottom: '0.5rem'
                            }}>
                                Işık Sayısı (adet)
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={isikSayisi}
                                onChange={(e) => setIsikSayisi(Math.max(0, Number(e.target.value)))}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    background: '#16161f',
                                    border: '1px solid #2a2a3a',
                                    borderRadius: '0.5rem',
                                    color: '#e8e8f0',
                                    fontSize: '0.75rem',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        {/* Calculated Values */}
                        <div style={{
                            gridColumn: 'span 1',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            gap: '0.25rem'
                        }}>
                            <div style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 600 }}>
                                Hesaplanan Değerler
                            </div>
                            <div style={{ fontSize: '0.65rem', color: '#a0a0b8' }}>
                                Ana: {mainWidth}×{mainHeight} cm
                            </div>
                            <div style={{ fontSize: '0.65rem', color: '#a0a0b8' }}>
                                Toplam: {totalWidth} cm
                            </div>
                            <div style={{ fontSize: '0.65rem', color: '#a0a0b8' }}>
                                Hipotenüs: {hypotenuse} cm
                            </div>
                        </div>
                    </div>
                </div>

                {/* SVG Drawing - Full Width Below */}
                <div style={{

                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'auto'
                }}>
                    <svg
                        ref={svgRef}
                        width={svgWidth}
                        height={svgHeight}
                        style={{ background: 'white' }}
                    >
                        {/* Technical Drawing Frame */}
                        <rect
                            x="5"
                            y="5"
                            width={svgWidth - 10}
                            height={svgHeight - 10}
                            fill="none"
                            stroke="black"
                            strokeWidth="3"
                        />

                        {/* Date - Bottom Right */}
                        <text
                            x={svgWidth - 15}
                            y={svgHeight - 10}
                            textAnchor="end"
                            fontSize="12"
                            fontWeight="bold"
                            fill="black"
                        >
                            Tarih: {currentDate}
                        </text>

                        {/* Project Info Boxes - Top Left - 2 columns */}
                        <g>
                            {/* Column 1 */}
                            {/* Proje Adı */}
                            <rect x="15" y="15" width="150" height="20" fill="none" stroke="black" strokeWidth="1" />
                            <text x="20" y="29" fontSize="10" fill="black">Proje: {projeAdi}</text>

                            {/* Kumaş Rengi */}
                            <rect x="15" y="37" width="150" height="20" fill="none" stroke="black" strokeWidth="1" />
                            <text x="20" y="51" fontSize="10" fill="black">Renk: {kumasRengi}</text>

                            {/* Kumaş Adet */}
                            <rect x="15" y="59" width="150" height="20" fill="none" stroke="black" strokeWidth="1" />
                            <text x="20" y="73" fontSize="10" fill="black">Adet: {kumasAdet}</text>

                            {/* Column 2 */}
                            {/* Teker Sayısı */}
                            <rect x="170" y="15" width="150" height="20" fill="none" stroke="black" strokeWidth="1" />
                            <text x="175" y="29" fontSize="10" fill="black">Teker: {tekerSayisi}</text>

                            {/* Işık Sayısı */}
                            <rect x="170" y="37" width="150" height="20" fill="none" stroke="black" strokeWidth="1" />
                            <text x="175" y="51" fontSize="10" fill="black">Işık: {isikSayisi}</text>
                        </g>

                        {/* Left Saçak */}
                        <rect
                            x={padding}
                            y={padding}
                            width={leftSacakWidth * scale}
                            height={sacakHeight * scale}
                            fill="none"
                            stroke="black"
                            strokeWidth="2"
                        />

                        {/* Main Area */}
                        <rect
                            x={padding + leftSacakWidth * scale}
                            y={padding}
                            width={mainWidth * scale}
                            height={mainHeight * scale}
                            fill="none"
                            stroke="black"
                            strokeWidth="2"
                        />

                        {/* Right Saçak */}
                        <rect
                            x={padding + (leftSacakWidth + mainWidth) * scale}
                            y={padding}
                            width={rightSacakWidth * scale}
                            height={sacakHeight * scale}
                            fill="none"
                            stroke="black"
                            strokeWidth="2"
                        />

                        {/* Division Lines and Labels */}
                        {divisions.map((width, index) => {
                            if (index === divisions.length - 1) return null;

                            const xPos = divisions.slice(0, index + 1).reduce((sum, w) => sum + w, 0);
                            const lineX = padding + leftSacakWidth * scale + xPos * scale;

                            return (
                                <line
                                    key={index}
                                    x1={lineX}
                                    y1={padding}
                                    x2={lineX}
                                    y2={padding + mainHeight * scale}
                                    stroke="black"
                                    strokeWidth="1"
                                    strokeDasharray="5,5"
                                />
                            );
                        })}

                        {/* Division Width Labels */}
                        {divisions.map((width, index) => {
                            const xStart = divisions.slice(0, index).reduce((sum, w) => sum + w, 0);
                            const xCenter = xStart + width / 2;
                            const textX = padding + leftSacakWidth * scale + xCenter * scale;
                            const textY = padding + mainHeight * scale / 2;

                            return (
                                <text
                                    key={`label-${index}`}
                                    x={textX}
                                    y={textY}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontSize="10"
                                    fontWeight="bold"
                                    fill="black"
                                >
                                    {width}
                                </text>
                            );
                        })}

                        {/* 300cm Fabric Roll Markers - Special Colored Lines */}
                        {fabricRollMarkers.map((marker, markerIndex) => {
                            const xPos = divisions.slice(0, marker.index + 1).reduce((sum, w) => sum + w, 0);
                            const lineX = padding + leftSacakWidth * scale + xPos * scale;

                            return (
                                <line
                                    key={`marker-${markerIndex}`}
                                    x1={lineX}
                                    y1={padding}
                                    x2={lineX}
                                    y2={padding + mainHeight * scale}
                                    stroke="#ff6b00"
                                    strokeWidth="2"
                                />
                            );
                        })}

                        {/* 300cm Section Dimension Labels */}
                        {fabricRollMarkers.map((marker, markerIndex) => {
                            const startX = markerIndex === 0 ? 0 : divisions.slice(0, fabricRollMarkers[markerIndex - 1].index + 1).reduce((sum, w) => sum + w, 0);
                            const endX = divisions.slice(0, marker.index + 1).reduce((sum, w) => sum + w, 0);
                            const sectionWidth = markerIndex === 0 ? marker.cumulativeWidth : marker.cumulativeWidth - fabricRollMarkers[markerIndex - 1].cumulativeWidth;
                            const centerX = (startX + endX) / 2;
                            const textX = padding + leftSacakWidth * scale + centerX * scale;

                            return (
                                <g key={`section-label-${markerIndex}`}>
                                    {/* Dimension line for this section */}
                                    <line
                                        x1={padding + leftSacakWidth * scale + startX * scale}
                                        y1={padding + mainHeight * scale + 35}
                                        x2={padding + leftSacakWidth * scale + endX * scale}
                                        y2={padding + mainHeight * scale + 35}
                                        stroke="#ff6b00"
                                        strokeWidth="0.5"
                                        markerStart="url(#arrowhead)"
                                        markerEnd="url(#arrowhead)"
                                    />
                                    {/* Section width label */}
                                    <text
                                        x={textX}
                                        y={padding + mainHeight * scale + 50}
                                        textAnchor="middle"
                                        fontSize="11"
                                        fontWeight="bold"
                                        fill="#ff6b00"
                                    >
                                        {sectionWidth} cm
                                    </text>
                                </g>
                            );
                        })}

                        {/* Hypotenuse Line and Label */}
                        <line
                            x1={padding + leftSacakWidth * scale}
                            y1={padding}
                            x2={padding + (leftSacakWidth + mainWidth) * scale}
                            y2={padding + mainHeight * scale}
                            stroke="red"
                            strokeWidth="1"
                            strokeDasharray="3,3"
                        />
                        <text
                            x={padding + leftSacakWidth * scale + mainWidth * scale / 2}
                            y={padding + mainHeight * scale / 2 - 20}
                            textAnchor="middle"
                            fontSize="12"
                            fill="red"
                            fontWeight="bold"
                        >
                            Kontrol: {hypotenuse} cm
                        </text>

                        {/* Dimension Lines with Arrows - Blue */}
                        <defs>
                            <marker
                                id="arrowhead"
                                markerWidth="6"
                                markerHeight="6"
                                refX="5"
                                refY="2"
                                orient="auto"
                            >
                                <polygon points="0 0, 6 2, 0 4" fill="blue" />
                            </marker>
                        </defs>

                        {/* Left Saçak Width Dimension Line */}
                        <g>
                            <line
                                x1={padding}
                                y1={padding + mainHeight * scale + 10}
                                x2={padding + leftSacakWidth * scale}
                                y2={padding + mainHeight * scale + 10}
                                stroke="blue"
                                strokeWidth="0.5"
                                markerStart="url(#arrowhead)"
                                markerEnd="url(#arrowhead)"
                            />
                        </g>

                        {/* Main Area Width Dimension Line */}
                        <g>
                            <line
                                x1={padding + leftSacakWidth * scale}
                                y1={padding + mainHeight * scale + 10}
                                x2={padding + (leftSacakWidth + mainWidth) * scale}
                                y2={padding + mainHeight * scale + 10}
                                stroke="blue"
                                strokeWidth="0.5"
                                markerStart="url(#arrowhead)"
                                markerEnd="url(#arrowhead)"
                            />
                        </g>

                        {/* Right Saçak Width Dimension Line */}
                        <g>
                            <line
                                x1={padding + (leftSacakWidth + mainWidth) * scale}
                                y1={padding + mainHeight * scale + 10}
                                x2={padding + totalWidth * scale}
                                y2={padding + mainHeight * scale + 10}
                                stroke="blue"
                                strokeWidth="0.5"
                                markerStart="url(#arrowhead)"
                                markerEnd="url(#arrowhead)"
                            />
                        </g>

                        {/* Total Width Dimension Line */}
                        <g>
                            <line
                                x1={padding}
                                y1={padding - 10}
                                x2={padding + totalWidth * scale}
                                y2={padding - 10}
                                stroke="blue"
                                strokeWidth="0.5"
                                markerStart="url(#arrowhead)"
                                markerEnd="url(#arrowhead)"
                            />
                        </g>

                        {/* Height Dimension Line */}
                        <g>
                            <line
                                x1={padding - 15}
                                y1={padding}
                                x2={padding - 15}
                                y2={padding + mainHeight * scale}
                                stroke="blue"
                                strokeWidth="0.5"
                                markerStart="url(#arrowhead)"
                                markerEnd="url(#arrowhead)"
                            />
                        </g>

                        {/* Dimension Labels */}
                        {/* Left Saçak Width */}
                        <text
                            x={padding + leftSacakWidth * scale / 2}
                            y={padding + mainHeight * scale + 25}
                            textAnchor="middle"
                            fontSize="10"
                            fill="blue"
                        >
                            {leftSacakWidth}
                        </text>

                        {/* Main Area Width */}
                        <text
                            x={padding + leftSacakWidth * scale + mainWidth * scale / 2}
                            y={padding + mainHeight * scale + 25}
                            textAnchor="middle"
                            fontSize="10"
                            fill="blue"
                        >
                            {mainWidth}
                        </text>

                        {/* Right Saçak Width */}
                        <text
                            x={padding + (leftSacakWidth + mainWidth + rightSacakWidth / 2) * scale}
                            y={padding + mainHeight * scale + 25}
                            textAnchor="middle"
                            fontSize="10"
                            fill="blue"
                        >
                            {rightSacakWidth}
                        </text>

                        {/* Total Width */}
                        <text
                            x={padding + totalWidth * scale / 2}
                            y={padding - 15}
                            textAnchor="middle"
                            fontSize="12"
                            fontWeight="bold"
                            fill="blue"
                        >
                            Toplam: {totalWidth} cm
                        </text>

                        {/* Height */}
                        <text
                            x={padding - 30}
                            y={padding + mainHeight * scale / 2}
                            textAnchor="middle"
                            fontSize="10"
                            fill="blue"
                            transform={`rotate(-90, ${padding - 30}, ${padding + mainHeight * scale / 2})`}
                        >
                            {mainHeight}
                        </text>
                    </svg>
                </div>
            </div>
        </div>
    );
}
