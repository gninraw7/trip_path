/**
 * 지리 계산 유틸리티
 * 설계서 BR-CALC-002: 경로 총 이동 거리 계산 (Haversine 공식)
 * 설계서 BR-CALC-003: 예상 이동 시간 계산
 */

const EARTH_RADIUS_KM = 6371;

/** 도(degree)를 라디안(radian)으로 변환 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Haversine 공식으로 두 좌표 사이의 거리 계산 (km)
 * 설계서 BR-CALC-002
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.asin(Math.sqrt(a));
  return EARTH_RADIUS_KM * c;
}

/**
 * 이동 수단별 예상 소요 시간(분) 계산
 * 설계서 BR-CALC-003
 */
export function estimateTravelTime(
  distanceKm: number,
  mode: 'WALK' | 'BIKE' | 'CAR' | 'TRANSIT',
): number {
  const speedKmH: Record<string, number> = {
    WALK: 4,
    BIKE: 15,
    CAR: 40,
    TRANSIT: 25,
  };

  const speed = speedKmH[mode] ?? 25;
  return (distanceKm / speed) * 60;
}

/**
 * 장소 배열의 총 이동 거리 계산
 * 설계서 BR-CALC-002: 총 이동 거리 = 인접 장소 간 거리 합
 */
export function calculateTotalDistance(
  coords: Array<{ latitude: number; longitude: number }>,
): number {
  let total = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    total += haversineDistance(
      coords[i].latitude,
      coords[i].longitude,
      coords[i + 1].latitude,
      coords[i + 1].longitude,
    );
  }
  return Math.round(total * 1000) / 1000;
}
