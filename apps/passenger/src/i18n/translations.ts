export type Language = 'en' | 'bs';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Splash
    splash_tagline: 'Your reliable ride',

    // Onboarding
    onboard_1_title: 'Choose a\nRoute',
    onboard_1_sub: 'Pick the jeepney route\nyou want to ride.',
    onboard_2_title: 'Real-Time\nTracking',
    onboard_2_sub: 'Track the jeepney\non the map live.',
    onboard_3_title: 'Safe &\nAffordable',
    onboard_3_sub: 'A safe and affordable\nride for everyone.',
    onboard_skip: 'Skip',
    onboard_next: 'Next',
    onboard_start: 'Get Started',
    onboard_login_prompt: 'Already have an account?',
    onboard_login_link: 'Log in',

    // Login
    login_title: 'Log In',
    login_subtitle: 'Enter your phone number to continue.',
    login_button: 'Continue',
    login_or: 'or',
    login_guest: 'Continue as Guest',
    login_footer: 'By logging in, you agree to our Terms of Service',

    // Home
    home_greeting: 'Good day!',
    home_user: 'Passenger',
    home_profile_name: 'SakayNa User',
    home_profile_sub: 'Passenger',
    home_settings: 'Settings',
    home_logout: 'Logout',
    home_search: 'Search route or stop...',
    home_routes_title: 'Jeepney Routes',
    home_routes_count: '{count} routes',
    home_swipe_hint: 'Swipe up for routes',
    home_routes_label: 'Jeepney Routes',
    home_map_type: 'Map Type',
    home_nearby: 'Nearby',
    home_stops_count: '{count} stops',
    home_no_results: 'No routes found',

    // Booking
    booking_frequency: 'Frequency',
    booking_stops_count: 'Stops',
    booking_status: 'Status',
    booking_active: 'Active',
    booking_stops_title: 'Route Stops',
    booking_start: 'Start of Route',
    booking_end: 'End of Route',
    booking_stop_label: 'Stop',
    booking_track_title: 'Track Jeepney',
    booking_track_sub: 'Real-time tracking on map',

    // Tracking
    tracking_live: 'Live Tracking',
    tracking_route: 'Route',
    tracking_info_stops: 'Stops',
    tracking_info_freq: 'Frequency',
    tracking_info_status: 'Status',
    tracking_active: 'Active',
    tracking_jeepney: 'Jeepney',
    tracking_active_label: 'Actively travelling',
    tracking_stops_title: 'Stops on Route',
    tracking_stop_btn: 'Stop Tracking',
    tracking_near: 'Near:',

    // Settings
    settings_title: 'Settings',
    settings_map_nav: 'MAP & NAVIGATION',
    settings_auto_center: 'Auto-Center on Location',
    settings_auto_center_desc:
      'Automatically center the map on your current location when the app starts',
    settings_show_routes: 'Show All Routes on Map',
    settings_show_routes_desc:
      'Display all jeepney routes on the home map. Turn off to reduce clutter',
    settings_dark_map: 'Dark Map Theme',
    settings_dark_map_desc: 'Use a darker map style for better visibility at night',
    settings_tracking: 'TRACKING',
    settings_live_tracking: 'Live Jeepney Tracking',
    settings_live_tracking_desc: 'Enable real-time jeepney position updates when tracking a route',
    settings_notifications: 'Notifications',
    settings_notifications_desc: 'Get notified when a jeepney is approaching your stop',
    settings_language: 'LANGUAGE',
    settings_lang_toggle: 'Bisaya',
    settings_lang_desc: 'Use Bisaya for labels and instructions',
    settings_suggestions: 'SUGGESTIONS',
    settings_suggest_route: 'Suggest a New Route',
    settings_suggest_route_desc: 'Help us add more jeepney routes to the app',
    settings_suggest_route_title: 'Suggest a Route',
    settings_suggest_route_msg:
      'Know a jeepney route that is not listed? Send us the route name, stops, and any details so we can add it to SakayNa!',
    settings_report: 'Report Route Issue',
    settings_report_desc: 'Report wrong stops, outdated info, or incorrect route paths',
    settings_report_title: 'Report Route Issue',
    settings_report_msg:
      'If a route has incorrect stops, outdated information, or wrong coordinates, please let us know so we can fix it.',
    settings_feature: 'Request a Feature',
    settings_feature_desc: 'Suggest new features like fare calculator, trip planner, or favorites',
    settings_feature_title: 'Feature Request',
    settings_feature_msg:
      "Have an idea to improve SakayNa? We'd love to hear it! Suggestions like fare calculator, trip planner, or favorite routes are welcome.",
    settings_rate: 'Rate SakayNa',
    settings_rate_desc: 'Love the app? Give us a rating to help other commuters find us',
    settings_rate_title: 'Rate SakayNa',
    settings_rate_msg:
      'If you find SakayNa helpful, please rate us on the app store! Your feedback helps us improve.',
    settings_about: 'ABOUT',
    settings_about_sakayna: 'About SakayNa',
    settings_about_msg:
      'SakayNa is a jeepney transit tracker for Davao City. It helps commuters find routes, track jeepneys, and navigate the city.\n\nRoute data sourced from commutedavao.com\n\nVersion 1.0.0',
    settings_data_source: 'Data Source',
    settings_data_source_msg:
      'Jeepney route data is sourced from commutedavao.com, an open-source project by Tatskiee that maps Davao City jeepney routes using OSRM and Leaflet.\n\nGitHub: github.com/Tatskiee/Commutedavao',
    settings_ok: 'OK',
  },
  bs: {
    // Splash
    splash_tagline: 'Ang imong kasaligan nga sakay',

    // Onboarding
    onboard_1_title: 'Pili og\nRuta',
    onboard_1_sub: 'Pili sa ruta sa jeepney\nga gusto nimong sakyan.',
    onboard_2_title: 'Real-Time\nTracking',
    onboard_2_sub: 'Sunda ang jeepney\nsa mapa nang live.',
    onboard_3_title: 'Luwas ug\nBarato',
    onboard_3_sub: 'Luwas ug barato nga\nsakay para sa tanan.',
    onboard_skip: 'Laktaw',
    onboard_next: 'Sunod',
    onboard_start: 'Magsugod',
    onboard_login_prompt: 'Naa na kay account?',
    onboard_login_link: 'Mag-login',

    // Login
    login_title: 'Mag-login',
    login_subtitle: 'Ibutang ang imong numero sa telepono para makasulod.',
    login_button: 'Padayon',
    login_or: 'o',
    login_guest: 'Padayon isip Bisita',
    login_footer: 'Sa pag-login, miuyon ka sa among Terms of Service',

    // Home
    home_greeting: 'Maayong adlaw!',
    home_user: 'Pasahero',
    home_profile_name: 'SakayNa User',
    home_profile_sub: 'Pasahero',
    home_settings: 'Settings',
    home_logout: 'Logout',
    home_search: 'Pangita og ruta o hintayan...',
    home_routes_title: 'Mga Ruta sa Jeepney',
    home_routes_count: '{count} ruta',
    home_swipe_hint: 'I-swipe pataas para sa mga ruta',
    home_routes_label: 'Mga Ruta sa Jeepney',
    home_map_type: 'Klase sa Mapa',
    home_nearby: 'Duol',
    home_stops_count: '{count} hintayan',
    home_no_results: 'Walay nakita nga ruta',

    // Booking
    booking_frequency: 'Dalas',
    booking_stops_count: 'Mga Hintayan',
    booking_status: 'Status',
    booking_active: 'Aktibo',
    booking_stops_title: 'Mga Hintayan sa Ruta',
    booking_start: 'Sugod sa Ruta',
    booking_end: 'Katapusan sa Ruta',
    booking_stop_label: 'Hintayan',
    booking_track_title: 'Sunda ang Jeepney',
    booking_track_sub: 'Real-time tracking sa mapa',

    // Tracking
    tracking_live: 'Live Tracking',
    tracking_route: 'Ruta',
    tracking_info_stops: 'Mga Hintayan',
    tracking_info_freq: 'Dalas',
    tracking_info_status: 'Status',
    tracking_active: 'Aktibo',
    tracking_jeepney: 'Jeepney',
    tracking_active_label: 'Aktibong nagbiyahe',
    tracking_stops_title: 'Mga Hintayan sa Ruta',
    tracking_stop_btn: 'Iundang ang Tracking',
    tracking_near: 'Duol sa:',

    // Settings
    settings_title: 'Settings',
    settings_map_nav: 'MAPA UG NABIGASYON',
    settings_auto_center: 'Auto-Center sa Lokasyon',
    settings_auto_center_desc:
      'Awtomatik i-center ang mapa sa imong lokasyon kung mag-open ang app',
    settings_show_routes: 'Ipakita ang Tanan nga Ruta sa Mapa',
    settings_show_routes_desc:
      'Ipakita ang tanan nga ruta sa jeepney sa mapa. I-off para mamenosan ang clutter',
    settings_dark_map: 'Dark Map Theme',
    settings_dark_map_desc: 'Gamiton ang mas dark nga mapa para mas makita sa gabii',
    settings_tracking: 'TRACKING',
    settings_live_tracking: 'Live Jeepney Tracking',
    settings_live_tracking_desc:
      'I-enable ang real-time nga update sa posisyon sa jeepney kung nag-track og ruta',
    settings_notifications: 'Notifications',
    settings_notifications_desc: 'Pahibalo-a kung ang jeepney nagpaduol na sa imong hintayan',
    settings_language: 'PINULONGAN',
    settings_lang_toggle: 'Bisaya',
    settings_lang_desc: 'Gamiton ang Bisaya para sa mga label ug instruksyon',
    settings_suggestions: 'MGA SUGYOT',
    settings_suggest_route: 'Mag-suggest og Bag-ong Ruta',
    settings_suggest_route_desc: 'Tabangi mi nga magdugang og mga ruta sa jeepney sa app',
    settings_suggest_route_title: 'Mag-suggest og Ruta',
    settings_suggest_route_msg:
      'Nahibalo ka ba og ruta sa jeepney nga wala sa lista? Ipadala namo ang ngalan sa ruta, hintayan, ug mga detalye para madungagan sa SakayNa!',
    settings_report: 'I-report ang Problema sa Ruta',
    settings_report_desc: 'I-report ang sayop nga hintayan, outdated info, o dili husto nga ruta',
    settings_report_title: 'I-report ang Problema sa Ruta',
    settings_report_msg:
      'Kung ang usa ka ruta naa say sayop nga hintayan, outdated info, o sayop nga coordinates, palihug pahibalo-a mi aron ma-ayos namo.',
    settings_feature: 'Mag-request og Feature',
    settings_feature_desc:
      'Mag-suggest og bag-ong features sama sa fare calculator, trip planner, o favorites',
    settings_feature_title: 'Feature Request',
    settings_feature_msg:
      'Naa ka bay ideya para ma-improve ang SakayNa? Ganahan mi makadungog! Mga suggestion sama sa fare calculator, trip planner, o favorite routes kay welcome.',
    settings_rate: 'I-rate ang SakayNa',
    settings_rate_desc: 'Ganahan sa app? Hatagi mi og rating para makita sa uban nga commuters',
    settings_rate_title: 'I-rate ang SakayNa',
    settings_rate_msg:
      'Kung nakatabang ang SakayNa nimo, palihug i-rate mi sa app store! Ang imong feedback makatabang para ma-improve namo.',
    settings_about: 'BAHIN',
    settings_about_sakayna: 'Bahin sa SakayNa',
    settings_about_msg:
      'Ang SakayNa usa ka jeepney transit tracker para sa Davao City. Makatabang kini sa mga commuter sa pagpangita og ruta, pag-track sa jeepney, ug pag-navigate sa siyudad.\n\nRoute data gikan sa commutedavao.com\n\nVersion 1.0.0',
    settings_data_source: 'Data Source',
    settings_data_source_msg:
      'Ang route data sa jeepney gikan sa commutedavao.com, usa ka open-source project ni Tatskiee nga nagmapa sa mga ruta sa jeepney sa Davao City gamit ang OSRM ug Leaflet.\n\nGitHub: github.com/Tatskiee/Commutedavao',
    settings_ok: 'OK',
  },
};
