/**
 * 한국 시간(UTC+9) 기준 날짜 계산 유틸리티
 * 모든 날짜 관련 계산은 이 유틸리티를 통해 수행해야 합니다.
 */

/**
 * 한국 시간(UTC+9) 기준으로 현재 시간을 반환
 * @returns 한국 시간 기준 Date 객체
 */
export function getKoreaNow(): Date {
  const now = new Date();
  // 한국 시간대 오프셋 (UTC+9)
  const koreaOffset = 9 * 60; // 분 단위
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + koreaOffset * 60000);
}

/**
 * 한국 시간(UTC+9) 기준으로 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 * @returns YYYY-MM-DD 형식의 날짜 문자열
 */
export function getTodayInKorea(): string {
  const koreaNow = getKoreaNow();
  // getKoreaNow()가 반환한 Date 객체는 한국 시간으로 변환된 것이므로
  // getFullYear(), getMonth(), getDate()를 사용해야 한국 시간 기준 날짜를 얻을 수 있음
  const year = koreaNow.getFullYear();
  const month = String(koreaNow.getMonth() + 1).padStart(2, "0");
  const day = String(koreaNow.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * 한국 시간(UTC+9) 기준으로 날짜를 계산
 * @param dateISO YYYY-MM-DD 형식의 날짜 문자열
 * @param days 더할 일수 (음수면 빼기)
 * @returns YYYY-MM-DD 형식의 날짜 문자열
 */
export function addDaysInKorea(dateISO: string, days: number): string {
  const [year, month, day] = dateISO.split("-").map(Number);
  // 한국 시간 기준으로 Date 객체 생성 (UTC로 저장하되 한국 시간으로 해석)
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  const newYear = date.getUTCFullYear();
  const newMonth = String(date.getUTCMonth() + 1).padStart(2, "0");
  const newDay = String(date.getUTCDate()).padStart(2, "0");
  return `${newYear}-${newMonth}-${newDay}`;
}

/**
 * 한국 시간(UTC+9) 기준으로 Date 객체를 YYYY-MM-DD 형식의 ISO 문자열로 변환
 * @param date Date 객체 (선택적, 없으면 현재 한국 시간)
 * @returns YYYY-MM-DD 형식의 날짜 문자열
 */
export function toKoreaDateISO(date?: Date): string {
  const koreaDate = date ? convertToKoreaTime(date) : getKoreaNow();
  // convertToKoreaTime() 또는 getKoreaNow()가 반환한 Date 객체는 한국 시간으로 변환된 것이므로
  // getFullYear(), getMonth(), getDate()를 사용해야 한국 시간 기준 날짜를 얻을 수 있음
  const year = koreaDate.getFullYear();
  const month = String(koreaDate.getMonth() + 1).padStart(2, "0");
  const day = String(koreaDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * YYYY-MM-DD 형식의 날짜 문자열을 한국 시간 기준 Date 객체로 파싱
 * @param dateISO YYYY-MM-DD 형식의 날짜 문자열
 * @returns 한국 시간 기준 Date 객체
 */
export function parseKoreaDate(dateISO: string): Date {
  const [year, month, day] = dateISO.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

/**
 * Date 객체를 한국 시간 기준으로 변환
 * @param date 변환할 Date 객체
 * @returns 한국 시간 기준 Date 객체
 */
function convertToKoreaTime(date: Date): Date {
  const koreaOffset = 9 * 60; // 분 단위
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  return new Date(utc + koreaOffset * 60000);
}

/**
 * 한국 시간(UTC+9) 기준으로 현재 시간을 ISO 문자열로 반환
 * @returns ISO 형식의 날짜/시간 문자열
 */
export function getKoreaNowISO(): string {
  return getKoreaNow().toISOString();
}

/**
 * 두 날짜가 같은 날인지 확인 (한국 시간 기준)
 * @param date1 첫 번째 날짜 (Date 또는 YYYY-MM-DD 문자열)
 * @param date2 두 번째 날짜 (Date 또는 YYYY-MM-DD 문자열)
 * @returns 같은 날이면 true
 */
export function isSameDayInKorea(
  date1: Date | string,
  date2: Date | string
): boolean {
  const iso1 = typeof date1 === "string" ? date1 : toKoreaDateISO(date1);
  const iso2 = typeof date2 === "string" ? date2 : toKoreaDateISO(date2);
  return iso1 === iso2;
}
