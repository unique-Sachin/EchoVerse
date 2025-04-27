const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const algorithm = 'aes-256-cbc';

function encryptAudio(buffer) {
  if (!process.env.ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }

  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32);
  const iv = crypto.randomBytes(16);
  
  try {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    return {
      iv: iv.toString('hex'),
      encryptedData: encrypted.toString('hex')
    };
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt audio data');
  }
}

function decryptAudio(encryptedData, ivHex) {
  if (!process.env.ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }

  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32);
  
  try {
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(ivHex, 'hex'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedData, 'hex')), decipher.final()]);
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt audio data');
  }
}

module.exports = {
  encryptAudio,
  decryptAudio
}; 