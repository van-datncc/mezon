import { View, Image, Text } from "react-native";
import { styles as s } from "./SuggestItem.styles";

type SuggestItemProps = {
	avatarUrl?: string;
	symbol?: string;
	name: string;
	subText?: string;
};

const SuggestItem = ({ avatarUrl, symbol, name, subText }: SuggestItemProps) => {
	return (
		<View style={s.wrapperItem}>
			<View style={s.containerItem}>
				 {avatarUrl &&  <Image style={s.image}
              source={{
                uri: avatarUrl,
              }}
            /> }
				{symbol && <Text style={s.symbol}>{symbol}</Text>}
				<Text style={s.title}>{name}</Text>
			</View>
			<Text style={s.subText}>{subText}</Text>
		</View>
	);
};

export default SuggestItem;
