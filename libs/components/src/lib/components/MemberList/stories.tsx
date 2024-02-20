import { Meta, Story } from '@storybook/react';
import MemberList, { MemberListProps } from '.';

export default {
	title: 'MemberList',
	component: MemberList,
} as Meta;

export const Default: Story<MemberListProps> = (args) => <MemberList {...args} />;

Default.args = {
	server: data[0],
};
