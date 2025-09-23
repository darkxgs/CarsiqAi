/**
 * API Key Rotation Utility
 * Manages automatic rotation of OpenRouter API keys when tokens are exhausted
 */

interface ApiKeyRotationState {
  currentIndex: number;
  lastRotationTime: number;
  failedAttempts: { [key: string]: number };
}

class ApiKeyRotationManager {
  private static instance: ApiKeyRotationManager;
  private state: ApiKeyRotationState;
  private readonly storageKey = 'api_key_rotation_state';
  
  private constructor() {
    this.state = this.loadState();
  }

  public static getInstance(): ApiKeyRotationManager {
    if (!ApiKeyRotationManager.instance) {
      ApiKeyRotationManager.instance = new ApiKeyRotationManager();
    }
    return ApiKeyRotationManager.instance;
  }

  private loadState(): ApiKeyRotationState {
    // Try to load from environment variable first (for server-side)
    const envIndex = process.env.CURRENT_API_KEY_INDEX;
    if (envIndex) {
      const index = parseInt(envIndex);
      if (index >= 1 && index <= 3) {
        return {
          currentIndex: index,
          lastRotationTime: Date.now(),
          failedAttempts: {}
        };
      }
    }

    // Fallback to localStorage for client-side
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (error) {
        console.warn('Failed to load API key rotation state:', error);
      }
    }
    
    return {
      currentIndex: 1,
      lastRotationTime: Date.now(),
      failedAttempts: {}
    };
  }

  private saveState(): void {
    // Save to localStorage if available (client-side)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.state));
      } catch (error) {
        console.warn('Failed to save API key rotation state:', error);
      }
    }
    
    // For server-side, we'll rely on the in-memory state
    // In production, you might want to save to a database or file
  }

  /**
   * Get the current active API key
   */
  public getCurrentApiKey(): string {
    const keys = this.getApiKeys();
    const currentKey = keys[this.state.currentIndex - 1];
    
    if (!currentKey) {
      console.error(`No API key found for index ${this.state.currentIndex}`);
      // Fallback to first key
      this.state.currentIndex = 1;
      this.saveState();
      return keys[0] || '';
    }
    
    return currentKey;
  }

  /**
   * Get all available API keys
   */
  private getApiKeys(): string[] {
    const keys = [
      process.env.OPENROUTER_API_KEY_1 || '',
      process.env.OPENROUTER_API_KEY_2 || '',
      process.env.OPENROUTER_API_KEY_3 || ''
    ].filter(key => key.length > 0);
    
    if (keys.length === 0) {
      console.warn('⚠️ No API keys found in environment variables');
    }
    
    return keys;
  }

  /**
   * Rotate to the next API key
   */
  public rotateToNextKey(): string {
    const keys = this.getApiKeys();
    const totalKeys = keys.length;
    
    if (totalKeys === 0) {
      throw new Error('No API keys available');
    }

    // Move to next key
    this.state.currentIndex = (this.state.currentIndex % totalKeys) + 1;
    this.state.lastRotationTime = Date.now();
    
    console.log(`🔄 Rotated to API key ${this.state.currentIndex}`);
    
    this.saveState();
    return this.getCurrentApiKey();
  }

  /**
   * Handle API error and determine if key rotation is needed
   */
  public handleApiError(error: any): boolean {
    const currentKey = this.getCurrentApiKey();
    const errorMessage = error?.message || error?.toString() || '';
    const statusCode = error?.status || error?.statusCode;

    // Track failed attempts for current key
    if (!this.state.failedAttempts[currentKey]) {
      this.state.failedAttempts[currentKey] = 0;
    }
    this.state.failedAttempts[currentKey]++;

    // Check if this is a token exhaustion or rate limit error
    const isTokenExhausted = this.isTokenExhaustionError(errorMessage, statusCode);
    const isRateLimit = this.isRateLimitError(errorMessage, statusCode);
    const tooManyFailures = this.state.failedAttempts[currentKey] >= 3;

    if (isTokenExhausted || isRateLimit || tooManyFailures) {
      console.log(`🚨 API key rotation triggered:`, {
        isTokenExhausted,
        isRateLimit,
        tooManyFailures,
        failedAttempts: this.state.failedAttempts[currentKey],
        error: errorMessage
      });

      this.rotateToNextKey();
      return true; // Rotation occurred
    }

    this.saveState();
    return false; // No rotation needed
  }

  /**
   * Check if error indicates token exhaustion
   */
  private isTokenExhaustionError(errorMessage: string, statusCode?: number): boolean {
    const exhaustionKeywords = [
      'insufficient credits',
      'credits exhausted',
      'quota exceeded',
      'usage limit',
      'billing',
      'payment required',
      'insufficient funds',
      'credit limit'
    ];

    const messageToCheck = errorMessage.toLowerCase();
    const hasExhaustionKeyword = exhaustionKeywords.some(keyword => 
      messageToCheck.includes(keyword)
    );

    // HTTP 402 Payment Required or 429 Too Many Requests often indicate quota issues
    const isQuotaStatusCode = statusCode === 402 || statusCode === 429;

    return hasExhaustionKeyword || isQuotaStatusCode;
  }

  /**
   * Check if error indicates rate limiting
   */
  private isRateLimitError(errorMessage: string, statusCode?: number): boolean {
    const rateLimitKeywords = [
      'rate limit',
      'too many requests',
      'throttled',
      'requests per',
      'rate exceeded'
    ];

    const messageToCheck = errorMessage.toLowerCase();
    const hasRateLimitKeyword = rateLimitKeywords.some(keyword => 
      messageToCheck.includes(keyword)
    );

    return hasRateLimitKeyword || statusCode === 429;
  }

  /**
   * Reset failed attempts for current key (call on successful request)
   */
  public resetFailedAttempts(): void {
    const currentKey = this.getCurrentApiKey();
    if (this.state.failedAttempts[currentKey]) {
      this.state.failedAttempts[currentKey] = 0;
      this.saveState();
    }
  }

  /**
   * Get rotation statistics
   */
  public getStats(): {
    currentIndex: number;
    totalKeys: number;
    lastRotationTime: number;
    failedAttempts: { [key: string]: number };
  } {
    return {
      currentIndex: this.state.currentIndex,
      totalKeys: this.getApiKeys().length,
      lastRotationTime: this.state.lastRotationTime,
      failedAttempts: { ...this.state.failedAttempts }
    };
  }

  /**
   * Manually set the current API key index
   */
  public setCurrentIndex(index: number): void {
    const totalKeys = this.getApiKeys().length;
    if (index >= 1 && index <= totalKeys) {
      this.state.currentIndex = index;
      this.saveState();
      console.log(`🔧 Manually set API key to index ${index}`);
    } else {
      throw new Error(`Invalid key index ${index}. Must be between 1 and ${totalKeys}`);
    }
  }
}

// Export singleton instance
export const apiKeyRotation = ApiKeyRotationManager.getInstance();

// Export utility functions
export const getCurrentApiKey = () => apiKeyRotation.getCurrentApiKey();
export const handleApiError = (error: any) => apiKeyRotation.handleApiError(error);
export const resetFailedAttempts = () => apiKeyRotation.resetFailedAttempts();
export const rotateToNextKey = () => apiKeyRotation.rotateToNextKey();
export const getRotationStats = () => apiKeyRotation.getStats();