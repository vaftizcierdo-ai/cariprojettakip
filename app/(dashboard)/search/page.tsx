import { globalSearch } from '@/services/searchService';
import Link from 'next/link';
import { clsx } from 'clsx';
import { Briefcase, Wrench, Factory, GlassWater } from 'lucide-react';

export default async function SearchPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const q = typeof searchParams.q === 'string' ? searchParams.q : '';

    const results = await globalSearch(q);
    const hasResults = results.projects.length > 0 || results.services.length > 0 || results.production.length > 0 || results.glass.length > 0;

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-6">
                Arama Sonuçları: <span className="text-slate-500 font-normal">"{q}"</span>
            </h1>

            {!hasResults ? (
                <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
                    Sonuç bulunamadı.
                </div>
            ) : (
                <div className="space-y-8">
                    {results.projects.length > 0 && (
                        <section>
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-200">
                                <Briefcase className="text-blue-500" size={20} /> Projeler
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {results.projects.map(p => (
                                    <Link key={p.id} href={`/projects/${p.id}`} className="block bg-white p-4 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
                                        <div className="font-medium text-slate-900">{p.description || `Proje #${p.id}`}</div>
                                        <div className="text-sm text-slate-500">{p.clientName || p.companyName}</div>
                                        <div className="text-xs text-slate-400 mt-2">{p.city}</div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {results.services.length > 0 && (
                        <section>
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-200">
                                <Wrench className="text-amber-500" size={20} /> Servis Talepleri
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {results.services.map(s => (
                                    <div key={s.id} className="bg-white p-4 rounded-lg border border-slate-200">
                                        <div className="font-medium text-slate-900 line-clamp-1">{s.description}</div>
                                        <div className="text-sm text-slate-500 mt-1">{s.project.description || `Proje #${s.project.id}`}</div>
                                        <div className="text-xs text-amber-600 mt-2 font-medium">{s.status}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {results.production.length > 0 && (
                        <section>
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-200">
                                <Factory className="text-purple-500" size={20} /> İmalat
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {results.production.map(p => (
                                    <div key={p.id} className="bg-white p-4 rounded-lg border border-slate-200">
                                        <div className="font-medium text-slate-900">{p.type}</div>
                                        <div className="text-sm text-slate-500 mt-1">{p.project.description || `Proje #${p.project.id}`}</div>
                                        <div className="text-xs text-purple-600 mt-2 font-medium">{p.status}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {results.glass.length > 0 && (
                        <section>
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-200">
                                <GlassWater className="text-cyan-500" size={20} /> Cam Siparişleri
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {results.glass.map(g => (
                                    <div key={g.id} className="bg-white p-4 rounded-lg border border-slate-200">
                                        <div className="font-medium text-slate-900">{g.supplier}</div>
                                        <div className="text-sm text-slate-500 mt-1">{g.project.description || `Proje #${g.project.id}`}</div>
                                        <div className="text-xs text-cyan-600 mt-2 font-medium">{g.status}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}
