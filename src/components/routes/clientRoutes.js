// Base URL configuration
//const CLIENT_URL = "http://localhost:3000"; // Single source of truth for base URL
const CLIENT_URL = 'https://coco-ydre.onrender.com/';

// Frontend site URLs (for navigation/linking)
const SITE_URL = {
  // Public routes
  HOME: `${CLIENT_URL}/`,
  MAP: `${CLIENT_URL}/map`,
  ASSISTANCE: `${CLIENT_URL}/assistance`,
  ABOUT: `${CLIENT_URL}/about`,
  TERMS: `${CLIENT_URL}/termsofuse`,
  PRIVACY: `${CLIENT_URL}/privacy`,
  COOKIE_POLICY: `${CLIENT_URL}/cookie`,
  HELP: `${CLIENT_URL}/help`,
  SETTINGS: `${CLIENT_URL}/settings`,
  LOGIN: `${CLIENT_URL}/login`,
  LOCATION: `${CLIENT_URL}/location`,
  AUTH_ERROR: `${CLIENT_URL}/auth/error`,
  REGISTER: `${CLIENT_URL}/register`,
  VERIFY_EMAIL: `${CLIENT_URL}/verifyEmailCode`,

  // Authenticated user routes
  TEST: `${CLIENT_URL}/test`,
  PROFILE: `${CLIENT_URL}/profile`,

  // Admin routes
  ADMIN_DASHBOARD: `${CLIENT_URL}/admin/dashboard`,
  ADMIN_USERS: `${CLIENT_URL}/admin/user`,
  ADMIN_ADD_USER: `${CLIENT_URL}/admin/user/add`,
  ADMIN_EDIT_USER: `${CLIENT_URL}/admin/user/edit`,
  ADMIN_COOPERATIVES: `${CLIENT_URL}/admin/cooperative`,
  ADMIN_ADD_COOPERATIVE: `${CLIENT_URL}/admin/cooperative/add`,
  ADMIN_EDIT_COOPERATIVE: `${CLIENT_URL}/admin/cooperative/edit`,
  ADMIN_PLOTS: `${CLIENT_URL}/admin/plot`,
  ADMIN_ADD_PLOT: `${CLIENT_URL}/admin/plot/add`,
  ADMIN_EDIT_PLOT: `${CLIENT_URL}/admin/plot/edit`,
  ADMIN_SALES: `${CLIENT_URL}/admin/sale`,
  ADMIN_ADD_SALE: `${CLIENT_URL}/admin/sale/add`,
  ADMIN_EDIT_SALE: `${CLIENT_URL}/admin/sale/edit`,
  ADMIN_PURCHASES: `${CLIENT_URL}/admin/purchase`,
  ADMIN_ADD_PURCHASE: `${CLIENT_URL}/admin/purchase/add`,
  ADMIN_EDIT_PURCHASE: `${CLIENT_URL}/admin/purchase/edit`,
  ADMIN_ROLES: `${CLIENT_URL}/admin/role`,
  ADMIN_EXPORTERS: `${CLIENT_URL}/admin/exporter`,
  ADMIN_ADD_EXPORTER: `${CLIENT_URL}/admin/exporter/add`,
  ADMIN_EDIT_EXPORTER: `${CLIENT_URL}/admin/exporter/edit`
};

// Grouped route exports
export const PUBLIC_ROUTES = {
  HOME: SITE_URL.HOME,
  MAP: SITE_URL.MAP,
  LOGIN: SITE_URL.LOGIN,
  REGISTER: SITE_URL.REGISTER
};

export const AUTH_ROUTES = {
  PROFILE: SITE_URL.PROFILE,
  SETTINGS: SITE_URL.SETTINGS
};

export const ADMIN_ROUTES = {
  DASHBOARD: SITE_URL.ADMIN_DASHBOARD,
  USERS: SITE_URL.ADMIN_USERS,
  PLOTS: SITE_URL.ADMIN_PLOTS
};

// Main exports
export { SITE_URL };

// Destructured route exports
export const {
  // Common routes
  HOME,
  MAP,
  LOGIN,
  REGISTER,
  PROFILE,
  
  // Admin routes
  ADMIN_DASHBOARD,
  ADMIN_USERS,
  ADMIN_ADD_USER,
  ADMIN_EDIT_USER,
  ADMIN_COOPERATIVES,
  ADMIN_ADD_COOPERATIVE,
  ADMIN_EDIT_COOPERATIVE,
  ADMIN_PLOTS,
  ADMIN_ADD_PLOT,
  ADMIN_EDIT_PLOT,
  ADMIN_SALES,
  ADMIN_ADD_SALE,
  ADMIN_EDIT_SALE,
  ADMIN_PURCHASES,
  ADMIN_ADD_PURCHASE,
  ADMIN_EDIT_PURCHASE,
  ADMIN_ROLES,
  ADMIN_EXPORTERS,
  ADMIN_ADD_EXPORTER,
  ADMIN_EDIT_EXPORTER
} = SITE_URL;

// Default export
export default CLIENT_URL;