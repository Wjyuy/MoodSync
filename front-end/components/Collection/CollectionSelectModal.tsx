// components/Collection/CollectionSelectModal.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
// Collection 타입은 이제 `collectionId` 필드를 직접 참조할 수 있도록 재정의하거나
// 아니면 아래 코드에서 `collection.collectionId`를 직접 사용합니다.
// 여기서는 `collection.collectionId`로 직접 접근하는 방식으로 수정합니다.
import type { Collection } from "@/types/collection"; // Collection 타입 정의를 다시 확인하세요!
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import type { MusicRecommendation, ActivityRecommendation, BookRecommendation } from "@/types";
import { useRouter } from 'next/navigation';
interface CollectionSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  collections: Collection[]; // 이 collections의 각 요소가 { collectionId: number, ... } 형태일 것임
  itemToAdd: MusicRecommendation | ActivityRecommendation | BookRecommendation | null;
  itemType: "music" | "activity" | "book" | null;
  onSelectCollection: (collectionId: number, item: any, type: "music" | "activity" | "book") => void;
}

export default function CollectionSelectModal({
  isOpen,
  onClose,
  collections,
  itemToAdd,
  itemType,
  onSelectCollection,
}: CollectionSelectModalProps) {
  // selectedCollectionId는 number 타입.
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | null>(null);
  const router = useRouter();
  useEffect(() => {
    if (isOpen) {
      setSelectedCollectionId(null);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (selectedCollectionId !== null && itemToAdd && itemType) {
      onSelectCollection(selectedCollectionId, itemToAdd, itemType);
      onClose();
    } else {
      alert("컬렉션을 선택해 주세요.");
    }
  };

  const getItemTitle = (item: MusicRecommendation | ActivityRecommendation | BookRecommendation | null) => {
    if (!item) return '';
    if ('title' in item) {
      return item.title;
    } else if ('activity' in item) {
      return item.activity;
    }
    return '';
  };

  // 디버깅 로그를 유지하여 변화를 확인합니다.
  useEffect(() => {
    // console.log("CollectionSelectModal - isOpen:", isOpen);
    // console.log("CollectionSelectModal - collections (received):", collections);
    // console.log("CollectionSelectModal - selectedCollectionId (state):", selectedCollectionId);
    if (collections.length > 0 && selectedCollectionId === null) {
      // collections가 비어있지 않고, 아직 아무것도 선택되지 않았을 때
      setSelectedCollectionId(Number(collections[0].collectionId));
    }
  }, [isOpen, collections, selectedCollectionId]);

 const handleGoToCreateCollection = () => {
    onClose(); // 모달 닫기
    router.push('/collections?action=create'); // 컬렉션 생성 페이지로 이동 (예시 경로)
    // 실제 컬렉션 생성 페이지의 경로로 변경해야 합니다.
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>어떤 컬렉션에 추가하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>
            선택된 항목 "{getItemTitle(itemToAdd)}" 을(를) 추가할 컬렉션을 선택하세요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="max-h-60 overflow-y-auto pr-4">
          {collections.length === 0 ? (
            <div className="text-center">
            <p className="text-center text-gray-500 dark:text-gray-400">
              추가할 컬렉션이 없습니다. 먼저 컬렉션을 생성해 주세요.
            </p>
              <Button onClick={handleGoToCreateCollection} className="mt-2">
                컬렉션 생성 페이지로 이동
              </Button>
            </div>
          ) : (
            <RadioGroup
              value={selectedCollectionId !== null ? String(selectedCollectionId) : ""}
              onValueChange={(value) => {
                // console.log("RadioGroup onValueChange (raw string value):", value);
                setSelectedCollectionId(Number(value)); // '3', '2' 같은 문자열이 올 것임
              }}
            >
              {collections.map((collection) => {
                // 핵심 변경: `collection.id` 대신 `collection.collectionId` 사용
                // 그리고 이 값이 number이므로 String()으로 변환하여 라디오 버튼 value로 사용
                const collectionActualId = (collection as any).collectionId; // 타입을 Collection으로 유지하면서 임시로 any
                const collectionIdString = collectionActualId !== undefined && collectionActualId !== null
                    ? String(collectionActualId)
                    : `temp-${Math.random()}`; // 임시 ID 생성 (문제 없으면 사용되지 않음)

                // console.log(`Rendering collection: name=${collection.name}, actualId=${collectionActualId}, idStringForRadio=${collectionIdString}`);

                return (
                  <div
                    key={collectionIdString} // 고유한 key
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                  >
                    <RadioGroupItem
                      value={collectionIdString} // 라디오 버튼의 실제 값 (string)
                      id={`collection-${collectionIdString}`} // HTML id
                    />
                    <Label
                      htmlFor={`collection-${collectionIdString}`}
                      className="flex-1 cursor-pointer"
                    >
                      <span className="font-semibold">{collection.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {collection.itemCount ? `(${collection.itemCount})` : ''}
                      </span>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            // selectedCollectionId가 null이 아니고, collections가 비어있지 않아야 활성화
            disabled={selectedCollectionId === null || collections.length === 0}
          >
            추가
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}