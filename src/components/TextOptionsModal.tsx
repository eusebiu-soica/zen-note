import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Indent,
  IndentDecrease,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  Underline,
} from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Popover } from './popover';

interface TextOptionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
  onAlignLeft?: () => void;
  onAlignCenter?: () => void;
  onAlignRight?: () => void;
  onIndentRight?: () => void;
  onIndentLeft?: () => void;
  onBold?: () => void;
  onItalic?: () => void;
  onUnderline?: () => void;
  onStrikethrough?: () => void;
  onBulletList?: () => void;
  onNumberedList?: () => void;
  selectedAlignment?: 'left' | 'center' | 'right';
  selectedFormats?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
  };
}

export function TextOptionsModal({
  open,
  onOpenChange,
  trigger,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
  onIndentRight,
  onIndentLeft,
  onBold,
  onItalic,
  onUnderline,
  onStrikethrough,
  onBulletList,
  onNumberedList,
  selectedAlignment = 'left',
  selectedFormats = {},
}: TextOptionsModalProps) {
  // 1. Iconițe de 18px
  const iconSize = 22;
  const activeColor = '#1f2937'; 
  const inactiveColor = '#6b7280'; 

  const figmaShadow = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  };

  // 2. Stil specific pentru Setul 1 (Aliniere)
  // Padding: Vertical 3px, Orizontal 13px -> Rezultat: 44x24
  const getAlignButtonStyle = (isActive: boolean) => 
    `items-center justify-center rounded py-[6px] px-[17.5px] ${isActive ? 'bg-white shadow-sm' : 'bg-transparent'}`;
  
  // 3. Stil specific pentru Setul 2 (Formatare, Liste, Indent)
  // Padding: Vertical 3px, Orizontal 7px -> Rezultat: 32x24
  const getOtherButtonStyle = (isActive: boolean) => 
    `items-center justify-center rounded py-[6px] px-[10px] ${isActive ? 'bg-white shadow-sm' : 'bg-transparent'}`;

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Overlay />
        <Popover.Content
          placement="top"
          align="center"
          className="rounded-2xl ml-3.5 -mt-5 bg-white"
          // width={300}
          style={figmaShadow}
        >
          {/* Padding container general: 16px */}
          <View className="p-0 py-2">
            
            <Text style={styles.title} className="text-[14px] font-regular text-[#54585C] mb-3">
              Text options
            </Text>

            <View className="gap-2">
              
              {/* --- Rândul 1 --- */}
              <View className="flex-row gap-[14px]">
                
                {/* Grup Aliniere (Set 1) */}
                <View className="flex-row bg-gray-100 rounded-xl p-1 gap-1">
                  <Pressable onPress={onAlignLeft} className={getAlignButtonStyle(selectedAlignment === 'left')}>
                    <AlignLeft size={iconSize} color={selectedAlignment === 'left' ? activeColor : inactiveColor} />
                  </Pressable>
                  <Pressable onPress={onAlignCenter} className={getAlignButtonStyle(selectedAlignment === 'center')}>
                    <AlignCenter size={iconSize} color={selectedAlignment === 'center' ? activeColor : inactiveColor} />
                  </Pressable>
                  <Pressable onPress={onAlignRight} className={getAlignButtonStyle(selectedAlignment === 'right')}>
                    <AlignRight size={iconSize} color={selectedAlignment === 'right' ? activeColor : inactiveColor} />
                  </Pressable>
                </View>

                {/* Grup Indent (Set 2) */}
                <View className="flex-row bg-gray-100 rounded-xl p-1 gap-1">
                  <Pressable onPress={onIndentRight} className={getOtherButtonStyle(false)}>
                    <Indent size={iconSize} color={inactiveColor} />
                  </Pressable>
                  <Pressable onPress={onIndentLeft} className={getOtherButtonStyle(false)}>
                    <IndentDecrease size={iconSize} color={inactiveColor} />
                  </Pressable>
                </View>
              </View>

              {/* --- Rândul 2 --- */}
              <View className="flex-row gap-[14px]">
                
                {/* Grup Formatare (Set 2) */}
                <View className="flex-row bg-gray-100 rounded-xl p-1 gap-1">
                  <Pressable onPress={onBold} className={getOtherButtonStyle(!!selectedFormats.bold)}>
                    <Bold size={iconSize} color={selectedFormats.bold ? activeColor : inactiveColor} />
                  </Pressable>
                  <Pressable onPress={onItalic} className={getOtherButtonStyle(!!selectedFormats.italic)}>
                    <Italic size={iconSize} color={selectedFormats.italic ? activeColor : inactiveColor} />
                  </Pressable>
                  <Pressable onPress={onUnderline} className={getOtherButtonStyle(!!selectedFormats.underline)}>
                    <Underline size={iconSize} color={selectedFormats.underline ? activeColor : inactiveColor} />
                  </Pressable>
                  <Pressable onPress={onStrikethrough} className={getOtherButtonStyle(!!selectedFormats.strikethrough)}>
                    <Strikethrough size={iconSize} color={selectedFormats.strikethrough ? activeColor : inactiveColor} />
                  </Pressable>
                </View>

                {/* Grup Liste (Set 2) */}
                <View className="flex-row bg-gray-100 rounded-xl p-1 gap-1">
                  <Pressable onPress={onBulletList} className={getOtherButtonStyle(false)}>
                    <List size={iconSize} color={inactiveColor} />
                  </Pressable>
                  <Pressable onPress={onNumberedList} className={getOtherButtonStyle(false)}>
                    <ListOrdered size={iconSize} color={inactiveColor} />
                  </Pressable>
                </View>

              </View>
            </View>
          </View>
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'OpenSans-Regular',
  },
});