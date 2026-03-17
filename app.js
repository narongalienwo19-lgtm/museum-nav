// ==========================================
// Navigation App - Google Maps Mode
// ==========================================

// ---------- ROUTE WAYPOINTS ----------
const ROUTES = {
    ticket_office: {
        id: "ticket_office",
        title_th: "นำทางไปพิพิธภัณฑ์การแพทย์ศิริราช (ขายบัตรเข้าชม)",
        title_en: "Navigate to Siriraj Medical Museum (Ticket Office)",
        title_zh: "前往诗里拉吉医学博物馆（售票处）的导航",
        waypoints: [
            { lat: 13.758162819432808, lng: 100.48579578947489, label: 'จุดเริ่มต้น' },
            { lat: 13.75820645739141, lng: 100.48553762684878, label: 'จุดเลี้ยว 1' },
            { lat: 13.758941137051316, lng: 100.485657655697, label: 'จุดเลี้ยว 2' },
            { lat: 13.758971748653831, lng: 100.48518022250298, label: 'พิพิธภัณฑ์การแพทย์ศิริราช (ขายบัตรเข้าชม)' }
        ]
    },
    museum_entrance: {
        id: "museum_entrance",
        title_th: "นำทางไปพิพิธภัณฑ์ศิริราชพิมุขสถาน (ขายบัตรเข้าชม)",
        title_en: "Navigate to Siriraj Pimuksthan Museum (Ticket Office)",
        title_zh: "前往诗里拉吉披目思探博物馆（售票处）的导航",
        waypoints: [
            // Dummy waypoints for illustration. Replace with actual coordinates later.
            { lat: 13.758162819432808, lng: 100.48579578947489, label: 'จุดเริ่มต้น' },
            { lat: 13.758130253767572, lng: 100.48628730426336, label: 'จุดเลี้ยว 1' },
            { lat: 13.759362534696093, lng: 100.48631144415502, label: 'จุดเลี้ยว 2' },
            { lat: 13.759712938972909, lng: 100.48693237554119, label: 'พิพิธภัณฑ์ศิริราชพิมุขสถาน (ขายบัตรเข้าชม)' }
        ]
    }
};

// Determine current route from URL or fallback
function getCurrentRoute() {
    const params = new URLSearchParams(window.location.search);
    const routeId = params.get('route') || 'ticket_office'; // default
    return ROUTES[routeId] || ROUTES['ticket_office'];
}

// ---------- GOOGLE MAPS NAVIGATION ----------
function openGoogleMaps() {
    const currentRoute = getCurrentRoute();
    const waypointsArr = currentRoute.waypoints;

    // Build Google Maps walking directions URL with waypoints
    const start = waypointsArr[0];
    const dest = waypointsArr[waypointsArr.length - 1];

    // Extract middle waypoints (excluding start and destination)
    const middleWaypoints = waypointsArr.slice(1, -1)
        .map(wp => `${wp.lat},${wp.lng}`)
        .join('|');

    // Construct the Google Maps Directions API URL
    let url = `https://www.google.com/maps/dir/?api=1`;
    url += `&origin=${start.lat},${start.lng}`;
    url += `&destination=${dest.lat},${dest.lng}`;

    if (middleWaypoints) {
        url += `&waypoints=${middleWaypoints}`;
    }

    // Set travel mode to walking and auto-start navigation
    url += `&travelmode=walking&dir_action=navigate`;

    // Open in a new tab (or redirect to native app on mobile)
    window.location.href = url;
}

// Make function globally available
window.openGoogleMaps = openGoogleMaps;

// ---------- TRANSLATIONS ----------
const translations = {
    th: {
        subtitle: "คลิกปุ่มด้านล่างเพื่อเปิดระบบนำทางเท้า",
        feature_1: "ดูเส้นทางและจุดเลี้ยวทั้งหมด",
        feature_2: "นำทางเดินเท้าด้วย Google Maps",
        btn_start: "เริ่มนำทาง (Google Maps)",
        hint: "* ระบบจะเปิดแอป Google Maps และเริ่มนำทางให้อัตโนมัติ",
        lang_btn: "EN"
    },
    en: {
        subtitle: "Click the button below to start walking navigation",
        feature_1: "View entire route and all turns",
        feature_2: "Walk navigation via Google Maps",
        btn_start: "Start Navigation (Google Maps)",
        hint: "* This will automatically open Google Maps and start navigation",
        lang_btn: "ZH" // Next lang is Chinese
    },
    zh: {
        subtitle: "点击下方按钮开始步行导航",
        feature_1: "查看完整路线和所有转弯",
        feature_2: "通过谷歌地图进行步行导航",
        btn_start: "开始导航 (Google Maps)",
        hint: "* 系统将自动打开谷歌地图并开始导航",
        lang_btn: "TH" // Next lang is Thai
    }
};

let currentLang = 'th';

function toggleLanguage() {
    if (currentLang === 'th') currentLang = 'en';
    else if (currentLang === 'en') currentLang = 'zh';
    else currentLang = 'th';

    applyTranslations();

    // Update toggle button text
    const langBtn = document.getElementById('lang-text');
    if (langBtn) {
        langBtn.textContent = translations[currentLang].lang_btn;
    }
}

function applyTranslations() {
    const currentRoute = getCurrentRoute();

    // Apply dynamic title based on the route
    const titleEl = document.querySelector('[data-i18n="title"]');
    if (titleEl) {
        if (currentLang === 'th') titleEl.textContent = currentRoute.title_th;
        else if (currentLang === 'en') titleEl.textContent = currentRoute.title_en;
        else if (currentLang === 'zh') titleEl.textContent = currentRoute.title_zh;
    }

    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        // Filter out title since we handle it dynamically
        if (key !== 'title' && translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });
}

// Make globally available
window.toggleLanguage = toggleLanguage;

// Initial apply
document.addEventListener('DOMContentLoaded', () => {
    applyTranslations();
    // Auto-start navigation
    openGoogleMaps();
});
