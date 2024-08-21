import React from 'react';
import { ITabs } from './tabSideBar';
import { Icons } from '@mezon/ui';

export const appDetailTabs: ITabs[] = [
	{ name: 'General Information', routerLink: 'information', icon: <Icons.AdminHomeIcon /> },
	{ name: 'Installation', routerLink: 'installation', icon: <Icons.AdminSettingIcon /> },
];
