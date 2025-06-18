import Aes from 'react-native-aes-crypto';

class WalletCrypto {
	// Generate random bytes using React Native's crypto
	private static getRandomBytes(length: number): Uint8Array {
		const array = new Uint8Array(length);
		// react-native-get-random-values polyfills crypto.getRandomValues
		crypto.getRandomValues(array);
		return array;
	}

	// Convert Uint8Array to hex string
	private static uint8ArrayToHex(array: Uint8Array): string {
		return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
	}

	// Convert hex string to Uint8Array
	static hexToUint8Array(hex: string): Uint8Array {
		// Remove any whitespace and ensure even length
		const cleanHex = hex.replace(/\s/g, '');
		if (cleanHex.length % 2 !== 0) {
			throw new Error('Invalid hex string length');
		}

		const bytes = new Uint8Array(cleanHex.length / 2);
		for (let i = 0; i < cleanHex.length; i += 2) {
			bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
		}
		return bytes;
	}

	// Derive key from passcode using PBKDF2
	private static async deriveKey(passcode: string, salt: Uint8Array): Promise<string> {
		// Validate inputs
		if (!passcode || typeof passcode !== 'string') {
			throw new Error('Invalid passcode: must be a non-empty string');
		}

		const saltHex = this.uint8ArrayToHex(salt);
		if (!saltHex) {
			throw new Error('Invalid salt: conversion to hex failed');
		}

		// Use PBKDF2 to derive a 256-bit key (32 bytes = 64 hex characters)
		const key = await Aes.pbkdf2(passcode, saltHex, 100000, 256, 'sha256');
		return key;
	}

	// Encrypt private key with passcode
	static async encryptPrivateKey(privateKey: string, passcode: string): Promise<{ encryptedData: string; salt: string; iv: string }> {
		try {
			// Validate inputs
			if (!privateKey || typeof privateKey !== 'string') {
				throw new Error('Invalid privateKey: must be a non-empty string');
			}
			if (!passcode || typeof passcode !== 'string') {
				throw new Error('Invalid passcode: must be a non-empty string');
			}

			const salt = this.getRandomBytes(16);
			const iv = this.getRandomBytes(16); // AES typically uses 16-byte IV
			const key = await this.deriveKey(passcode, salt);

			const ivHex = this.uint8ArrayToHex(iv);

			// Encrypt using AES-256-CBC
			const encryptedData = await Aes.encrypt(privateKey, key, ivHex, 'aes-256-cbc');

			return {
				encryptedData,
				salt: this.uint8ArrayToHex(salt),
				iv: ivHex
			};
		} catch (error) {
			throw new Error(`Encryption failed: ${error}`);
		}
	}

	// Decrypt private key with passcode
	static async decryptPrivateKey(encryptedData: string, salt: string, iv: string, passcode: string): Promise<string> {
		try {
			if (!encryptedData || typeof encryptedData !== 'string') {
				throw new Error('Invalid encryptedData: must be a non-empty string');
			}
			if (!salt || typeof salt !== 'string') {
				throw new Error('Invalid salt: must be a non-empty string');
			}
			if (!iv || typeof iv !== 'string') {
				throw new Error('Invalid iv: must be a non-empty string');
			}
			if (!passcode || typeof passcode !== 'string') {
				throw new Error('Invalid passcode: must be a non-empty string');
			}

			const saltBytes = this.hexToUint8Array(salt);

			const key = await this.deriveKey(passcode, saltBytes);

			return await Aes.decrypt(encryptedData, key, iv, 'aes-256-cbc');
		} catch (error) {
			console.error('Decryption error details:', error);
			throw new Error(`Decryption failed: ${error}`);
		}
	}
}
export default WalletCrypto;
