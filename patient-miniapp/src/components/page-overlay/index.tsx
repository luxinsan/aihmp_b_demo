import type { ReactNode } from "react";
import { Text, View } from "@tarojs/components";

type FloatingActionProps = {
  icon: string;
  label: string;
  onClick?: () => void;
};

type BottomSheetProps = {
  title: string;
  children?: ReactNode;
  onMaskClick?: () => void;
};

export function PageFloatingAction({ icon, label, onClick }: FloatingActionProps) {
  return (
    <View className="page-floating-action" onClick={onClick}>
      <View className="page-floating-action-icon">{icon}</View>
      <Text className="page-floating-action-label">{label}</Text>
    </View>
  );
}

export function PageBottomSheet({ title, children, onMaskClick }: BottomSheetProps) {
  return (
    <View className="page-bottom-sheet">
      <View className="page-bottom-sheet-mask" onClick={onMaskClick} />
      <View className="page-bottom-sheet-panel">
        <View className="page-bottom-sheet-handle" />
        <Text className="page-bottom-sheet-title">{title}</Text>
        {children}
      </View>
    </View>
  );
}
