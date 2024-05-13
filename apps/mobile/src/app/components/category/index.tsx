import { forwardRef } from 'react';
import { Text } from 'react-native';
import BottomSheet, { } from 'react-native-raw-bottom-sheet';

interface IProps {

}

export default forwardRef<any, IProps>(function CategoryDrawer(props, ref) {
    return (
        <BottomSheet
            ref={ref}
            customModalProps={{
                animationType: 'slide',
                statusBarTranslucent: true,
            }}
            height={700}
            draggable
            dragOnContent
            customStyles={{
                container: {
                    backgroundColor: 'black'
                }
            }}
        >
            <Text style={{color: "white"}}>Hello</Text>
        </BottomSheet>
    )
})