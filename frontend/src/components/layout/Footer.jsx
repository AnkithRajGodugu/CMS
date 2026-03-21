import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/SafeThemeContext';
import { useSector } from '../../hooks/useSector';
import DynamicLogo from '../logos/DynamicLogo';

const Footer = () => {
    const themeContext = useTheme();
    const sectorContext = useSector();

    // ✅ SAFE FALLBACKS
    const currentTheme = themeContext?.currentTheme || {};
    const getAllSectors = themeContext?.getAllSectors || (() => []);
    const getSectorDisplayName = sectorContext?.getSectorDisplayName || ((s) => s);

    // ✅ SAFE COLORS (THIS FIXES YOUR ERROR)
    const colors = currentTheme?.colors || {
        text: '#111',
        surface: '#fff',
        border: '#ccc',
        primary: '#2563eb'
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer
            className="bg-neutral text-neutral-content transition-all duration-300"
            style={{
                backgroundColor: colors.text,
                color: colors.surface
            }}
        >
            <div className="max-w-7xl mx-auto px-4 py-16">

                {/* Company Info */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <DynamicLogo size={32} showUnified={true} />
                        <h3 className="text-xl font-bold">CMS Platform</h3>
                    </div>
                    <p className="text-sm opacity-80">
                        Modern customer management solutions for multiple sectors.
                    </p>
                </div>

                {/* Sectors */}
                <div className="mb-8">
                    <h4 className="text-lg font-semibold mb-3">Sectors</h4>
                    <ul className="space-y-2 text-sm">
                        {getAllSectors().map((sector) => (
                            <li key={sector}>
                                <Link to={`/sectors/${sector}`}>
                                    {getSectorDisplayName(sector)}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Divider */}
                <div
                    className="divider opacity-20 my-8"
                    style={{ borderColor: colors.border }}
                ></div>

                {/* Bottom */}
                <div className="text-center text-sm opacity-60">
                    © {currentYear} CMS Platform. All rights reserved.
                </div>

            </div>
        </footer>
    );
};

export default Footer;