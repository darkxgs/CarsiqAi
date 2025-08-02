// وظيفة بسيطة للتسجيل - يمكن توسيعها لاستخدام خدمات مراقبة مثل Sentry أو Datadog
export enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  DEBUG = "DEBUG",
}

export interface LogEntry {
  level: LogLevel
  message: string
  data?: any
  timestamp: string
}

export class Logger {
  private static instance: Logger
  private logs: LogEntry[] = []
  private isProduction = process.env.NODE_ENV === "production"

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  public info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data)
  }

  public warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data)
  }

  public error(message: string, data?: any): void {
    this.log(LogLevel.ERROR, message, data)
  }

  public debug(message: string, data?: any): void {
    if (!this.isProduction) {
      this.log(LogLevel.DEBUG, message, data)
    }
  }

  private log(level: LogLevel, message: string, data?: any): void {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
    }

    this.logs.push(entry)

    // في بيئة الإنتاج، يمكن إرسال السجلات إلى خدمة مراقبة
    if (this.isProduction) {
      // TODO: إرسال السجلات إلى خدمة مراقبة
      // sendToMonitoringService(entry);
    } else {
      // طباعة السجلات في وحدة التحكم أثناء التطوير
      console.log(`[${entry.level}] ${entry.timestamp}: ${entry.message}`, data ? data : "")
    }
  }

  public getLogs(): LogEntry[] {
    return this.logs
  }
}

export default Logger.getInstance()
