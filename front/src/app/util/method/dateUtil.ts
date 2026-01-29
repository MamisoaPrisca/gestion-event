export class DateUtils {
  public static formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    // Si l'heure n'est pas minuit, inclure l'heure
    if (hours !== '00' || minutes !== '00' || seconds !== '00') {
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }

    // Sinon, afficher seulement la date
    return `${day}/${month}/${year}`;
  }

  public static formatDateDDMMYYYY(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    // Sinon, afficher seulement la date
    return `${day}/${month}/${year}`;
  }

  
  public static formatDateYYYYMMJJ(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    // Sinon, afficher seulement la date
    return `${year}-${month}-${day}`;
  }

  public static isDate(value: any): boolean {
    if (value instanceof Date) {
      return !isNaN(value.getTime());
    }
    if (typeof value === 'string') {
      const date = new Date(value);
      return !isNaN(date.getTime());
    }
    return false;
  }


  public static dateNow():Date{
    const dateMadagascar = new Date(
      new Date().toLocaleString("en-EN", { timeZone: "Indian/Antananarivo" })
    );
    return dateMadagascar;
  }

  public static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
