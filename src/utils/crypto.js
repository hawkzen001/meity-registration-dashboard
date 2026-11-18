/**
 * Web Crypto API client-side decryption utilities for IDEMI MeitY Dashboard.
 * Uses hardware-accelerated native window.crypto.subtle (AES-256-GCM + PBKDF2).
 * Zero external npm dependencies.
 */

const SESSION_STORAGE_KEY = 'meity_portal_session_v2';
const LOCAL_STORAGE_KEY = 'meity_portal_persistent_session_v2';

export function isEncrypted(data) {
  return Boolean(data && (data.version === '2.0-encrypted' || data.encrypted === true));
}

export function base64ToUint8(base64) {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function uint8ToBase64(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

/**
 * Decrypts envelope using username and password.
 * 1. Derives PBKDF2-SHA256 key from password + salt
 * 2. Decrypts the master key using AES-GCM
 * 3. Decrypts the main payload using the master key
 */
export async function decryptWithPassword(envelope, username, password) {
  if (!envelope || !isEncrypted(envelope)) {
    throw new Error('Data is not in an encrypted envelope format.');
  }

  const uname = (username || '').trim().toLowerCase();
  const userMeta = envelope.users?.[uname];

  if (!userMeta) {
    throw new Error(`Username '${username}' is not an authorized account.`);
  }

  const enc = new TextEncoder();
  const dec = new TextDecoder();

  // 1. Derive user key from password
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const userKey = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: base64ToUint8(userMeta.salt),
      iterations: envelope.iterations || 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  // 2. Decrypt master key
  let masterKeyBytes;
  try {
    masterKeyBytes = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: base64ToUint8(userMeta.iv),
      },
      userKey,
      base64ToUint8(userMeta.encrypted_key)
    );
  } catch {
    throw new Error('Invalid password. Please check your credentials and try again.');
  }

  // 3. Decrypt payload with master key
  const masterKey = await window.crypto.subtle.importKey(
    'raw',
    masterKeyBytes,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  let decryptedBytes;
  try {
    decryptedBytes = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: base64ToUint8(envelope.payload.iv),
      },
      masterKey,
      base64ToUint8(envelope.payload.ciphertext)
    );
  } catch {
    throw new Error('Decryption failed: payload checksum/tag mismatch.');
  }

  const jsonStr = dec.decode(decryptedBytes);
  const data = JSON.parse(jsonStr);

  const masterKeyRaw = uint8ToBase64(new Uint8Array(masterKeyBytes));
  const user = {
    username: uname,
    name: userMeta.name || uname,
    role: userMeta.role || 'staff',
  };

  return { data, user, masterKeyRaw };
}

/**
 * Decrypts envelope using a cached master key (for session restoration).
 */
export async function decryptWithMasterKey(envelope, masterKeyRaw) {
  if (!envelope || !isEncrypted(envelope)) {
    return envelope;
  }

  const dec = new TextDecoder();
  const masterKeyBytes = base64ToUint8(masterKeyRaw);

  const masterKey = await window.crypto.subtle.importKey(
    'raw',
    masterKeyBytes,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  const decryptedBytes = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: base64ToUint8(envelope.payload.iv),
    },
    masterKey,
    base64ToUint8(envelope.payload.ciphertext)
  );

  return JSON.parse(dec.decode(decryptedBytes));
}

/**
 * Persists an authenticated session.
 */
export function saveSession(user, masterKeyRaw, rememberMe = false) {
  const session = {
    user,
    masterKeyRaw,
    timestamp: Date.now(),
  };

  const str = JSON.stringify(session);
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, str);
    if (rememberMe) {
      localStorage.setItem(LOCAL_STORAGE_KEY, str);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  } catch (err) {
    console.warn('Could not save session to Web Storage', err);
  }
}

/**
 * Loads any active session from sessionStorage or localStorage.
 */
export function loadSession() {
  try {
    const sessionStr =
      sessionStorage.getItem(SESSION_STORAGE_KEY) ||
      localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!sessionStr) return null;

    const parsed = JSON.parse(sessionStr);
    // Expire localStorage session after 7 days if desired
    if (parsed && parsed.timestamp && Date.now() - parsed.timestamp > 7 * 24 * 60 * 60 * 1000) {
      clearSession();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Clears active session from all storage.
 */
export function clearSession() {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch (err) {
    console.warn('Could not clear session storage', err);
  }
}
