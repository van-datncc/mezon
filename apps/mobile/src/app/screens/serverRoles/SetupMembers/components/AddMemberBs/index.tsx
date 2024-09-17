import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { size, useTheme } from '@mezon/mobile-ui';
import { RolesClanEntity, UsersClanEntity } from '@mezon/store-mobile';
import { Ref, forwardRef, memo } from 'react';
import Backdrop from '../../../../../temp-ui/MezonBottomSheet/backdrop';
import { AddMemberBsContent } from './AddMemberBsContent';

interface IAddMemberBSProps {
	memberList?: UsersClanEntity[];
	role?: RolesClanEntity;
	onClose?: () => void;
}

export const AddMemberBS = memo(
	forwardRef((props: IAddMemberBSProps, ref: Ref<BottomSheetModalMethods>) => {
		const { memberList = [], role, onClose } = props;
		const { themeValue } = useTheme();

		return (
			<BottomSheetModal
				ref={ref}
				snapPoints={['90%']}
				style={{
					borderTopLeftRadius: size.s_14,
					borderTopRightRadius: size.s_14,
					overflow: 'hidden'
				}}
				backdropComponent={Backdrop}
				backgroundStyle={{ backgroundColor: themeValue.primary }}
			>
				<AddMemberBsContent memberList={memberList} role={role} onClose={onClose} />
			</BottomSheetModal>
		);
	})
);
