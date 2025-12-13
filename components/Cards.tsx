import { View, type ViewProps } from "react-native";
import { Shadows } from "@/constants/Shadows";
import { useThemeColors } from "@/hooks/useThemeColors";


type  Props=ViewProps
export function Card({style, ...rest}:Props){
    const colors =  useThemeColors()
    return <View style={[style, styles, {backgroundColor: colors.grayDark} ]} {...rest}/>
}
const styles = {
    borderRadius:8,
    ...Shadows.dp2
} satisfies ViewProps   