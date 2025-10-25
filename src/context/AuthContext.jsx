import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import api from '../api/axios';
import { setCookie as setCookieUtil, getCookie as getCookieUtil, removeCookie as removeCookieUtil } from '../api/cookies';
import adminApi from '../api/admin';

// ---------- Auth Context ----------
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    try {
      const raw = getCookieUtil('Admin') || 'null';
      try { console.debug('[auth] cookie Admin raw:', raw); } catch {};
      const parsed = JSON.parse(raw);
      try { console.debug('[auth] cookie Admin parsed:', parsed); } catch {};
      return parsed;
    } catch (e) {
      return null;
    }
  });

  const [notifications, setNotifications] = useState(0);
  const [notificationsList, setNotificationsList] = useState([]);

  // Persist Admin in cookies
  useEffect(() => {
    try {
      if (admin) {
        setCookieUtil('Admin', JSON.stringify(admin));
      } else {
        removeCookieUtil('Admin');
      }
    } catch {}
  }, [admin]);

  // (hydration handled synchronously in useState initialiser)

  // Fetch notifications once on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // If admin is not set yet, try to read from cookie
        const currentAdmin = admin || JSON.parse(getCookieUtil('Admin') || 'null');
        const adminId = currentAdmin?.userId || currentAdmin?._id || currentAdmin?.id || null;

        if (!adminId) {
          // keep mocks if we can't identify admin yet
          setNotifications(0);
          setNotificationsList([]);
          return;
        }

        // Call the real admin API helpers. They log responses; we still normalize.
        const countRes = await adminApi.getNotificationCount(adminId);
        console.log('[auth] getNotificationCount raw', countRes);
        // handle various shapes: number, { count }, { data: { count } }
        let count = 0;
        if (typeof countRes === 'number') count = countRes;
        else if (countRes?.count != null) count = countRes.count;
        else if (countRes?.data?.count != null) count = countRes.data.count;
        else if (countRes?.data != null && typeof countRes.data === 'number') count = countRes.data;
        setNotifications(Number(count) || 0);

        const listRes = await adminApi.getNotificationsList(adminId);
        console.log('[auth] getNotificationsList raw', listRes);
        // normalize list: either array, or res.data, or res.data.data
        let list = [];
        if (Array.isArray(listRes)) list = listRes;
        else if (Array.isArray(listRes?.data)) list = listRes.data;
        else if (Array.isArray(listRes?.data?.data)) list = listRes.data.data;
        // finally map into the shape used by Navbar
        const mapped = list.map((it) => ({ label: it.label || it.title || it.type || 'Notification', count: it.count || it.num || 1, to: it.to || '/reports' }));
        setNotificationsList(mapped);
      } catch (e) {
        console.error('[auth] fetch notifications error', e);
        setNotifications(0);
        setNotificationsList([]);
      }
    };
    fetchData();
  }, []);

  // -------------------- Auth Actions --------------------

  const login = async ({ email, password }) => {
    try {
      const {data} = await api.post('/admin/login', { email, password });
      let token = data?.token;
      if (!token) {
        token = getCookieUtil('token') || null;
      }
      const adminObj = data?.admin || data?.user || { email };
      if (token) setCookieUtil('token', token);
      console.log(data.admin)
      setAdmin(adminObj);
      return { ok: true };
    } catch (err) {
      console.error('[auth] login error', err);
      const message = err?.message || err?.error || err?.detail || (typeof err === 'string' ? err : JSON.stringify(err));
      return { ok: false, error: message || 'Login failed' };
    }
  };

  const logout = () => {
    // explicit logout: remove token and Admin cookie and clear state
    removeCookieUtil('token');
    removeCookieUtil('Admin');
    setAdmin(null);
  };

  // -------------------- Notification Mocks --------------------

  // keep the exported functions (used elsewhere) but route them to the real admin API when possible
  const fetchNotificationCount = async () => {
    try {
      const currentAdmin = admin || JSON.parse(getCookieUtil('Admin') || 'null');
      const adminId = currentAdmin?.userId || currentAdmin?._id || currentAdmin?.id || null;
      if (!adminId) return 0;
      const res = await adminApi.getNotificationCount(adminId);
      if (typeof res === 'number') return res;
      if (res?.count != null) return res.count;
      if (res?.data?.count != null) return res.data.count;
      if (res?.data != null && typeof res.data === 'number') return res.data;
      return 0;
    } catch (e) {
      console.error('[auth] fetchNotificationCount error', e);
      return 0;
    }
  };

  const fetchNotificationsList = async () => {
    try {
      const currentAdmin = admin || JSON.parse(getCookieUtil('Admin') || 'null');
      const adminId = currentAdmin?.userId || currentAdmin?._id || currentAdmin?.id || null;
      if (!adminId) return [];
      const res = await adminApi.getNotificationsList(adminId);
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.data)) return res.data;
      if (Array.isArray(res?.data?.data)) return res.data.data;
      return [];
    } catch (e) {
      console.error('[auth] fetchNotificationsList error', e);
      return [];
    }
  };

  // Permission checking utility
  const hasPermission = (permission) => {
    if (!admin) return false;
    // Super admin has all permissions
    if (admin.role === 'super_admin') return true;
    // Check if admin has the specific permission
    return admin.permissions && admin.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions) => {
    if (!admin) return false;
    // Super admin has all permissions
    if (admin.role === 'super_admin') return true;
    // Check if admin has any of the permissions
    return permissions.some(permission => admin.permissions && admin.permissions.includes(permission));
  };

  const value = useMemo(
    () => ({
      admin,
      userEmail: admin?.email ?? '',
      notifications,
      notificationsList,
      login,
      logout,
      fetchNotificationCount,
      hasPermission,
      hasAnyPermission,
    }),
    [admin, notifications, notificationsList]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
