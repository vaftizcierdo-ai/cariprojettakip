'use client';

import { useState, useEffect } from 'react';
import { Plus, Check, Trash2, X } from 'lucide-react';

interface Todo {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
}

export default function TodoList() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newTodoText, setNewTodoText] = useState('');

    // Load from local storage on mount
    useEffect(() => {
        const savedTodos = localStorage.getItem('dashboard_todos');
        if (savedTodos) {
            try {
                setTodos(JSON.parse(savedTodos));
            } catch (e) {
                console.error('Failed to parse todos', e);
            }
        }
    }, []);

    // Save to local storage whenever todos change
    useEffect(() => {
        localStorage.setItem('dashboard_todos', JSON.stringify(todos));
    }, [todos]);

    const handleAddTodo = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!newTodoText.trim()) return;

        const newTodo: Todo = {
            id: crypto.randomUUID(),
            text: newTodoText.trim(),
            completed: false,
            createdAt: Date.now(),
        };

        setTodos(prev => [newTodo, ...prev]);
        setNewTodoText('');
        setIsAdding(false);
    };

    const toggleTodo = (id: string) => {
        setTodos(prev => prev.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id: string) => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
    };

    return (
        <div style={{
            background: 'rgba(30, 41, 59, 0.4)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '1.5rem',
            padding: '1.5rem',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
            }}>
                <h2 style={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: '#e8e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    Yapılacaklar
                    <span style={{
                        fontSize: '0.75rem',
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#34d399',
                        padding: '0.125rem 0.5rem',
                        borderRadius: '999px',
                        fontWeight: 500
                    }}>
                        {todos.filter(t => !t.completed).length}
                    </span>
                </h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    style={{
                        background: isAdding ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                        color: isAdding ? '#f87171' : '#34d399',
                        border: 'none',
                        borderRadius: '0.75rem',
                        width: '2.5rem',
                        height: '2.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                    title={isAdding ? "İptal" : "Yeni Ekle"}
                >
                    {isAdding ? <X size={20} /> : <Plus size={20} />}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleAddTodo} style={{ marginBottom: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            autoFocus
                            type="text"
                            value={newTodoText}
                            onChange={(e) => setNewTodoText(e.target.value)}
                            placeholder="Yeni görev..."
                            style={{
                                width: '100%',
                                background: 'rgba(15, 23, 42, 0.6)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                padding: '0.75rem 1rem',
                                borderRadius: '0.75rem',
                                color: '#e2e8f0',
                                outline: 'none',
                                fontSize: '0.925rem'
                            }}
                        />
                        <button
                            type="submit"
                            disabled={!newTodoText.trim()}
                            style={{
                                position: 'absolute',
                                right: '0.5rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: newTodoText.trim() ? '#10b981' : 'transparent',
                                color: newTodoText.trim() ? 'white' : 'rgba(255, 255, 255, 0.2)',
                                border: 'none',
                                borderRadius: '0.5rem',
                                padding: '0.25rem',
                                cursor: newTodoText.trim() ? 'pointer' : 'default',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Check size={16} />
                        </button>
                    </div>
                </form>
            )}

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                overflowY: 'auto',
                flex: 1,
                paddingRight: '0.25rem'
            }}>
                {todos.length === 0 && !isAdding && (
                    <div style={{
                        textAlign: 'center',
                        color: '#64748b',
                        marginTop: '2rem',
                        fontSize: '0.9rem'
                    }}>
                        Henüz görev eklenmemiş.<br />
                        Başlamak için + butonuna basın.
                    </div>
                )}

                {todos.map(todo => (
                    <div
                        key={todo.id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem',
                            background: 'rgba(15, 23, 42, 0.4)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '0.75rem',
                            transition: 'all 0.2s ease',
                            opacity: todo.completed ? 0.6 : 1,
                            group: 'group' // Mock group for hover handling if needed via CSS, simplified here
                        }}
                    >
                        <div
                            onClick={() => toggleTodo(todo.id)}
                            style={{
                                width: '1.25rem',
                                height: '1.25rem',
                                borderRadius: '0.375rem',
                                border: `2px solid ${todo.completed ? '#10b981' : '#475569'}`,
                                background: todo.completed ? '#10b981' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                flexShrink: 0,
                                transition: 'all 0.2s',
                            }}
                        >
                            {todo.completed && <Check size={12} color="white" strokeWidth={3} />}
                        </div>

                        <span
                            onClick={() => toggleTodo(todo.id)}
                            style={{
                                flex: 1,
                                color: todo.completed ? '#94a3b8' : '#e2e8f0',
                                textDecoration: todo.completed ? 'line-through' : 'none',
                                cursor: 'pointer',
                                fontSize: '0.925rem',
                                userSelect: 'none'
                            }}
                        >
                            {todo.text}
                        </span>

                        <button
                            onClick={() => deleteTodo(todo.id)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#64748b',
                                cursor: 'pointer',
                                padding: '0.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: 0.5,
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.opacity = '1'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.opacity = '0.5'; }}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
