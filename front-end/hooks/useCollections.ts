// lib/hooks/useCollections.ts
import { useState, useEffect, useCallback } from "react";
import type { Collection } from "@/types/collection";
import { fetchCollections } from "@/lib/api/collections";
import { useRouter } from "next/navigation";

interface UseCollectionsResult {
  collections: Collection[];
  loading: boolean;
  error: string | null;
  refetchCollections: () => Promise<void>;
  setCollections: React.Dispatch<React.SetStateAction<Collection[]>>; // ⭐ setCollections 추가 ⭐
}

export const useCollections = (): UseCollectionsResult => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadCollections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedCollections = await fetchCollections();
      setCollections(fetchedCollections);
    } catch (e) {
      if (e instanceof Error && e.message === 'Unauthorized') {
        window.alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
        router.push('/user/login');
      } else {
        console.error("Failed to fetch collections:", e);
        setError("컬렉션 목록을 불러오지 못했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  const refetchCollections = useCallback(async () => {
    await loadCollections();
  }, [loadCollections]);

  // ⭐ setCollections를 반환 객체에 추가 ⭐
  return { collections, loading, error, refetchCollections, setCollections };
};
