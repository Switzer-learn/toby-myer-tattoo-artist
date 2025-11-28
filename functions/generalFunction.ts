import bcrypt from 'bcryptjs';
import crypto from 'crypto';

/**
 * Hash a password using bcrypt
 * @param password - The plain text password to hash
 * @returns Promise<string> - The hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against its hash
 * @param password - The plain text password to verify
 * @param hashedPassword - The hashed password to compare against
 * @returns Promise<boolean> - True if password matches, false otherwise
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Generate a random token
 * @param length - The length of the token (default: 32)
 * @returns string - The generated token
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate a secure random string
 * @param length - The length of the string (default: 16)
 * @returns string - The generated random string
 */
export function generateRandomString(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Validate email format
 * @param email - The email to validate
 * @returns boolean - True if email is valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param password - The password to validate
 * @returns object - Contains isValid boolean and message
 */
export function validatePassword(password: string): { isValid: boolean; message: string } {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  return { isValid: true, message: 'Password is valid' };
}

/**
 * Sanitize input string to prevent XSS
 * @param input - The input string to sanitize
 * @returns string - The sanitized string
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate username format
 * @param username - The username to validate
 * @returns boolean - True if username is valid, false otherwise
 */
export function isValidUsername(username: string): boolean {
  // Username should be 3-20 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * Create a delay (useful for rate limiting)
 * @param ms - The delay in milliseconds
 * @returns Promise<void>
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Format date to ISO string
 * @param date - The date to format (default: current date)
 * @returns string - The formatted date string
 */
export function formatDate(date: Date = new Date()): string {
  return date.toISOString();
}

/**
 * Calculate expiration date
 * @param minutes - The number of minutes until expiration
 * @returns Date - The expiration date
 */
export function getExpirationDate(minutes: number): Date {
  const now = new Date();
  return new Date(now.getTime() + minutes * 60000);
}

/**
 * Check if a date has expired
 * @param date - The date to check
 * @returns boolean - True if date has expired, false otherwise
 */
export function isExpired(date: Date): boolean {
  return new Date() > date;
}

/**
 * Create a standardized error response
 * @param message - The error message
 * @param statusCode - The HTTP status code (default: 500)
 * @returns object - The error response object
 */
export function createErrorResponse(message: string, statusCode: number = 500) {
  return {
    success: false,
    error: message,
    statusCode
  };
}

/**
 * Create a standardized success response
 * @param data - The response data
 * @param message - The success message (optional)
 * @returns object - The success response object
 */
export function createSuccessResponse(data: any = null, message: string = 'Operation successful') {
  return {
    success: true,
    data,
    message
  };
}

/**
 * Check if user is authenticated for content editing (client-side)
 * @returns Promise<boolean> - True if user is authenticated with admin/owner role
 */
export async function isClientAuthenticated(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/check', {
      method: 'GET',
      credentials: 'include'
    });
    
    if (!response.ok) return false;
    
    const data = await response.json();
    return data.authenticated && (data.role === 'admin' || data.role === 'owner');
  } catch (error) {
    console.error('Client authentication check error:', error);
    return false;
  }
}