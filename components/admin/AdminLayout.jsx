"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const menuItems = [
        {
            title: "Dashboard",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                </svg>
            ),
            path: "/admin/dashboard",
            badge: null
        },
        {
            title: "Courses",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
            ),
            path: "/admin/courses",
            badge: "36"
        },
        {
            title: "Users",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            ),
            path: "/admin/users",
            badge: "1.2K"
        },
        {
            title: "Certifications",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="7" />
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                </svg>
            ),
            path: "/admin/certifications",
            badge: "23"
        },
        {
            title: "Jobs",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
            ),
            path: "/admin/jobs",
            badge: null
        }
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
            {/* Sidebar */}
            <aside
                style={{
                    width: sidebarOpen ? '240px' : '70px',
                    background: '#ffffff',
                    borderRight: '1px solid #e9ecef',
                    transition: 'width 0.3s ease',
                    position: 'fixed',
                    height: '100vh',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '20px',
                    borderBottom: '1px solid #e9ecef',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    {sidebarOpen && (
                        <div>
                            <h3 style={{
                                fontSize: '18px',
                                fontWeight: '600',
                                margin: 0,
                                color: '#212529'
                            }}>
                                DAGARMY
                            </h3>
                            <p style={{ fontSize: '11px', color: '#6c757d', margin: 0 }}>Admin Panel</p>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#6c757d',
                            padding: '4px'
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Navigation */}
                <nav style={{
                    padding: '16px 12px',
                    flex: 1,
                    overflowY: 'auto'
                }}>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    marginBottom: '4px',
                                    background: isActive ? '#f8f5ff' : 'transparent',
                                    color: isActive ? '#7c3aed' : '#6c757d',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer',
                                    position: 'relative'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = '#f8f9fa';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'transparent';
                                    }
                                }}
                            >
                                {isActive && (
                                    <div style={{
                                        position: 'absolute',
                                        left: 0,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        width: '3px',
                                        height: '20px',
                                        background: '#7c3aed',
                                        borderRadius: '0 3px 3px 0'
                                    }} />
                                )}

                                <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                                    {item.icon}
                                </div>

                                {sidebarOpen && (
                                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '14px', fontWeight: '500' }}>
                                            {item.title}
                                        </span>
                                        {item.badge && (
                                            <span style={{
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                background: isActive ? '#7c3aed' : '#e9ecef',
                                                color: isActive ? '#ffffff' : '#6c757d',
                                                fontSize: '10px',
                                                fontWeight: '600'
                                            }}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                {sidebarOpen && (
                    <div style={{
                        padding: '16px',
                        borderTop: '1px solid #e9ecef'
                    }}>
                        <div style={{ fontSize: '10px', color: '#adb5bd', marginBottom: '8px', textTransform: 'uppercase' }}>
                            Logged in as
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#ffffff'
                            }}>
                                A
                            </div>
                            <div>
                                <div style={{ fontSize: '13px', fontWeight: '500', color: '#212529' }}>Admin</div>
                                <div style={{ fontSize: '11px', color: '#6c757d' }}>admin@dagarmy.com</div>
                            </div>
                        </div>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <main
                style={{
                    flex: 1,
                    marginLeft: sidebarOpen ? '240px' : '70px',
                    transition: 'margin-left 0.3s ease',
                    padding: '32px',
                    minHeight: '100vh'
                }}
            >
                {children}
            </main>
        </div>
    );
}
