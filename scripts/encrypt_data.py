"""
Utility to encrypt and protect registrations.json using AES-256-GCM envelope encryption.
Authorized users' passwords encrypt a randomly generated master data key using PBKDF2 (100,000 iterations).

Can be run standalone or imported by scripts/generate_app_data.py.
"""

import os
import json
import base64
import hashlib
import sys
from pathlib import Path
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

BASE_DIR = Path(__file__).resolve().parent.parent
CONFIG_PATH = BASE_DIR / "scripts" / "auth_config.json"
REG_PATH = BASE_DIR / "src" / "data" / "registrations.json"
RAW_BACKUP_PATH = BASE_DIR / "src" / "data" / "registrations.raw.json"


def load_auth_config():
    # Support GitHub Secret override if passed via environment
    env_config = os.environ.get("AUTH_USERS_JSON")
    if env_config:
        try:
            return json.loads(env_config)
        except Exception as e:
            print(f"[Warning] Failed to parse AUTH_USERS_JSON env var: {e}")

    if CONFIG_PATH.exists():
        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
            return json.load(f)

    # Fallback default configuration
    return {
        "users": [
            {
                "username": "admin",
                "name": "Project Administrator",
                "password": "MeitY@Admin#2026",
                "role": "admin"
            },
            {
                "username": "idemi_staff",
                "name": "IDEMI MeitY Staff",
                "password": "IDEMI@Staff$2026",
                "role": "staff"
            }
        ]
    }


def encrypt_payload(payload_dict, auth_config=None):
    if auth_config is None:
        auth_config = load_auth_config()

    users = auth_config.get("users", [])
    if not users:
        raise ValueError("auth_config.json has no users defined.")

    # 1. Generate master encryption key (256-bit)
    master_key = os.urandom(32)

    # 2. Encrypt dataset using master key
    json_bytes = json.dumps(payload_dict, ensure_ascii=False).encode("utf-8")
    payload_iv = os.urandom(12)
    payload_cipher = AESGCM(master_key).encrypt(payload_iv, json_bytes, None)

    # 3. Encrypt master key for each authorized user
    user_envelopes = {}
    for u in users:
        uname = u["username"].strip().lower()
        password = u["password"]
        salt = os.urandom(16)
        user_key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100000, 32)
        user_iv = os.urandom(12)
        enc_master_key = AESGCM(user_key).encrypt(user_iv, master_key, None)

        user_envelopes[uname] = {
            "name": u.get("name", uname),
            "role": u.get("role", "staff"),
            "salt": base64.b64encode(salt).decode("ascii"),
            "iv": base64.b64encode(user_iv).decode("ascii"),
            "encrypted_key": base64.b64encode(enc_master_key).decode("ascii"),
        }

    # 4. Construct output envelope
    return {
        "version": "2.0-encrypted",
        "algorithm": "AES-256-GCM-PBKDF2-SHA256",
        "iterations": 100000,
        "encrypted": True,
        "generated_at": payload_dict.get("generated_at", ""),
        "total_records": payload_dict.get("total_records", 0),
        "user_list": [
            {"username": u["username"].strip().lower(), "name": u.get("name", u["username"])}
            for u in users
        ],
        "users": user_envelopes,
        "payload": {
            "iv": base64.b64encode(payload_iv).decode("ascii"),
            "ciphertext": base64.b64encode(payload_cipher).decode("ascii"),
        },
    }


def decrypt_envelope(envelope, username, password):
    uname = username.strip().lower()
    user_meta = envelope.get("users", {}).get(uname)
    if not user_meta:
        raise ValueError(f"User '{username}' is not in authorized users list.")

    salt = base64.b64decode(user_meta["salt"])
    user_iv = base64.b64decode(user_meta["iv"])
    enc_master_key = base64.b64decode(user_meta["encrypted_key"])

    user_key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100000, 32)
    master_key = AESGCM(user_key).decrypt(user_iv, enc_master_key, None)

    payload_iv = base64.b64decode(envelope["payload"]["iv"])
    ciphertext = base64.b64decode(envelope["payload"]["ciphertext"])
    decrypted_bytes = AESGCM(master_key).decrypt(payload_iv, ciphertext, None)

    return json.loads(decrypted_bytes.decode("utf-8"))


def run():
    print("=== MeitY Portal AES-256 Data Encryption Utility ===")
    auth_config = load_auth_config()
    users = auth_config.get("users", [])
    print(f"Loaded {len(users)} authorized user account(s): {[u['username'] for u in users]}")

    # Read existing raw or unencrypted file
    source_path = None
    if RAW_BACKUP_PATH.exists():
        source_path = RAW_BACKUP_PATH
    elif REG_PATH.exists():
        source_path = REG_PATH
    else:
        print(f"Error: Neither {REG_PATH} nor {RAW_BACKUP_PATH} found.")
        sys.exit(1)

    with open(source_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    if data.get("version") == "2.0-encrypted" or data.get("encrypted") is True:
        if source_path == REG_PATH and not RAW_BACKUP_PATH.exists():
            print(f"{REG_PATH} is already encrypted, and no raw backup exists. Nothing to do.")
            return
        elif source_path == RAW_BACKUP_PATH:
            # Check if raw backup is unencrypted
            if data.get("encrypted"):
                print("Raw backup file is already encrypted.")
                return

    # Backup raw data locally
    RAW_BACKUP_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(RAW_BACKUP_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Saved local raw backup to: {RAW_BACKUP_PATH.relative_to(BASE_DIR)}")

    # Encrypt and save to registrations.json
    encrypted_envelope = encrypt_payload(data, auth_config)
    with open(REG_PATH, "w", encoding="utf-8") as f:
        json.dump(encrypted_envelope, f, indent=2, ensure_ascii=False)

    print(f"Successfully encrypted data with AES-256-GCM!")
    print(f"Encrypted file written to: {REG_PATH.relative_to(BASE_DIR)}")
    print(f"  • Total records secured: {encrypted_envelope['total_records']}")
    print(f"  • Authorized users configured: {list(encrypted_envelope['users'].keys())}")


if __name__ == "__main__":
    run()
