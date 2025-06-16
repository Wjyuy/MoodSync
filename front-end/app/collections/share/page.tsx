"use client";

import { useState, useEffect, useCallback } from "react";
import type { Collection } from "@/types/collection";
import { fetchPublicCollections, copyCollectionToMyCollections } from "@/lib/api/collections";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';

import {
    containerVariants,
    cardVariants,
    // overlayVariants, // 사용하지 않는 임포트 제거
    // modalContentVariants // 사용하지 않는 임포트 제거
} from "@/lib/animations/framerVariants";

import CollectionCard from "@/components/Collection/CollectionCard";
// import CollectionFormModal from "@/components/Collection/CollectionFormModal"; // 현재 사용되지 않으므로 주석 처리
import CollectionDetailModal from "@/components/Collection/CollectionDetailModal";

export default function CollectionPage() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // 이 상태는 현재 사용되지 않는 것으로 보입니다.

    const router = useRouter();
    const searchParams = useSearchParams();

    const [showFormModal, setShowFormModal] = useState(false); // 현재 사용되지 않으므로 유지 또는 제거 고려
    const [editingCollection, setEditingCollection] = useState<Collection | null>(null); // 현재 사용되지 않으므로 유지 또는 제거 고려

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

    // 수정/정렬 메시지를 보여줄 컬렉션 ID 상태
    const [collectionIdToShowEditMessage, setCollectionIdToShowEditMessage] = useState<string | null>(null);
    const [collectionIdToShowReorderMessage, setCollectionIdToShowReorderMessage] = useState<string | null>(null);
    // ⭐ 새 상태 추가: 복사 완료 메시지 트리거용 ⭐
    const [collectionIdToShowCopyMessage, setCollectionIdToShowCopyMessage] = useState<string | null>(null);


    // CollectionDetailModal을 닫는 전용 핸들러
    const handleCloseModal = () => { // 이 함수 이름은 이제 `handleCloseDetailModal`과 겹치지 않도록 주의합니다.
        setIsModalOpen(false); // 이 `isModalOpen` 상태는 현재 코드에서 사용되지 않는 것으로 보입니다.
        setSelectedCollection(null);
        // 이 페이지 (공개 컬렉션)에서 모달 닫기 시 라우팅은 일반적으로 필요 없지만,
        // 현재 `CollectionDetailModal`이 닫힐 때 `window.history.back()`을 호출하므로
        // 이 라우팅 로직이 동작하는 것입니다.
        // 만약 공유 페이지에서 모달 닫기 시 홈으로 돌아가고 싶다면 `router.push('/collections/share');` 대신 `router.push('/');` 등이 될 수 있습니다.
        // `share/[id]` 페이지에서 호출되는 이 `handleCloseModal` 함수는
        // 브라우저 히스토리 백을 통해 이전 경로로 이동시키므로 이 동작은 현재 경로를 `/collections/share`로 되돌리거나
        // 이전 히스토리 스택에 따라 다른 경로로 이동시킬 수 있습니다.
        // 여기서는 `CollectionDetailModal`의 `onClose`에 전달될 `handleCloseModal`이
        // `showDetailModal` 상태만 `false`로 바꾸고 `selectedCollection`을 `null`로 만드는 역할만 하도록 분리하는 것이 좋습니다.
        setShowDetailModal(false); // CollectionDetailModal을 닫습니다.
    };

    // ⭐ '내 컬렉션으로 복사' 기능을 위한 핸들러 수정 ⭐
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
        setShowDetailModal(false); // 모달 닫기 (메시지 표시 완료 후)
        setSelectedCollection(null); // 선택된 컬렉션 초기화
        router.push('/collections'); // 나의 컬렉션 페이지로 이동 (복사 성공 시)
    }, [router]);


    useEffect(() => {
        const loadCollections = async () => {
            setLoading(true);
            try {
                const fetchedCollections = await fetchPublicCollections();
                setCollections(fetchedCollections);

                const action = searchParams?.get('action');
                if (action === 'create') {
                    setShowFormModal(true);
                    setEditingCollection(null);
                }
            } catch (e) {
                if (e instanceof Error && e.message === 'Unauthorized') {
                    window.alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
                    router.push('/user/login');
                    return;
                }
                console.error("Failed to fetch collections:", e);
                setError("컬렉션을 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };
        loadCollections();
    }, [searchParams, router]);

    const handleEditMessageShown = useCallback(() => {
        setCollectionIdToShowEditMessage(null);
    }, []);

    const handleViewDetails = (collectionId: string) => {
        const foundCollection = collections.find(col => String(col.collectionId) === collectionId);

        if (foundCollection) {
            setSelectedCollection(foundCollection);
            setShowDetailModal(true);
        } else {
            window.alert("컬렉션 정보를 찾을 수 없습니다.");
            console.warn("Collection not found in state:", collectionId);
        }
    };

    const handleReorderMessageShown = useCallback(() => {
        setCollectionIdToShowReorderMessage(null);
    }, []);

    return (
        <motion.div
            className="container mx-auto px-4 py-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">공개 컬렉션</h1>
                <div className="flex space-x-4">
                    <button
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700"
                        onClick={() => {
                            router.push('/collections');
                        }}
                    >
                        나의 컬렉션으로
                    </button>
                </div>
            </div>

            {loading && <div className="text-center py-12 text-gray-500">로딩 중...</div>}
            {error && <div className="text-center py-12 text-red-500">{error}</div>}

            {!loading && !error && (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <AnimatePresence>
                        {collections.map((col) => (
                            <motion.div
                                key={String(col.collectionId)}
                                variants={cardVariants}
                                layout
                            >
                                <CollectionCard
                                    collection={col}
                                    onViewDetails={() => handleViewDetails(String(col.collectionId))}
                                    // onEdit과 onDelete는 이 페이지에서는 전달하지 않습니다.
                                    showEditSuccessMessage={collectionIdToShowEditMessage === String(col.collectionId)}
                                    onEditMessageShown={handleEditMessageShown}
                                    showReorderSuccessMessage={collectionIdToShowReorderMessage === String(col.collectionId)}
                                    onReorderMessageShown={handleReorderMessageShown}
                                    // ⭐ 새로 추가: 복사 메시지 관련 prop 전달 ⭐
                                    showCopySuccessMessage={collectionIdToShowCopyMessage === String(col.collectionId)}
                                    onCopyMessageShown={handleCopyMessageShown}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
            <CollectionDetailModal
                isOpen={showDetailModal}
                onClose={handleCloseModal} // `CollectionDetailModal`의 onClose가 `handleCloseModal`을 호출
                collection={selectedCollection}
                // onDeleteItem, onReorderItems는 공유 페이지에서는 전달하지 않습니다.
                onCopyCollection={handleCopyCollection}
            />
        </motion.div>
    );
}
