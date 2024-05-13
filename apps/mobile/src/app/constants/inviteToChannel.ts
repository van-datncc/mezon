import { EMaxUserCanInvite } from "../enums";
import { IExpireLinkOption } from "../models";

//TODO: update later when BE is ready
export const LINK_EXPIRE_OPTION: IExpireLinkOption[] = [
	{
		value: 1,
		label: 'NEVER'
	},
	{
		value: 2,
		label: '7 DAYS'
	},
	{
		value: 3,
		label: '1 DAY'
	},
	{
		value: 4,
		label: '12 HOURS'
	},
	{
		value: 5,
		label: '6 HOURS'
	},
	{
		value: 6,
		label: '1 HOURS'
	},
	{
		value: 7,
		label: '30 MINS'
	}
];

export const MAX_USER_OPTION = [
    EMaxUserCanInvite.Infinity,
    EMaxUserCanInvite.One,
    EMaxUserCanInvite.Five,
    EMaxUserCanInvite.Ten,
    EMaxUserCanInvite.TwentyFive,
    EMaxUserCanInvite.Fifty,
    EMaxUserCanInvite.OneHundred
];
