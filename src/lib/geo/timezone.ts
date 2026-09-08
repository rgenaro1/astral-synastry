import tzlookup from 'tz-lookup';
import { DateTime } from 'luxon';
import { BirthProfileInput, BirthProfileResolved } from '../types/astrology';

/**
 * Determina el identificador de zona horaria IANA para unas coordenadas geográficas.
 */
export function lookupTimezone(latitude: number, longitude: number): string {
  try {
    return tzlookup(latitude, longitude);
  } catch (error) {
    console.warn(`No se pudo resolver la zona horaria para (${latitude}, ${longitude}), usando UTC:`, error);
    return 'UTC';
  }
}

/**
 * Convierte una fecha y hora histórica local en su instante UTC exacto,
 * resolviendo el desfase histórico de horario de verano (DST) o decretos de la base de datos Olson.
 */
export function resolveHistoricDateTime(input: BirthProfileInput): BirthProfileResolved {
  const timezone = input.timezoneIana || lookupTimezone(input.latitude, input.longitude);

  const [yearStr, monthStr, dayStr] = input.birthDate.split('-');
  const [hourStr, minuteStr] = input.birthTime.split(':');

  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);
  const hour = parseInt(hourStr || '12', 10);
  const minute = parseInt(minuteStr || '0', 10);

  // Instanciar DateTime en la zona horaria IANA histórica
  const localDt = DateTime.fromObject(
    {
      year,
      month,
      day,
      hour,
      minute,
      second: 0,
      millisecond: 0,
    },
    { zone: timezone }
  );

  if (!localDt.isValid) {
    throw new Error(`Fecha u hora de nacimiento inválida: ${localDt.invalidReason} - ${localDt.invalidExplanation}`);
  }

  const utcDt = localDt.toUTC();
  const utcOffsetMinutes = localDt.offset; // ej. -300 para GMT-5, -240 para GMT-4

  // Calcular Julian Day astronómico exacto
  // JD = (epoch ms / 86400000) + 2440587.5
  const julianDay = utcDt.toMillis() / 86400000 + 2440587.5;

  return {
    ...input,
    timezoneIana: timezone,
    birthUtc: utcDt.toISO() || utcDt.toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"),
    utcOffsetMinutes,
    julianDay,
  };
}

/**
 * Formatea el offset horario para visualización amigable (ej: "GMT-5:00" o "GMT+2:00")
 */
export function formatUtcOffset(offsetMinutes: number): string {
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const absMinutes = Math.abs(offsetMinutes);
  const hours = Math.floor(absMinutes / 60);
  const minutes = absMinutes % 60;
  return `GMT${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
