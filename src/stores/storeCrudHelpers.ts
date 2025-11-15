// Zustand 스토어에서 공통으로 사용하는 CRUD 헬퍼 함수들

import { getErrorMessage } from "../utils/storeErrorHandler";

/**
 * CRUD 작업 결과 타입
 */
export interface CrudResult {
  success: boolean;
  error?: string;
}

/**
 * 스토어 상태에 error 필드가 있는지 확인하는 타입 가드
 */
interface HasErrorState {
  error: string | null;
}

/**
 * 스토어 상태에 setError 메서드가 있는지 확인하는 타입 가드
 */
interface HasSetError {
  set: (
    partial: Partial<HasErrorState> | ((state: any) => Partial<HasErrorState>)
  ) => void;
}

/**
 * 제네릭 엔티티 타입 (id 필드가 있는 객체)
 */
export interface Entity {
  id: string;
}

/**
 * 배열에 엔티티 추가 (중복 ID 방지)
 */
export function createAddEntity<T extends Entity>(
  entityName: string,
  getEntities: () => T[],
  setEntities: (entities: T[]) => void,
  setError: (error: string | null) => void
): (entity: T) => boolean {
  return (entity: T): boolean => {
    try {
      const entities = getEntities();
      if (entities.find((e) => e.id === entity.id)) {
        setError(`이미 존재하는 ${entityName}입니다.`);
        return false;
      }
      setEntities([...entities, entity]);
      setError(null);
      return true;
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(
        error,
        `${entityName} 추가 중 오류가 발생했습니다.`
      );
      setError(errorMessage);
      return false;
    }
  };
}

/**
 * 엔티티 업데이트
 */
export function createUpdateEntity<T extends Entity>(
  entityName: string,
  getEntities: () => T[],
  setEntities: (entities: T[]) => void,
  setError: (error: string | null) => void
): (id: string, updatedEntity: Partial<T>) => boolean {
  return (id: string, updatedEntity: Partial<T>): boolean => {
    try {
      const entities = getEntities();
      const entity = entities.find((e) => e.id === id);
      if (!entity) {
        setError(`${entityName}을(를) 찾을 수 없습니다.`);
        return false;
      }
      setEntities(
        entities.map((e) => (e.id === id ? { ...e, ...updatedEntity } : e))
      );
      setError(null);
      return true;
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(
        error,
        `${entityName} 수정 중 오류가 발생했습니다.`
      );
      setError(errorMessage);
      return false;
    }
  };
}

/**
 * 엔티티 삭제
 */
export function createRemoveEntity<T extends Entity>(
  entityName: string,
  getEntities: () => T[],
  setEntities: (entities: T[]) => void,
  setError: (error: string | null) => void
): (id: string) => boolean {
  return (id: string): boolean => {
    try {
      const entities = getEntities();
      const entity = entities.find((e) => e.id === id);
      if (!entity) {
        setError(`${entityName}을(를) 찾을 수 없습니다.`);
        return false;
      }
      setEntities(entities.filter((e) => e.id !== id));
      setError(null);
      return true;
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(
        error,
        `${entityName} 삭제 중 오류가 발생했습니다.`
      );
      setError(errorMessage);
      return false;
    }
  };
}

/**
 * ID로 엔티티 조회
 */
export function createGetEntityById<T extends Entity>(
  getEntities: () => T[]
): (id: string) => T | undefined {
  return (id: string): T | undefined => {
    return getEntities().find((entity) => entity.id === id);
  };
}
