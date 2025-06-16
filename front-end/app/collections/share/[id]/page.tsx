"use client";

import { useEffect, useState ,useCallback} from 'react';
import { notFound } from 'next/navigation';
import { fetchCollection, copyCollectionToMyCollections } from '@/lib/api/collections'; // ⭐ copyCollectionToMyCollections 임포트 ⭐
import type { Collection } from '@/types/collection';
import CollectionDetailModal from '@/components/Collection/CollectionDetailModal';
import { useRouter } from 'next/navigation'; // useRouter 임포트

interface CollectionSharePageProps {
    params: {
        id: string;
    };
}

export default function CollectionSharePage({ params }: CollectionSharePageProps) {
    const { id: collectionId } = params;
    const [collection, setCollection] = useState<Collection | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const router = useRouter(); // useRouter 훅 초기화
    // ⭐ 새 상태 추가: 복사 완료 메시지 트리거용 ⭐
    const [collectionIdToShowCopyMessage, setCollectionIdToShowCopyMessage] = useState<string | null>(null);

    useEffect(() => {
        const loadCollection = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedCollection: Collection = await fetchCollection(collectionId);

                if (fetchedCollection && fetchedCollection.isPublic) {
                    setCollection(fetchedCollection);
                    setIsModalOpen(true);
                } else {
                    notFound();
                }
            } catch (err: any) {
                console.error("공유 컬렉션 정보 불러오기 실패:", err);
                setError("컬렉션 정보를 불러오지 못했습니다.");
                notFound();
            } finally {
                setLoading(false);
            }
        };

        if (collectionId) {
            loadCollection();
        }
    }, [collectionId]);

    // 모달 닫기 핸들러
    const handleCloseModal = () => {
        setIsModalOpen(false); // 모달 상태 닫기
        window.history.back(); // 브라우저 뒤로 가기
        // 참고: 이 페이지에서 모달을 닫았을 때 `window.history.back()`은
        // 이전 경로로 이동시킵니다. 만약 무조건 특정 페이지로 이동시키고 싶다면
        // `router.push('/collections');` 와 같은 라우팅 로직을 사용해야 합니다.
    };

    // ⭐ '내 컬렉션으로 복사' 기능을 위한 핸들러 ⭐
    const handleCopyCollection = async (collectionToCopy: Collection) => {
        try {
            await copyCollectionToMyCollections(String(collectionToCopy.collectionId));
            // window.alert(`'${collectionToCopy.name}' 컬렉션이 나의 컬렉션으로 복사되었습니다.`); // alert 대신 메시지 상태 설정
            setCollectionIdToShowCopyMessage(String(collectionToCopy.collectionId)); // 복사 완료 메시지 트리거
            // handleCloseModal(); // 메시지 표시 후 자동으로 모달이 닫히도록 CollectionDetailModal에서 처리
            // router.push('/collections'); // 복사 후 나의 컬렉션 페이지로 이동 (필요하다면)
        } catch (error) {
            console.error("컬렉션 복사 중 오류 발생:", error);
            window.alert('컬렉션 복사에 실패했습니다. 다시 로그인하거나 나중에 시도해주세요.');
        }
    };
    // ⭐ 새 콜백 추가: 복사 메시지 표시 완료 후 호출될 함수 ⭐
        const handleCopyMessageShown = useCallback(() => {
            setCollectionIdToShowCopyMessage(null); // 메시지 표시 완료 후 ID 초기화
            setIsModalOpen(false); // 모달 닫기 (메시지 표시 완료 후)
            // setSelectedCollection(null); // 선택된 컬렉션 초기화
            router.push('/collections'); // 나의 컬렉션 페이지로 이동 (복사 성공 시)
        }, [router]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-gray-600">로딩 중...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    if (!collection) {
        return null;
    }

    return (
        <>
            <CollectionDetailModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                collection={collection}
                onCopyCollection={handleCopyCollection}
            />
        </>
    );
}
