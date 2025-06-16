// app/collections/modify/page.tsx
"use client";
import Link from "next/link";
import { Home, Settings } from "lucide-react";
import { Inbox, List } from "lucide-react"
import { useState, useEffect, useCallback } from "react";
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import CollectionFormModal from "@/components/Collection/CollectionFormModal";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
} from "@/components/ui/sidebar"

import { useCollections } from "@/hooks/useCollections";
import CollectionItemsView from "@/components/Collection/CollectionItemsView";
import type { Collection, CollectionItem } from '@/types/collection';
// API 함수 임포트
import { createCollection, updateCollection, deleteCollectionItem, addCollectionItemToExisting, updateCollectionItemsFull } from "@/lib/api/collections";
import { useRouter } from "next/navigation";

// framer-motion import
import { motion, AnimatePresence } from "framer-motion";
import {
    slideInUpVariants,
    containerVariants, // 메인 컨테이너 및 섹션 애니메이션
    overlayVariants,    // 모달 오버레이 애니메이션
    modalContentVariants, // 모달 내용 애니메이션
    cardVariants // 컬렉션 아이템 뷰(카드) 등장/삭제 애니메이션 (재활용)
} from "@/lib/animations/framerVariants"; // 기존 Variants 임포트
import { useTheme } from "next-themes"

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme() // 다크모드
    const { collections, loading, error, refetchCollections, setCollections } = useCollections();

    const [openedCollectionIds, setOpenedCollectionIds] = useState<string[]>([]);
    const router = useRouter();

    const [showFormModal, setShowFormModal] = useState(false);
    const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

    const handleFormSubmit = async (
        name: string,
        description: string,
        isPublic: boolean,
        collectionId?: string
    ) => {
        try {
            if (collectionId) {
                const collectionIdAsNumber = Number(collectionId);
                if (isNaN(collectionIdAsNumber)) {
                    window.alert("수정할 컬렉션 ID가 유효하지 않습니다. 다시 시도해주세요.");
                    return;
                }
                await updateCollection({
                    collectionId: collectionIdAsNumber,
                    name,
                    description,
                    isPublic,
                });
                window.alert("컬렉션이 성공적으로 수정되었습니다.");
            } else {
                await createCollection({ name, description, isPublic });
            }

            setShowFormModal(false); 
            setEditingCollection(null); 
            //수정하고 다시 불러옴
            await refetchCollections();
        } catch (e: any) {
            console.error("API 호출 중 오류 발생:", e);
            if (e instanceof Error && e.message === 'Unauthorized') {
                window.alert('로그인이 만료되었습니다. 다시 로그인 해주세요.');
                router.push('/user/login');
                return;
            }
            const errorMessage = e.response?.data?.message || e.message || '알 수 없는 오류';
            window.alert(`작업에 실패했습니다: ${errorMessage}`);
        }
    };

    // 사이드바 컬렉션 버튼 클릭 핸들러
    const handleCollectionClick = useCallback((collectionId: string) => {
        setOpenedCollectionIds(prevIds => {
            if (prevIds.includes(collectionId)) {
                return prevIds.filter(id => id !== collectionId);
            } else {
                return [...prevIds, collectionId];
            }
        });
    }, []);

    // "새 컬렉션 만들기" 버튼 클릭 핸들러 (모달 열기)
    const handleCreateCollectionClick = useCallback(() => {
        setEditingCollection(null); // 새 컬렉션이므로 편집 중인 컬렉션 없음
        setShowFormModal(true); // 모달 열기
    }, []);

    // CollectionItemsView에서 컬렉션 뷰를 닫는 핸들러 (X 버튼 클릭 시)
    const handleCloseCollectionView = useCallback((collectionIdToClose: string) => {
        setOpenedCollectionIds(prevIds => prevIds.filter(id => id !== collectionIdToClose));
    }, []);

    // CollectionItemsView에서 아이템 삭제가 확정되었을 때 호출될 핸들러
    const handleDeleteItemConfirmed = useCallback(async (collectionId: string, itemId: string) => {
        if (!window.confirm(`정말로 이 아이템을 컬렉션에서 삭제하시겠습니까?`)) {
            throw new Error('Deletion cancelled by user.');
        }
        try {
            await deleteCollectionItem(Number(collectionId), Number(itemId));
            // window.alert("아이템이 성공적으로 삭제되었습니다.");
            await refetchCollections();
        } catch (err: any) {
            console.error("메인 레이아웃: 아이템 삭제 중 오류 발생:", err);
            if (err.message !== 'Deletion cancelled by user.') {
                window.alert(`아이템 삭제에 실패했습니다: ${err.message || '알 수 없는 오류'}`);
            }
            throw err;
        }
    }, [refetchCollections]);

    // DND 로직의 핵심: onDragEnd 핸들러
    const onDragEnd = useCallback(async (result: DropResult) => {
        const { source, destination, draggableId } = result;

        if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
            return;
        }

        const draggedItem = collections.flatMap(col => col.items)
            .find(item => String(item.collectionItemId) === draggableId);

        if (!draggedItem) {
            console.error("onDragEnd: 드래그된 아이템을 찾을 수 없습니다.");
            return;
        }

        const sourceCollection = collections.find(col => String(col.collectionId) === source.droppableId);
        const destinationCollection = collections.find(col => String(col.collectionId) === destination.droppableId);

        if (!sourceCollection || !destinationCollection) {
            console.error("onDragEnd: 원본 또는 대상 컬렉션을 찾을 수 없습니다.");
            return;
        }

        try {
            if (source.droppableId === destination.droppableId) {
                // 같은 컬렉션 내에서 순서만 변경 (Reorder)
                console.log(`컬렉션 내부 순서 변경: ${source.droppableId}`);
                const itemsInCollection = [...sourceCollection.items].sort((a, b) => a.itemOrder - b.itemOrder);
                const [movedItem] = itemsInCollection.splice(source.index, 1);
                itemsInCollection.splice(destination.index, 0, movedItem);

                const updatedItemsPayload = itemsInCollection.map((item, index) => ({
                    id: item.collectionItemId, // collectionItemId 대신 id로 변경
                    itemOrder: index,
                }));

                await updateCollectionItemsFull(source.droppableId, updatedItemsPayload);
                // window.alert("아이템 순서가 성공적으로 변경되었습니다.");
            } else {
                // 다른 컬렉션으로 아이템 이동 (Move between lists)
                console.log(`컬렉션 간 이동: ${source.droppableId} -> ${destination.droppableId}`);

                // 1. 원본 컬렉션에서 아이템 삭제 (API 호출)
                await deleteCollectionItem(Number(source.droppableId), Number(draggableId));

                // 2. 대상 컬렉션에 아이템 추가 (API 호출)
                const itemDtoForNewCollection = {
                    collectionId: Number(destination.droppableId), // DTO에 collectionId 포함
                    contentTitle: draggedItem.contentTitle,
                    contentType: draggedItem.contentType as "music" | "activity" | "book",
                    contentId: draggedItem.contentId || '',
                    itemOrder: destination.index, // 새로운 위치에 대한 초기 순서
                };
                await addCollectionItemToExisting(Number(destination.droppableId), itemDtoForNewCollection);

                // 3. 원본 컬렉션의 남은 아이템 순서 재정렬 및 업데이트
                const sourceItemsRemaining = sourceCollection.items
                    .filter(item => String(item.collectionItemId) !== draggableId)
                    .sort((a, b) => a.itemOrder - b.itemOrder);
                const updatedSourceItemsPayload = sourceItemsRemaining.map((item, index) => ({
                    id: item.collectionItemId, // collectionItemId 대신 id로 변경
                    itemOrder: index,
                }));
                await updateCollectionItemsFull(source.droppableId, updatedSourceItemsPayload);

                // window.alert("아이템이 컬렉션 간 성공적으로 이동되었습니다.");
            }

            await refetchCollections(); // 모든 작업 성공 후 전체 컬렉션 새로고침
        } catch (error: any) {
            console.error("DND 작업 실패:", error);
            window.alert(`아이템 이동/순서 변경에 실패했습니다: ${error.message || '알 수 없는 오류'}`);
            await refetchCollections(); // 오류 시 롤백 (이전 상태로 복원)
        }
    }, [collections, refetchCollections, setCollections]);

    return (
        <div className="min-h-screen flex">
            <SidebarProvider>
                <div className="flex flex-grow ">
                    <Sidebar className="flex pt-[70px] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-colors duration-300">
                        <SidebarContent>
                            <SidebarGroup className="mt-6">
                                <SidebarGroupLabel className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                                    나의 컬렉션 목록
                                </SidebarGroupLabel>
                                <SidebarGroupContent>
                                    {loading ? (
                                        <p className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">컬렉션 로딩 중...</p>
                                    ) : error ? (
                                        <p className="px-4 py-2 text-sm text-red-500">{error}</p>
                                    ) : collections.length === 0 ? (
                                        <motion.div
                                            key="no-collections-sidebar-message"
                                            className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400"
                                        >
                                            컬렉션이 없습니다.
                                        </motion.div>
                                    ) : (
                                        <SidebarMenu>
                                            <AnimatePresence mode="popLayout">
                                                {collections.map((collection) => {
                                                    return (
                                                        <motion.div
                                                            key={String(collection.collectionId)} // 고유한 key 필수
                                                            layout 
                                                        >
                                                             <SidebarMenuItem>
                                                                <SidebarMenuButton
                                                                    onClick={() => handleCollectionClick(String(collection.collectionId))}
                                                                    className={
                                                                        openedCollectionIds.includes(String(collection.collectionId))
                                                                            ? "bg-pink-500 text-white hover:bg-pink-600 dark:bg-pink-700 dark:hover:bg-pink-800" // 선택된 상태일 때 핑크색, 호버 시 더 진한 핑크
                                                                            : "hover:bg-gray-100 dark:hover:bg-gray-700 data-[active=true]:bg-pink-100 dark:data-[active=true]:bg-pink-900/30 data-[active=true]:text-pink-700 dark:data-[active=true]:text-pink-300 transition-colors duration-300" // 선택되지 않은 상태일 때 회색 호버 및 data-active 스타일
                                                                    }
                                                                >
                                                                    <List className="size-4" /> {collection.name}
                                                                </SidebarMenuButton>
                                                            </SidebarMenuItem>
                                                        </motion.div>
                                                    );
                                                })}
                                            </AnimatePresence>
                                            <SidebarMenuItem key={"create-new-collection"}>
                                                <SidebarMenuButton onClick={handleCreateCollectionClick}>
                                                    <List className="size-4" /> + 새 컬렉션 만들기
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        </SidebarMenu>
                                    )}
                                </SidebarGroupContent>
                            </SidebarGroup>
                        </SidebarContent>
                        <SidebarRail />
                    </Sidebar>

                    {/* DragDropContext를 메인 콘텐츠 영역을 감싸도록 이동 */}
                    <DragDropContext onDragEnd={onDragEnd}>
                        {/* 메인 콘텐츠 영역에 containerVariants 적용 */}
                        <motion.main
                            className="flex-1 p-8 transition-colors duration-300 flex flex-wrap gap-8 justify-center"
                            variants={containerVariants} // 메인 컨테이너 등장 애니메이션
                            initial="hidden"
                            animate="visible"
                            layout // 메인 컨테이너 크기 변화 애니메이션
                        >
                            <AnimatePresence mode="popLayout"> {/* "popLayout" 모드를 사용하여 요소들이 삭제될 때 공간을 유지하면서 부드럽게 사라지게 합니다. */}
                                {openedCollectionIds.length > 0 ? (
                                    openedCollectionIds.map(id => {
                                        const collectionToDisplay = collections.find(col => String(col.collectionId) === id);
                                        if (collectionToDisplay) {
                                            return (
                                                <motion.div
                                                    key={id}
                                                    className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 min-w-[300px]"
                                                    variants={slideInUpVariants} // 또는 slideInRightVariants 사용
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                    // 이 경우에도 layout prop을 사용하면 늘어남 효과가 발생할 수 있으니 제거하거나 신중하게 사용
                                                    // layout 
                                                >
                                                <CollectionItemsView
                                                    collection={collectionToDisplay}
                                                    onDeleteItemConfirmed={handleDeleteItemConfirmed}
                                                    onCloseView={handleCloseCollectionView}
                                                />
                                                </motion.div>
                                            );
                                        }
                                        return null;
                                    })
                                ) : (
                                    // 열린 컬렉션이 없을 때 메시지도 애니메이션 적용
                                    <motion.div
                                        key="empty-state" // AnimatePresence가 작동하도록 key 추가
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            visible: { opacity: 1, y: 0, transition: { delay: 0.2 } },
                                            exit: { opacity: 0, y: 20, transition: { duration: 0.1 } },
                                        }}
                                        className="w-full flex justify-center items-center text-gray-500 dark:text-gray-400 text-lg"
                                    >
                                        {children}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.main>
                    </DragDropContext>
                </div>
            </SidebarProvider>
            {/* 컬렉션 생성/수정 모달은 레이아웃에 직접 렌더링 */}
            <AnimatePresence>
                {showFormModal && (
                    <motion.div
                        variants={overlayVariants} // 오버레이 애니메이션
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            variants={modalContentVariants} // 모달 내용 애니메이션
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="w-full max-w-md mx-auto"
                        >
                            <CollectionFormModal
                                isOpen={showFormModal}
                                onClose={() => {
                                    setShowFormModal(false);
                                    setEditingCollection(null);
                                }}
                                editingCollection={editingCollection}
                                onSubmit={handleFormSubmit}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}