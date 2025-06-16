import { Icons } from '@mezon/ui';
import { formatNumber } from '@mezon/utils';
import React from 'react';
import { ButtonCopy } from '../../../components';
import { CURRENCY, TRANSACTION_DETAIL } from '../constans/constans';

interface TransactionDetailProps {
    detailLedger: any;
    formatDate: (dateString: string) => string;
    isLoading?: boolean;
}

const TransactionDetailSkeleton: React.FC = () => (
    <div className="border-t dark:border-gray-700 border-gray-200 p-4 dark:bg-gray-900/50 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, idx) => (
                <div key={idx} className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full dark:bg-gray-700 bg-gray-300" />
                        <div className="h-3 w-16 dark:bg-gray-700 bg-gray-300 rounded" />
                    </div>
                    <div className="h-5 w-32 dark:bg-gray-700 bg-gray-300 rounded ml-5" />
                </div>
            ))}
        </div>
    </div>
);

const TransactionDetail: React.FC<TransactionDetailProps> = React.memo(({ detailLedger, formatDate, isLoading = false }) => {
    if (isLoading) {
        return <TransactionDetailSkeleton />;
    }

    if (!detailLedger) {
        return null;
    }

    const { FIELDS } = TRANSACTION_DETAIL;

    const detailFields = [
        { label: FIELDS.TRANSACTION_ID, value: detailLedger.trans_id, icon: Icons.Transaction },
        { label: FIELDS.SENDER, value: detailLedger.sender_username, icon: Icons.UserIcon },
        { label: FIELDS.AMOUNT, value: `${formatNumber(detailLedger.amount, CURRENCY.CODE)} ${CURRENCY.SYMBOL}`, icon: () => <Icons.DollarIcon defaultSize="w-3 h-3" isWhite /> },
        { label: FIELDS.RECEIVER, value: detailLedger.receiver_username, icon: Icons.UserIcon },
        { label: FIELDS.NOTE, value: detailLedger.metadata || TRANSACTION_DETAIL.DEFAULT_NOTE, icon: Icons.PenEdit },
        { label: FIELDS.CREATED, value: formatDate(detailLedger.create_time ?? ''), icon: () => <Icons.ClockHistory defaultSize='w-3 h-3' /> },
    ];

    return (
        <div className="border-t dark:border-gray-700 border-gray-200 p-4 dark:bg-gray-900/50 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {detailFields.map(({ label, value, icon: Icon }) => (
                    <div key={value} className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Icon className="w-3 h-3 dark:text-gray-400 text-gray-500" />
                            <p className="dark:text-gray-400 text-gray-600 text-xs font-medium uppercase tracking-wide">
                                {label}
                            </p>
                            {label === FIELDS.TRANSACTION_ID && value && (
                                <span onClick={e => e.stopPropagation()}>
                                    <ButtonCopy
                                        copyText={value}
                                        className="p-1"
                                        duration={TRANSACTION_DETAIL.COPY_DURATION}
                                    />
                                </span>
                            )}
                        </div>
                        <p className="dark:text-white text-gray-900 text-sm font-medium break-all pl-5">{value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default TransactionDetail;
